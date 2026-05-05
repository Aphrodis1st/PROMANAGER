@echo off
echo ========================================
echo   PROMANAGER - Starting Backend Server
echo ========================================
echo.
echo Checking backend folder...

cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo.
    echo [!] Dependencies not found. Installing...
    echo This may take a few minutes...
    echo.
    npm install
    echo.
    echo [+] Dependencies installed successfully!
    echo.
)

echo Starting backend server on http://localhost:5000
echo.
echo ========================================
echo   IMPORTANT:
echo   - Keep this window open
echo   - Backend will run on port 5000
echo   - Press Ctrl+C to stop the server
echo ========================================
echo.

npm run dev

echo.
echo Backend server stopped.
pause
