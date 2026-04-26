"""
Flask API for Camera Monitoring Service
Integrates with live_exam_detection.py for proctor monitoring
"""

from flask import Flask, jsonify, Response, request
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
from collections import deque
import threading
import base64
import json
import os
import time

# Try to import keras/tensorflow - may not be available on all Python versions
try:
    from tensorflow import keras
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
except ImportError:
    keras = None
    preprocess_input = None
    print("⚠️ Warning: TensorFlow/Keras not available - AI model features disabled")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "http://localhost:5173", "http://localhost:5000"]}})

# GLOBAL STATE MANAGEMENT
monitoring_active = False
stream_thread = None
cap = None
face_landmarker = None
ai_model = None

current_detections = {
    "timestamp": None,
    "frame": None,
    "alerts": [],
    "student_count": 0,
    "is_monitoring": False
}

# Model paths
MODEL_PATH = "backend/FINAL_CLEAN_MODEL.keras"
FACE_LANDMARKER_PATH = "backend/face_landmarker.task"

IMG_SIZE = 224
AI_THRESHOLD = 0.60
HEAD_TURN_THRESHOLD = 0.05
HEAD_DOWN_THRESHOLD = 0.05
SUSPICION_LIMIT = 60

suspicion_scores = {}
behavior_history = {}

def load_models():
    """Load AI models"""
    global ai_model, face_landmarker
    
    # Try loading keras model only if keras is available
    if keras is not None:
        try:
            if os.path.exists(MODEL_PATH):
                ai_model = keras.models.load_model(MODEL_PATH)
                print("✅ AI Model loaded successfully")
            else:
                print("⚠️ AI Model not found at", MODEL_PATH)
        except Exception as e:
            print(f"❌ Error loading AI model: {e}")
    else:
        print("⚠️ Keras not available - skipping AI model load")

    try:
        BaseOptions = mp.tasks.BaseOptions
        FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
        VisionRunningMode = mp.tasks.vision.RunningMode
        
        if os.path.exists(FACE_LANDMARKER_PATH):
            options = FaceLandmarkerOptions(
                base_options=BaseOptions(model_asset_path=FACE_LANDMARKER_PATH),
                running_mode=VisionRunningMode.VIDEO,
                num_faces=10
            )
            face_landmarker = mp.tasks.vision.FaceLandmarker.create_from_options(options)
            print("✅ Face Landmarker loaded successfully")
        else:
            print("⚠️ Face Landmarker model not found at", FACE_LANDMARKER_PATH)
    except Exception as e:
        print(f"❌ Error loading Face Landmarker: {e}")

def initialize_camera():
    """Initialize camera capture"""
    global cap
    try:
        cap = cv2.VideoCapture(0)
        if cap.isOpened():
            print("✅ Camera initialized successfully")
            return True
        else:
            print("❌ Failed to open camera")
            return False
    except Exception as e:
        print(f"❌ Error initializing camera: {e}")
        return False

