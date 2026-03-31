@echo off

REM Navigate to backend directory
cd backend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
)

REM Start the backend server
echo Starting backend server...
npm start