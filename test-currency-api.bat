@echo off
echo ========================================
echo Testing Currency API
echo ========================================
echo.

echo [1] Testing Backend Health...
curl http://localhost:3001/api/v1/health
echo.
echo.

echo [2] Initializing Currencies...
curl -X POST http://localhost:3001/api/v1/currency/initialize -H "Content-Type: application/json"
echo.
echo.

echo [3] Fetching Active Currencies...
curl http://localhost:3001/api/v1/currency/active
echo.
echo.

echo ========================================
echo Test Complete!
echo ========================================
echo.
echo If you see currency data above, the system is working correctly.
echo Now refresh your browser at: http://localhost:5173/stock/user-settings
echo.
pause
