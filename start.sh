#!/bin/bash
set -e

# Determine working directory
if [ -d "/app" ] && [ -f "/app/package.json" ]; then
    # Container environment
    WORK_DIR="/app"
else
    # Local environment
    WORK_DIR="./backend"
fi

echo "Working directory: $WORK_DIR"
cd "$WORK_DIR"

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the application
echo "Starting application..."
exec node src/server.js