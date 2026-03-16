@echo off
echo ========================================
echo    Vital Signs API Test
echo ========================================
echo.

echo 🧪 Testing vital signs API endpoints...
echo.

node test-api.js

echo.
echo ========================================
echo.

if %errorlevel% == 0 (
    echo ✅ API test completed successfully!
    echo.
    echo 🎯 Next steps:
    echo 1. Open: http://localhost:5173/hospital/medical-records/nyr5MdqXgl6eCAWlv69E
    echo 2. The page should now load without 500 errors
    echo 3. Try recording new vital signs
    echo.
) else (
    echo ❌ API test failed
    echo Check the server logs for detailed error messages
    echo.
)

pause