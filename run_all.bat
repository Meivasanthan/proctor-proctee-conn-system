@echo off
echo Starting Proctor-Proctee full-stack project...
echo ==============================================

REM Ensure we run from repository root
cd /d "%~dp0"

REM Check Node.js availability
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check Python availability
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

REM Install frontend dependencies if missing
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies.
        pause
        exit /b 1
    )
)

REM Install backend dependencies if missing
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

REM Install Python dependencies if requirements exist
if exist "backend\requirements_camera.txt" (
    echo Checking Python dependencies...
    python -c "import flask, cv2, mediapipe" >nul 2>nul
    if %errorlevel% neq 0 (
        echo Installing Python dependencies...
        python -m pip install -r backend/requirements_camera.txt
        if %errorlevel% neq 0 (
            echo ERROR: Failed to install Python dependencies.
            pause
            exit /b 1
        )
    )
) else (
    echo WARNING: backend\requirements_camera.txt not found. Skipping Python dependency check.
)

echo.
echo Launching services...
echo ======================

start "Frontend" cmd /k "npm run dev"
start "Backend" cmd /k "cd backend && npm run dev"
start "Camera Monitoring" cmd /k "python backend/camera_service.py"

echo.
echo All services have been launched.
echo - Frontend: http://localhost:8080
echo - Backend:  http://localhost:5000
echo - Camera:   http://localhost:5001
echo.
echo Each service is running in its own terminal window.
echo Close the service windows to stop individual components.
pause >nul
