@echo off
echo ========================================
echo   PROMANAGER - Starting Services
echo ========================================
echo.

REM Start Backend Server
echo [1/2] Starting Backend Server...
cd backend
start "ProManager Backend" cmd /k "npm run dev"
cd ..

REM Wait a bit for backend to start
timeout /t 5 /nobreak > nul

REM Start Frontend Server
echo [2/2] Starting Frontend Server...
cd frontend
start "ProManager Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
echo (Backend and Frontend will continue running)
pause > nul
