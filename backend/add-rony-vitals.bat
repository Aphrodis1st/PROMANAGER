@echo off
echo ========================================
echo    Add Vital Signs for Rony
echo ========================================
echo.

echo 🏥 Adding vital signs data for patient Rony...
echo.

node add-rony-vitals.js

if %errorlevel% == 0 (
    echo.
    echo ✅ Vital signs added successfully!
    echo.
    echo 🎯 Now refresh your medical record page:
    echo http://localhost:5173/hospital/medical-records/view/nyr5MdqXgl6eCAWlv69E
    echo.
    echo You should see:
    echo - Latest vital signs with real data
    echo - Vital signs history table
    echo - Proper timestamps
    echo.
) else (
    echo.
    echo ❌ Failed to add vital signs
    echo Check the server logs for errors
    echo.
)

echo ========================================
echo Press any key to open the medical record page...
pause > nul

start http://localhost:5173/hospital/medical-records/view/nyr5MdqXgl6eCAWlv69E