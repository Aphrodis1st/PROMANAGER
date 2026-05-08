@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     STARTING BACKEND IN DEVELOPMENT MODE - PORT 3001        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/2] Killing all Node processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM nodemon.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/2] Starting backend in DEVELOPMENT mode...
cd backend

REM Set environment to development BEFORE starting
set NODE_ENV=development

REM Start with nodemon directly
start "Backend DEV - Port 3001" cmd /k "nodemon src/server.js"

cd ..

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              BACKEND STARTING...                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ⏳ Waiting 10 seconds for backend to start...
echo.
echo IMPORTANT: Check the backend window that just opened!
echo You should see: "Server running on 127.0.0.1:3001"
echo.
timeout /t 10 /nobreak >nul

echo.
echo 🧪 Testing connection to port 3001...
curl http://localhost:3001/api/v1/health

echo.
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  VERIFICATION                                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 1. Check the backend window - what port does it show?
echo    ✅ Should be: 127.0.0.1:3001
echo    ❌ If it shows 5000, there's still an issue
echo.
echo 2. Did curl return {"ok":true} above?
echo    ✅ Yes = Backend is working!
echo    ❌ No = Backend is not responding
echo.
echo 3. Try logging in at: http://localhost:5173/stock/login
echo.
pause
