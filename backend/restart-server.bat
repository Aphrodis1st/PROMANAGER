@echo off
echo ========================================
echo    Backend Server Restart Script
echo ========================================
echo.

echo 🛑 Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node processes stopped
) else (
    echo ℹ️  No Node processes were running
)

echo.
echo 📁 Navigating to backend directory...
cd /d "%~dp0"

echo.
echo 🔍 Checking if package.json exists...
if exist package.json (
    echo ✅ package.json found
) else (
    echo ❌ package.json not found! Make sure you're in the backend directory.
    pause
    exit /b 1
)

echo.
echo 🚀 Starting backend server...
echo.
echo ========================================
echo    Server Output (Press Ctrl+C to stop)
echo ========================================
echo.

npm start

echo.
echo ========================================
echo    Server stopped
echo ========================================
pause