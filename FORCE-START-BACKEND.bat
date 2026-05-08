@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        FORCE START BACKEND ON PORT 3001                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/3] Killing ALL Node.js processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM nodemon.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Clearing any port locks...
timeout /t 1 /nobreak >nul

echo.
echo [3/3] Starting Backend on Port 3001 (FORCED)...
cd backend
set NODE_ENV=development
set PORT=3001
start "Backend - Port 3001 FORCED" cmd /k "nodemon src/server.js"
cd ..

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              BACKEND STARTING ON PORT 3001                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ⏳ Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak >nul

echo.
echo 🧪 Testing backend connection...
curl http://localhost:3001/api/v1/health

echo.
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    CHECK RESULTS                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo If you see {"ok":true} above:
echo    ✅ Backend is running correctly on port 3001
echo    ✅ Go to: http://localhost:5173/stock/login
echo    ✅ Try logging in - it should work!
echo.
echo If you see an error or nothing:
echo    ❌ Check the backend window for errors
echo    ❌ Make sure port 3001 is not blocked
echo.
pause
