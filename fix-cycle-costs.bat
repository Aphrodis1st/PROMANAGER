@echo off
echo ========================================
echo Fix Production Cycle Costs
echo ========================================
echo.
echo This script will recalculate material costs
echo for all production cycles based on their
echo consumed materials.
echo.
pause

cd backend
node fix-cycle-costs.js

echo.
echo ========================================
echo Script completed!
echo ========================================
pause