def process_frame(frame):
    """Process frame for detections"""
    if frame is None or face_landmarker is None:
        return frame, []
    
    # If AI model isn't available, do basic face detection with head behavior
    if ai_model is None or preprocess_input is None:
        try:
            h, w, _ = frame.shape
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

            result = face_landmarker.detect_for_video(
                mp_image,
                int(time.time() * 1000)
            )

            alerts = []
            student_count = 0

            if result.face_landmarks:
                student_count = len(result.face_landmarks)

                for idx, landmarks in enumerate(result.face_landmarks):
                    student_id = idx

                    if student_id not in suspicion_scores:
                        suspicion_scores[student_id] = 0
                        behavior_history[student_id] = deque(maxlen=30)

                    # Head behavior analysis
                    nose_x = landmarks[1].x
                    left_x = landmarks[234].x
                    right_x = landmarks[454].x
                    nose_y = landmarks[1].y
                    chin_y = landmarks[152].y

                    face_center_x = (left_x + right_x) / 2
                    horizontal_offset = nose_x - face_center_x
                    vertical_offset = nose_y - chin_y

                    behavior = "FORWARD"
                    if abs(horizontal_offset) > HEAD_TURN_THRESHOLD:
                        behavior = "LEFT/RIGHT"
                    elif vertical_offset > HEAD_DOWN_THRESHOLD:
                        behavior = "DOWN"
                    elif vertical_offset < -HEAD_DOWN_THRESHOLD:
                        behavior = "UP"

                    behavior_history[student_id].append(behavior)

                    if behavior == "LEFT/RIGHT":
                        suspicion_scores[student_id] += 2
                    elif behavior == "DOWN":
                        suspicion_scores[student_id] += 3
                    else:
                        suspicion_scores[student_id] -= 1

                    suspicion_scores[student_id] = max(0, min(100, suspicion_scores[student_id]))

                    is_alert = suspicion_scores[student_id] > SUSPICION_LIMIT and behavior in {"LEFT/RIGHT", "DOWN"}
                    status_label = "CHEATING" if is_alert else "NORMAL"
                    display_text = f"Student {student_id + 1}: {status_label} | {behavior} | Score: {suspicion_scores[student_id]}"
                    color = (0, 0, 255) if is_alert else (0, 255, 0)

                    # Get face bounding box for drawing
                    xs = [lm.x for lm in landmarks]
                    ys = [lm.y for lm in landmarks]

                    x_min = max(0, int(min(xs) * w))
                    x_max = min(w, int(max(xs) * w))
                    y_min = max(0, int(min(ys) * h))
                    y_max = min(h, int(max(ys) * h))

                    if is_alert:
                        alerts.append({
                            "student_id": student_id,
                            "alert": "ALERT: Suspicious activity detected!",
                            "suspicion_score": float(f"{suspicion_scores[student_id] / 100:.2f}"),
                            "reason": behavior
                        })

                    cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), color, 2)
                    cv2.putText(frame, display_text, (x_min, y_min - 10),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

            current_detections["timestamp"] = time.time()
            current_detections["alerts"] = alerts
            current_detections["student_count"] = student_count
            current_detections["is_monitoring"] = True

            return frame, alerts
        except Exception as e:
            print(f"❌ Error in basic face detection: {e}")
            return frame, []

    try:
        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

        result = face_landmarker.detect_for_video(
            mp_image,
            int(time.time() * 1000)
        )

        alerts = []
        student_count = 0

        if result.face_landmarks:
            student_count = len(result.face_landmarks)

            for idx, landmarks in enumerate(result.face_landmarks):
                student_id = idx

                if student_id not in suspicion_scores:
                    suspicion_scores[student_id] = 0
                    behavior_history[student_id] = deque(maxlen=30)

                # Get face bounding box
                xs = [lm.x for lm in landmarks]
                ys = [lm.y for lm in landmarks]

                x_min = max(0, int(min(xs) * w))
                x_max = min(w, int(max(xs) * w))
                y_min = max(0, int(min(ys) * h))
                y_max = min(h, int(max(ys) * h))

                face_crop = frame[y_min:y_max, x_min:x_max]
                if face_crop.size == 0:
                    continue

                # AI model prediction
                face_resized = cv2.resize(face_crop, (IMG_SIZE, IMG_SIZE))
                face_resized = cv2.cvtColor(face_resized, cv2.COLOR_BGR2RGB)
                face_resized = np.expand_dims(face_resized, axis=0)
                face_resized = preprocess_input(face_resized)

                probability = 1.0
                if ai_model is not None:
                    prediction = ai_model.predict(face_resized, verbose=0)
                    probability = float(prediction[0][0])

                # Head behavior analysis using landmark indices
                nose_x = landmarks[1].x
                left_x = landmarks[234].x
                right_x = landmarks[454].x
                nose_y = landmarks[1].y
                chin_y = landmarks[152].y

                face_center_x = (left_x + right_x) / 2
                horizontal_offset = nose_x - face_center_x
                vertical_offset = nose_y - chin_y

                behavior = "FORWARD"
                if abs(horizontal_offset) > HEAD_TURN_THRESHOLD:
                    behavior = "LEFT/RIGHT"
                elif vertical_offset > HEAD_DOWN_THRESHOLD:
                    behavior = "DOWN"
                elif vertical_offset < -HEAD_DOWN_THRESHOLD:
                    behavior = "UP"

                behavior_history[student_id].append(behavior)

                if behavior == "LEFT/RIGHT":
                    suspicion_scores[student_id] += 2
                elif behavior == "DOWN":
                    suspicion_scores[student_id] += 3
                else:
                    suspicion_scores[student_id] -= 1

                if probability < AI_THRESHOLD and behavior != "FORWARD":
                    suspicion_scores[student_id] += 2

                suspicion_scores[student_id] = max(0, min(100, suspicion_scores[student_id]))

                is_alert = suspicion_scores[student_id] > SUSPICION_LIMIT and behavior in {"LEFT/RIGHT", "DOWN"}
                status_label = "CHEATING" if is_alert else "NORMAL"
                display_text = f"Student {student_id + 1}: {status_label} | {behavior} | Score: {suspicion_scores[student_id]}"
                color = (0, 0, 255) if is_alert else (0, 255, 0)

                if is_alert:
                    alerts.append({
                        "student_id": student_id,
                        "alert": "ALERT: Suspicious activity detected!",
                        "suspicion_score": float(f"{suspicion_scores[student_id] / 100:.2f}"),
                        "reason": behavior
                    })

                cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), color, 2)
                cv2.putText(frame, display_text, (x_min, y_min - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        current_detections["timestamp"] = time.time()
        current_detections["alerts"] = alerts
        current_detections["student_count"] = student_count
        current_detections["is_monitoring"] = True

        return frame, alerts

    except Exception as e:
        print(f"❌ Error processing frame: {e}")
        return frame, []

def monitoring_loop():
    """Continuous monitoring loop"""
    global cap, current_detections, monitoring_active
    
    if not initialize_camera():
        print("⚠️ Camera initialization failed - using dummy mode")
        # Continue anyway in dummy mode
        current_detections["student_count"] = 0
        current_detections["alerts"] = []

    frame_count = 0
    while monitoring_active:
        try:
            # If camera isn't available, generate dummy data
            if cap is None:
                frame_count += 1
                current_detections["timestamp"] = time.time()
                current_detections["student_count"] = 0
                current_detections["alerts"] = []
                current_detections["is_monitoring"] = True
                time.sleep(0.033)  # ~30 FPS
                continue

            ret, frame = cap.read()
            if not ret:
                time.sleep(0.033)
                continue

            # Process frame
            processed_frame, alerts = process_frame(frame)
            
            if processed_frame is not None:
                # Convert frame to JPEG
                ret, buffer = cv2.imencode('.jpg', processed_frame)
                if ret:
                    frame_base64 = base64.b64encode(buffer).decode('utf-8')
                    current_detections["frame"] = frame_base64
                    frame_count += 1

            time.sleep(0.033)  # ~30 FPS

        except Exception as e:
            print(f"❌ Error in monitoring loop: {e}")
            time.sleep(0.1)  # Wait before retrying
            continue  # Don't break, keep trying

    if cap is not None:
        cap.release()
        print("✅ Camera released")

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok", 
        "service": "camera_monitoring",
        "monitoring_active": monitoring_active,
        "models_loaded": {
            "ai_model": ai_model is not None,
            "face_landmarker": face_landmarker is not None
        }
    })

