@echo off
echo Starting Proctor-Proctee Full-Stack Project...
echo ==============================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies.
        pause
        exit /b 1
    )
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies.
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

if not exist "backend\requirements_camera.txt" (
    echo WARNING: requirements_camera.txt not found. Skipping Python dependencies check.
) else (
    echo Checking Python dependencies...
    python -c "import flask, cv2, mediapipe" >nul 2>nul
    if %errorlevel% neq 0 (
        echo Installing Python dependencies...
        pip install -r backend/requirements_camera.txt
        if %errorlevel% neq 0 (
            echo ERROR: Failed to install Python dependencies.
            pause
            exit /b 1
        )
    )
)

echo.
echo Starting all services...
echo =======================

REM Start Frontend (Vite)
echo Starting Frontend...
start "Frontend" cmd /c "npm run dev"

REM Start Backend (Express)
echo Starting Backend...
start "Backend" cmd /c "cd backend && npm run dev"

REM Start Camera Service (Python)
echo Starting Camera Monitoring...
start "Camera Monitoring" cmd /c "python backend/camera_service.py"

echo.
echo All services started successfully!
echo.
echo Services:
echo - Frontend: http://localhost:8080
echo - Backend:  http://localhost:5000
echo - Camera:   http://localhost:5001
echo.
echo Press any key to exit (services will continue running)...
pause >nul