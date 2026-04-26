@echo off
REM Camera Monitoring Service Startup Script for Windows
REM This script starts the Python Flask camera monitoring service

echo.
echo ==========================================
echo  Camera Monitoring Service Starter
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python found
echo.

REM Check if requirements are installed
echo Checking dependencies...
pip show flask >nul 2>&1
if errorlevel 1 (
    echo [*] Installing required packages...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install requirements
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies already installed
)

echo.
echo ==========================================
echo  Starting Camera Monitoring Service
echo ==========================================
echo.
echo Service will run on: http://localhost:5001
echo.
echo Press Ctrl+C to stop the service
echo.

REM Run the Flask app
python camera_service.py

pause
