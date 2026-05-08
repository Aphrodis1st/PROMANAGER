@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        FORCING BACKEND TO PORT 3001 - FINAL FIX              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/2] Killing all Node processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM nodemon.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/2] Starting backend with FORCED development mode...
cd backend
start "Backend FORCED DEV - Port 3001" cmd /k "node start-dev.js"
cd ..

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              BACKEND STARTING WITH FORCED SETTINGS           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ⏳ Waiting 10 seconds for backend to start...
echo.
echo CHECK THE BACKEND WINDOW!
echo It MUST show: "Server running on 127.0.0.1:3001"
echo.
timeout /t 10 /nobreak >nul

echo.
echo 🧪 Testing connection...
curl http://localhost:3001/api/v1/health

echo.
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    WHAT TO CHECK                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 1. Backend window shows port 3001? 
echo    ✅ YES = Good! Try logging in now
echo    ❌ NO = Copy the ENTIRE backend output and send it to me
echo.
echo 2. Curl returned {"ok":true}?
echo    ✅ YES = Backend is working!
echo    ❌ NO = Backend is not responding on 3001
echo.
pause
