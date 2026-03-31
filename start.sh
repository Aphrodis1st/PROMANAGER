#!/bin/bash
set -e

echo "Starting MADSMART backend..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Start the server
echo "Starting server on port 8000..."
exec npm start