# 🎥 Camera Monitoring Integration - Quick Start Checklist

## ✅ Pre-Setup (One-Time)

- [ ] Copy model files from `C:\Users\meiva\Downloads\ExamProject` to `backend/`:
  - [ ] `FINAL_CLEAN_MODEL.keras`
  - [ ] `face_landmarker.task`

- [ ] Install Python dependencies (first time only):
  ```bash
  cd backend
  pip install -r requirements_camera.txt
  ```

- [ ] Verify webcam is connected and working

## 🚀 Starting Services

### Terminal 1: Frontend + Backend
```bash
# From project root
npm start
```
Expected output:
```
✅ Frontend: http://localhost:8080
✅ Backend: Running on port 5000
```

### Terminal 2: Camera Service
```bash
# From project root
cd backend
python camera_service.py
```
Expected output:
```
✅ Loading Models...
✅ AI Model loaded successfully
✅ Face Landmarker loaded successfully
🚀 Starting Camera Monitoring Service on port 5001...
```

**Or on Windows, double-click:**
```
backend/start_camera_service.bat
```

## 🎯 Using Camera Monitoring

1. Open browser: **http://localhost:8080**
2. Login as **Proctor/Staff** (use existing credentials)
3. Navigate to Dashboard
4. Click **"Camera Monitoring"** tab
5. Click **"Start"** button
6. Live camera feed will display with alerts

## ❓ Health Check

Verify everything is working:
```bash
curl http://localhost:5000/camera/health
```

Should return:
```json
{"status": "ok", "service": "camera_monitoring"}
```

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Camera service not available" | Start Python service in Terminal 2 |
| No camera feed appears | Click "Start" button, wait 2-3 seconds |
| "No frame available" | Ensure camera permissions granted in Windows |
| Models not found | Copy .keras and .task files to backend/ |
| Port already in use | Change port numbers in camera_service.py |

## 📂 Project Structure

```
proctor-proctee-conn-system/
├── backend/
│   ├── camera_service.py          ← Python Flask service
│   ├── routes/
│   │   └── cameraRoutes.js        ← Node.js proxy
│   ├── start_camera_service.bat   ← Windows starter
│   ├── requirements_camera.txt    ← Python deps
│   ├── FINAL_CLEAN_MODEL.keras    ← Place here
│   ├── face_landmarker.task       ← Place here
│   └── server.js                  ← Modified
├── src/
│   └── components/
│       ├── CameraMonitoring.tsx   ← React component
│       └── StaffDashboard.tsx     ← Modified
└── CAMERA_MONITORING_SETUP.md     ← Full guide
```

## 🔑 Key Files Modified

1. **backend/server.js** - Added camera routes
2. **src/components/StaffDashboard.tsx** - Added camera tab
3. **backend/routes/cameraRoutes.js** - NEW: Proxy routes
4. **src/components/CameraMonitoring.tsx** - NEW: React component
5. **backend/camera_service.py** - NEW: Flask service

## 📞 Support

For detailed setup: See `CAMERA_MONITORING_SETUP.md`

For issues:
1. Check terminal output for errors
2. Verify camera permissions in Windows
3. Ensure all model files are present
4. Check that ports 5000, 5001 are free

---

**Status**: ✅ Integration Complete - Ready to Deploy
**Last Updated**: April 23, 2026
