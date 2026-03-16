@echo off
echo ========================================
echo    Add Mock Vital Signs Data
echo ========================================
echo.

echo 📊 Adding sample vital signs data for testing...
echo.

node add-mock-vitals.js

if %errorlevel% == 0 (
    echo.
    echo ✅ Mock data added successfully!
    echo.
    echo 🎯 Next steps:
    echo 1. Open: http://localhost:5173/hospital/medical-records/nyr5MdqXgl6eCAWlv69E
    echo 2. You should now see vital signs data displayed
    echo 3. Try recording new vital signs
    echo.
) else (
    echo.
    echo ❌ Failed to add mock data
    echo Check the server logs for errors
    echo.
)

echo ========================================
pause