@app.route('/health', methods=['GET'])
def health_simple():
    """Simple health check endpoint for frontend"""
    return jsonify({"status": "ok"})

@app.route('/api/monitoring/start', methods=['POST'])
def start_monitoring():
    """Start camera monitoring"""
    global monitoring_active, stream_thread

    try:
        if monitoring_active:
            return jsonify({"error": "Monitoring already active", "status": "already_running"}), 200

        monitoring_active = True
        stream_thread = threading.Thread(target=monitoring_loop, daemon=True)
        stream_thread.start()
        print("✅ Monitoring thread started")

        return jsonify({"status": "monitoring_started"})
    except Exception as e:
        print(f"❌ Error starting monitoring: {e}")
        monitoring_active = False
        return jsonify({"error": str(e)}), 500

@app.route('/api/monitoring/stop', methods=['POST'])
def stop_monitoring():
    """Stop camera monitoring"""
    global monitoring_active

    try:
        monitoring_active = False
        print("✅ Monitoring stopped")
        return jsonify({"status": "monitoring_stopped"})
    except Exception as e:
        print(f"❌ Error stopping monitoring: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/monitoring/status', methods=['GET'])
def get_status():
    """Get current monitoring status"""
    try:
        return jsonify({
            "monitoring_active": monitoring_active,
            "student_count": current_detections["student_count"],
            "alerts": current_detections["alerts"],
            "timestamp": current_detections["timestamp"]
        })
    except Exception as e:
        print(f"❌ Error getting status: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/monitoring/frame', methods=['GET'])
def get_frame():
    """Get current frame as base64"""
    try:
        return jsonify({
            "frame": current_detections["frame"],
            "timestamp": current_detections["timestamp"],
            "alerts": current_detections["alerts"],
            "student_count": current_detections["student_count"]
        })
    except Exception as e:
        print(f"❌ Error getting frame: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/monitoring/alerts', methods=['GET'])
def get_alerts():
    """Get current alerts"""
    try:
        return jsonify({
            "alerts": current_detections["alerts"],
            "student_count": current_detections["student_count"],
            "timestamp": current_detections["timestamp"]
        })
    except Exception as e:
        print(f"❌ Error getting alerts: {e}")
        return jsonify({"error": str(e)}), 500

# Global error handler
@app.errorhandler(Exception)
def handle_error(error):
    print(f"❌ Unhandled error: {error}")
    return jsonify({"error": "Internal server error", "details": str(error)}), 500

if __name__ == '__main__':
    print("🎓 Loading Models...")
    load_models()
    print("🚀 Starting Camera Monitoring Service on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=False, threaded=True)
