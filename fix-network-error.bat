@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║          FIXING NETWORK ERROR - RESTARTING SYSTEM           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/4] Stopping any running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/4] Starting Backend Server (Port 3001)...
cd backend
start "Backend Server - Port 3001" cmd /k "npm run dev"
cd ..

echo.
echo [3/4] Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Starting Frontend Server (Port 5173)...
cd frontend
start "Frontend Server - Port 5173" cmd /k "npm run dev"
cd ..

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    SYSTEM RESTARTED!                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ✅ Backend:  http://localhost:3001
echo ✅ Frontend: http://localhost:5173
echo.
echo 📝 Next Steps:
echo    1. Wait 10 seconds for servers to fully start
echo    2. Open: http://localhost:5173/stock/login
echo    3. Login with your credentials
echo    4. Network error should be FIXED!
echo.
echo Press any key to test the backend API...
pause >nul

echo.
echo Testing backend health...
timeout /t 3 /nobreak >nul
curl http://localhost:3001/api/v1/health

echo.
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  READY TO USE!                               ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo If you see "ok":true above, everything is working!
echo.
echo Now try logging in at: http://localhost:5173/stock/login
echo.
pause
