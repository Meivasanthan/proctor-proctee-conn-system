#!/usr/bin/env powershell
# Camera Monitoring System - Complete Launcher
# This script starts all services needed for the proctor system

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Proctor-Proctee Camera Monitoring    ║" -ForegroundColor Cyan
Write-Host "║         System Launcher               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "[1/4] Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green

# Check Python
$pythonVersion = python --version 2>$null
if ($null -eq $pythonVersion) {
    Write-Host "❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green

# Check model files
Write-Host ""
Write-Host "[2/4] Checking model files..." -ForegroundColor Yellow
$modelPath = "backend\FINAL_CLEAN_MODEL.keras"
$faceModelPath = "backend\face_landmarker.task"

if (-not (Test-Path $modelPath)) {
    Write-Host "⚠️  Missing: $modelPath" -ForegroundColor Yellow
    Write-Host "   Please copy from ExamProject folder" -ForegroundColor Yellow
}
else {
    Write-Host "✅ Found: FINAL_CLEAN_MODEL.keras" -ForegroundColor Green
}

if (-not (Test-Path $faceModelPath)) {
    Write-Host "⚠️  Missing: $faceModelPath" -ForegroundColor Yellow
    Write-Host "   Please copy from ExamProject folder" -ForegroundColor Yellow
}
else {
    Write-Host "✅ Found: face_landmarker.task" -ForegroundColor Green
}

# Install dependencies
Write-Host ""
Write-Host "[3/4] Installing dependencies..." -ForegroundColor Yellow

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Cyan
    npm install
}

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    cd backend
    npm install
    cd ..
}

# Check Python packages
Write-Host "Checking Python packages..." -ForegroundColor Cyan
$pythonCheck = python -c "import flask, cv2, tensorflow, mediapipe" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
    pip install -r backend/requirements_camera.txt
}

Write-Host "✅ Dependencies ready" -ForegroundColor Green

# Start services
Write-Host ""
Write-Host "[4/4] Starting services..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Starting frontend & backend..." -ForegroundColor Cyan
$npmJob = Start-Process npm -ArgumentList "start" -PassThru -NoNewWindow -RedirectStandardOutput $null

Write-Host "Waiting 5 seconds for backend to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host "Starting camera monitoring service..." -ForegroundColor Cyan
$pythonJob = Start-Process python -ArgumentList "backend\camera_service.py" -PassThru -RedirectStandardOutput $null

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║      ✅ All Services Started!         ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📍 Service URLs:" -ForegroundColor Cyan
Write-Host "   • Frontend:         http://localhost:8080" -ForegroundColor White
Write-Host "   • Backend API:      http://localhost:5000" -ForegroundColor White
Write-Host "   • Camera Service:   http://localhost:5001" -ForegroundColor White
Write-Host ""

Write-Host "🎥 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Open http://localhost:8080 in your browser" -ForegroundColor White
Write-Host "   2. Login as Proctor/Staff" -ForegroundColor White
Write-Host "   3. Go to 'Camera Monitoring' tab" -ForegroundColor White
Write-Host "   4. Click 'Start' to begin monitoring" -ForegroundColor White
Write-Host ""

Write-Host "⏹️  To stop: Press Ctrl+C in each window" -ForegroundColor Yellow
Write-Host ""

# Wait for Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    Write-Host "Stopping services..." -ForegroundColor Yellow
    Stop-Process -Id $npmJob.Id -ErrorAction SilentlyContinue
    Stop-Process -Id $pythonJob.Id -ErrorAction SilentlyContinue
    Write-Host "✅ Services stopped" -ForegroundColor Green
}
