@echo off
echo ========================================
echo RESTARTING BACKEND SERVER
echo ========================================
echo.
echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo Starting backend server...
cd /d "%~dp0backend"
start "MADSMART Backend" cmd /k "npm run dev"

echo.
echo ========================================
echo Backend server is restarting...
echo Check the new window for server logs
echo ========================================
echo.
pause
