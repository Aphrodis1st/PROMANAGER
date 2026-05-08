@echo off
echo ========================================
echo Starting ProManager System
echo ========================================
echo.

echo [1/3] Starting Backend Server (Port 3001)...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

echo.
echo [2/3] Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Starting Frontend Server (Port 5173)...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo System Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Navigate to: http://localhost:5173/stock/user-settings
echo to configure currency settings.
echo.
echo Press any key to initialize currencies...
pause >nul

echo.
echo Initializing currencies...
timeout /t 3 /nobreak >nul
curl -X POST http://localhost:3001/api/v1/currency/initialize -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Open http://localhost:5173/stock/user-settings
echo 2. Select your preferred currency
echo 3. Click Save
echo.
pause
