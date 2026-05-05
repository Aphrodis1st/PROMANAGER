# Connection Error Fix Guide

## Error: ERR_CONNECTION_REFUSED

This error means the backend server is not running or not accessible.

## Quick Fix (Choose One Method)

### Method 1: Start Everything (Recommended)
```bash
# Double-click this file:
start-all.bat
```
This will start both backend (port 5000) and frontend (port 5173) in separate windows.

### Method 2: Start Backend Only
```bash
# Double-click this file:
start-backend.bat
```
Then start frontend separately if needed.

### Method 3: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (new terminal)
cd frontend
npm run dev
```

## Verify Backend is Running

1. Open browser and go to: http://localhost:5000
2. You should see:
   ```json
   {
     "message": "ProManager API Server",
     "status": "running",
     "firebase": "ready"
   }
   ```

## Common Issues

### Issue 1: Port 5000 Already in Use
**Solution:**
1. Find what's using port 5000:
   ```bash
   netstat -ano | findstr :5000
   ```
2. Kill the process or change port in `backend/.env`:
   ```
   PORT=3001
   ```
3. Also update `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:3001
   ```

### Issue 2: Dependencies Not Installed
**Solution:**
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Issue 3: Firebase Not Initialized
**Solution:**
- Wait 10-15 seconds after starting backend
- Check backend console for "✅ Firebase initialized successfully"
- If error, verify `firebase-service-account.json` exists in backend folder

### Issue 4: CORS Error
**Solution:**
Check `backend/.env` has correct CORS_ORIGIN:
```
CORS_ORIGIN=http://localhost:5173
```

## Health Check Endpoints

Test these URLs in your browser:

1. **Main Health Check:**
   http://localhost:5000/api/v1/health

2. **Currency API:**
   http://localhost:5000/api/v1/currency/active

3. **Root Endpoint:**
   http://localhost:5000/

## Initialize Currency System

After backend is running:
```bash
# Double-click this file:
initialize-currencies.bat
```

Or manually:
```bash
cd backend
node initialize-currencies.js
```

## Full System Startup Checklist

- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] Backend server running (http://localhost:5000 accessible)
- [ ] Frontend server running (http://localhost:5173 accessible)
- [ ] Firebase initialized (check backend console)
- [ ] Currencies initialized (run initialize-currencies.bat)

## Still Having Issues?

1. **Check Backend Console** for error messages
2. **Check Browser Console** (F12) for detailed errors
3. **Verify .env files** exist in both backend and frontend folders
4. **Restart both servers** completely
5. **Clear browser cache** and try again

## Quick Test

Run this in a new terminal:
```bash
curl http://localhost:5000/api/v1/health
```

Expected response:
```json
{"ok": true, "firebase": "ready"}
```

---

**Need Help?**
- Check backend console for errors
- Check frontend console (F12 in browser)
- Verify all .env files are configured correctly
