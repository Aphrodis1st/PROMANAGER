@echo off
echo ========================================
echo Currency Initialization Script
echo ========================================
echo.

timeout /t 5 /nobreak >nul

echo Initializing currencies...
curl -X POST http://localhost:3001/api/v1/currency/initialize -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo Done! Check the output above.
echo ========================================
pause
