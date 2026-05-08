@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           RESTARTING BACKEND ON PORT 3001                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/2] Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/2] Starting Backend on Port 3001...
cd backend
start "Backend - Port 3001" cmd /k "npm run dev"
cd ..

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  BACKEND RESTARTED!                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ✅ Backend should now be running on: http://localhost:3001
echo.
echo Wait 5 seconds, then test:
echo → http://localhost:3001/api/v1/health
echo.
echo Press any key to test the backend...
pause >nul

timeout /t 5 /nobreak >nul
echo.
echo Testing backend...
curl http://localhost:3001/api/v1/health

echo.
echo.
echo If you see {"ok":true} above, backend is working!
echo.
echo Now refresh your browser at: http://localhost:5173/stock/login
echo.
pause
