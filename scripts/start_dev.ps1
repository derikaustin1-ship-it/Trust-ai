# Windows PowerShell Development Startup Script for TRUSTIQ AI
Write-Host "Starting TRUSTIQ AI Full-Stack Platform..." -ForegroundColor Green

# 1. Start Backend in separate window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/../backend'; & ./venv/Scripts/python -m uvicorn app.main:app --reload --port 8000"

# 2. Start Frontend in separate window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/../frontend'; npm run dev"

Write-Host "Backend running at http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend running at http://localhost:5173" -ForegroundColor Cyan
Write-Host "API Documentation available at http://localhost:8000/api/v1/docs" -ForegroundColor Yellow
