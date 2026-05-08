# QUICK FIX - Currency Not Loading

## Problem
The currency dropdown is empty because the frontend was pointing to the wrong backend port.

## Solution Applied
✅ Fixed `frontend/.env` file to use correct API URL:
   - Changed from: `http://localhost:5000`
   - Changed to: `http://localhost:3001/api/v1`

## Steps to Fix

### Option 1: Quick Restart (Recommended)
1. **Stop the frontend server** (Ctrl+C in the terminal running it)
2. **Restart the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
3. **Refresh your browser** at `http://localhost:5173/stock/user-settings`
4. **Click "Initialize Currencies"** button
5. **Select your currency** and click Save

### Option 2: Use Startup Script
1. **Close all running servers**
2. **Double-click** `start-system.bat` in the project root
3. **Wait** for both servers to start
4. **Follow the prompts** to initialize currencies
5. **Open** `http://localhost:5173/stock/user-settings`

### Option 3: Manual Steps
1. **Ensure backend is running** on port 3001:
   ```bash
   cd backend
   npm run dev
   ```

2. **Stop and restart frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Initialize currencies** using curl:
   ```bash
   curl -X POST http://localhost:3001/api/v1/currency/initialize -H "Content-Type: application/json"
   ```

4. **Refresh browser** and select currency

## Verification

After restarting, you should see:
- ✅ Backend running on `http://localhost:3001`
- ✅ Frontend running on `http://localhost:5173`
- ✅ Currency dropdown populated with 10 currencies
- ✅ Ability to save currency selection

## Test the Fix

Open browser console (F12) and check:
- No 404 errors for `/api/v1/currency/*` endpoints
- Successful API calls to `http://localhost:3001/api/v1/currency/active`

## Available Currencies

After initialization, you'll have:
1. USD - US Dollar ($)
2. EUR - Euro (€)
3. GBP - British Pound (£)
4. JPY - Japanese Yen (¥)
5. CNY - Chinese Yuan (¥)
6. INR - Indian Rupee (₹)
7. AED - UAE Dirham (د.إ)
8. SAR - Saudi Riyal (ر.س)
9. CAD - Canadian Dollar (C$)
10. AUD - Australian Dollar (A$)

## Still Having Issues?

1. **Check backend logs** for any errors
2. **Verify Firebase** is properly configured
3. **Clear browser cache** and reload
4. **Check browser console** for JavaScript errors
5. **Ensure port 3001** is not blocked by firewall

## Files Modified
- ✅ `frontend/.env` - Updated API URL
- ✅ `frontend/src/pages/stock/UserSettingsPage.jsx` - Added currency UI
- ✅ `frontend/src/context/CurrencyContext.jsx` - Improved error handling

---
**Last Updated**: 2024
**Status**: FIXED ✅
