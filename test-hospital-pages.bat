@echo off
echo ========================================
echo HOSPITAL SYSTEM COMPREHENSIVE TEST
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if backend is running
echo Checking if backend server is running...
curl -s http://localhost:5000/api/status >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Backend server might not be running on port 5000
    echo Please start the backend server first
    echo.
)

REM Check if frontend is running
echo Checking if frontend server is running...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Frontend server might not be running on port 3000
    echo Please start the frontend server first
    echo.
)

REM Install required dependencies if not present
if not exist node_modules\axios (
    echo Installing required dependencies...
    npm install axios
)

echo.
echo Starting hospital system tests...
echo.

REM Run the test script
node test-hospital-pages.js

echo.
echo Test completed. Check hospital-test-report.json for detailed results.
pause