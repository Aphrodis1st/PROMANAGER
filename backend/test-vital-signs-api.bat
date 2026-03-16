@echo off
echo ========================================
echo    Vital Signs API Test Script
echo ========================================
echo.

echo 🔍 Testing server health...
curl -s http://localhost:5000/api/v1/health
if %errorlevel% == 0 (
    echo.
    echo ✅ Server is responding
) else (
    echo.
    echo ❌ Server is not responding on port 5000
    echo    Make sure the backend server is running
    pause
    exit /b 1
)

echo.
echo 🩺 Testing vital signs endpoint...
curl -s http://localhost:5000/api/v1/hospital/vital-signs/patient/test-patient-id
if %errorlevel% == 0 (
    echo.
    echo ✅ Vital signs endpoint is working
) else (
    echo.
    echo ❌ Vital signs endpoint failed
)

echo.
echo 📊 Testing vital signs POST endpoint...
curl -s -X POST http://localhost:5000/api/v1/hospital/vital-signs -H "Content-Type: application/json" -d "{\"patientId\":\"test\",\"temperature\":\"37.0\"}"
if %errorlevel% == 0 (
    echo.
    echo ✅ Vital signs POST endpoint is working
) else (
    echo.
    echo ❌ Vital signs POST endpoint failed
)

echo.
echo ========================================
echo    Test Results Summary
echo ========================================
echo.
echo If you see ✅ for all tests, the vital signs API is working!
echo If you see ❌ for any test, check the server logs for errors.
echo.
echo Next steps:
echo 1. Open browser to: http://localhost:5173/hospital/medical-records/nyr5MdqXgl6eCAWlv69E
echo 2. Check browser console for any 404 errors
echo 3. Try recording vital signs
echo.
pause