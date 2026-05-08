@echo off
echo ========================================
echo Restarting Frontend with Updated Config
echo ========================================
echo.
echo Stopping any running frontend processes...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq npm*" 2>nul

echo.
echo Starting frontend server...
cd frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo Frontend restarted!
echo Please refresh your browser at:
echo http://localhost:5173/stock/user-settings
echo ========================================
pause
