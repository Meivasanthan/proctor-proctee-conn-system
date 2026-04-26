# Camera Monitoring Integration Guide

## Overview
This guide explains how to integrate and run the camera monitoring system with the Proctor-Proctee Connection System.

## Components

### 1. **Python Flask Service** (`backend/camera_service.py`)
- Handles camera capture and monitoring
- Detects multiple students using MediaPipe face detection
- Runs AI model to identify suspicious behavior
- Provides REST API endpoints for the backend

### 2. **Node.js Backend Integration** (`backend/routes/cameraRoutes.js`)
- Proxies requests from frontend to Python service
- Requires proctor/staff authentication
- Provides secure endpoints

### 3. **React Frontend Component** (`src/components/CameraMonitoring.tsx`)
- Live camera feed viewer
- Real-time alert system
- Control buttons (Start/Stop)
- Student count and alert statistics

### 4. **Staff Dashboard Integration** (`src/components/StaffDashboard.tsx`)
- New "Camera Monitoring" tab
- Accessible only to proctors/staff after login

---

## Setup Instructions

### Prerequisites
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - Already set up for frontend
- **Webcam** - Connected and working

### Step 1: Prepare Python Environment

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   Required packages:
   - Flask >= 3.0.0
   - flask-cors >= 4.0.0
   - opencv-python >= 4.8.0
   - numpy >= 1.23.0
   - tensorflow >= 2.13.0
   - mediapipe >= 0.10.5
   - Pillow >= 10.0.0

4. **Ensure model files are present:**
   - `FINAL_CLEAN_MODEL.keras` - AI model for behavior detection
   - `face_landmarker.task` - MediaPipe face detection model
   
   Copy these from the ExamProject folder to the backend directory.

### Step 2: Update Environment Variables

1. **Create `.env` file in root directory:**
   ```
   CAMERA_SERVICE_URL=http://localhost:5001
   ```

2. **Or update in backend/routes/cameraRoutes.js if needed**

### Step 3: Start Services

#### Option A: Automatic Start (Recommended)
Run both frontend and backend together:
```bash
npm start
```
This starts:
- Frontend on `http://localhost:8080`
- Backend on `http://localhost:5000`

**Then in a separate terminal, start the camera service:**
```bash
cd backend
python camera_service.py
```
Or use the batch file (Windows):
```bash
backend\start_camera_service.bat
```

#### Option B: Manual Start
Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
cd backend
npm run dev
```

Terminal 3 - Camera Service:
```bash
cd backend
python camera_service.py
```

### Step 4: Access the System

1. **Open browser:** http://localhost:8080
2. **Login as Proctor/Staff**
3. **Navigate to Dashboard**
4. **Click "Camera Monitoring" tab**
5. **Click "Start" to begin monitoring**

---

## API Endpoints

All endpoints require authentication (Staff/Proctor role)

### Camera Monitoring Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/camera/start` | Start camera monitoring |
| POST | `/camera/stop` | Stop camera monitoring |
| GET | `/camera/status` | Get monitoring status |
| GET | `/camera/frame` | Get current frame with alerts |
| GET | `/camera/alerts` | Get current alerts only |
| GET | `/camera/health` | Check camera service health |

### Example Requests

**Start Monitoring:**
```bash
curl -X POST http://localhost:5000/camera/start \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Current Frame:**
```bash
curl http://localhost:5000/camera/frame \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Features

### 1. Live Camera Feed
- Real-time video stream from webcam
- Base64 encoded JPEG frames
- ~30 FPS refresh rate

### 2. AI-Powered Detection
- Detects suspicious behavior using trained model
- Tracks confidence levels
- Maintains suspicion scores per student

### 3. Multi-Student Support
- Detects up to 10 students simultaneously
- Per-student behavior tracking
- Individual suspicion level tracking

### 4. Real-Time Alerts
- Instant notification of suspicious activity
- Confidence scores for each detection
- Suspicion level history

### 5. Dashboard Statistics
- Number of students detected
- Number of active alerts
- Live monitoring status

---

## Troubleshooting

### Issue: "Camera service unavailable"

**Solution:**
1. Ensure Python camera service is running
2. Check if port 5001 is available: `netstat -an | find ":5001"`
3. Verify Python dependencies: `pip install -r requirements.txt`

### Issue: No camera feed appears

**Solution:**
1. Check camera permissions (Windows may ask)
2. Verify camera is not in use by another app
3. Try a different camera index in camera_service.py
4. Check browser console for errors

### Issue: "No frame available" error

**Solution:**
1. Click "Start" button to begin monitoring
2. Wait a few seconds for first frame to load
3. Check Python service logs for errors
4. Restart the Python service

### Issue: "Permission denied" for camera

**Solution:**
1. Grant camera permissions to your browser
2. On Windows, check Settings > Privacy > Camera
3. Ensure camera driver is installed
4. Try a different browser (Chrome/Firefox)

### Issue: Models not found

**Solution:**
1. Copy these files from ExamProject to backend:
   - `FINAL_CLEAN_MODEL.keras`
   - `face_landmarker.task`
2. Ensure they're in the same directory as camera_service.py

---

## Performance Notes

- **CPU Usage:** High (due to ML inference) - recommend modern CPU
- **GPU Support:** Can be enabled in TensorFlow for better performance
- **Network:** Only sends frame data when needed (500ms intervals)
- **Memory:** ~500MB-1GB depending on model size

---

## Security Considerations

1. **Authentication:** Camera endpoints require valid JWT token
2. **Role-Based Access:** Only Staff/Proctor can access
3. **CORS:** Restricted to localhost by default
4. **HTTPS:** Recommended for production deployment

---

## Architecture Diagram

```
┌─────────────────────┐
│   React Frontend    │
│  (CameraMonitor)    │
└──────────┬──────────┘
           │
           │ HTTP
           ▼
┌─────────────────────┐
│  Node.js Backend    │
│ (cameraRoutes.js)   │
└──────────┬──────────┘
           │
           │ HTTP Proxy
           ▼
┌─────────────────────┐
│ Python Flask API    │
│(camera_service.py)  │
└──────────┬──────────┘
           │
           │ OpenCV/MediaPipe
           ▼
┌─────────────────────┐
│   Webcam Device     │
│   + AI Models       │
└─────────────────────┘
```

---

## Files Modified/Created

### Created:
- `backend/camera_service.py` - Flask camera service
- `backend/routes/cameraRoutes.js` - Node.js proxy routes
- `src/components/CameraMonitoring.tsx` - React component
- `backend/start_camera_service.bat` - Windows startup script
- `CAMERA_MONITORING_SETUP.md` - This file

### Modified:
- `backend/server.js` - Added camera routes
- `src/components/StaffDashboard.tsx` - Added camera monitoring tab

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Check Python service logs
4. Verify all prerequisites are installed

---

## Future Enhancements

- [ ] Record monitoring sessions
- [ ] Generate reports with flagged students
- [ ] WebSocket for real-time streaming
- [ ] GPU acceleration
- [ ] Multi-camera support
- [ ] Database storage for alerts
- [ ] Email notifications for proctors

---

**Last Updated:** April 2026
**Version:** 1.0.0
