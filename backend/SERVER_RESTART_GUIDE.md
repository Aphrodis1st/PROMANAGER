# Backend Server Restart Guide - Fix Vital Signs 404 Error

## 🚨 Current Issue
- Vital signs API endpoints returning 404 errors
- Routes are configured but not loading properly
- Server needs proper restart to load new routes

## 📋 Step-by-Step Fix

### Step 1: Stop All Node Processes
```bash
# Method 1: Find and kill all node processes
tasklist | findstr node
# Note the PID numbers, then kill them:
taskkill /F /PID [PID_NUMBER]

# Method 2: Kill all node processes at once
taskkill /F /IM node.exe

# Method 3: If using VS Code terminal, press Ctrl+C
```

### Step 2: Navigate to Backend Directory
```bash
cd c:\Users\ew\Desktop\madsmart\backend
```

### Step 3: Check Package.json Scripts
```bash
# View available scripts
type package.json | findstr "scripts" -A 10
```

### Step 4: Start Server with Proper Method

**Option A: Standard Start**
```bash
npm start
```

**Option B: Development Mode (if available)**
```bash
npm run dev
```

**Option C: Direct Node Start**
```bash
node src/server.js
```

**Option D: With Nodemon (if installed)**
```bash
npx nodemon src/server.js
```

### Step 5: Verify Server Startup

Look for these console messages:
```
✅ Hospital routes registered:
   - /api/v1/hospital/appointments
   - /api/v1/hospital/billing
   - /api/v1/hospital/departments
   - /api/v1/hospital/doctors
   - /api/v1/hospital/lab
   - /api/v1/hospital/medical-records
   - /api/v1/hospital/patients
   - /api/v1/hospital/specializations
   - /api/v1/hospital/wards
   - /api/v1/hospital/insurance-providers
   - /api/v1/hospital/vital-signs ✨ NEW

API running on port 5000
```

### Step 6: Test the Routes

**Test 1: Health Check**
```bash
curl http://localhost:5000/api/v1/health
# Should return: {"ok":true}
```

**Test 2: Vital Signs Endpoint**
```bash
curl http://localhost:5000/api/v1/hospital/vital-signs/patient/test
# Should NOT return 404
```

**Test 3: Browser Test**
Open: `http://localhost:5000/api/v1/health`

### Step 7: Clear Browser Cache
```bash
# In browser, press:
Ctrl + Shift + R  (Hard refresh)
# Or
Ctrl + Shift + Delete  (Clear cache)
```

### Step 8: Test Medical Record Page
Navigate to: `http://localhost:5173/hospital/medical-records/nyr5MdqXgl6eCAWlv69E`

## 🔍 Troubleshooting

### If Server Won't Start:

**Check for Port Conflicts:**
```bash
netstat -ano | findstr :5000
# If port is in use, kill the process or change port
```

**Check for Syntax Errors:**
```bash
node --check src/server.js
# Should show no errors
```

**Check Dependencies:**
```bash
npm install
# Reinstall all dependencies
```

### If Routes Still Return 404:

**Verify File Exists:**
```bash
dir src\routes\hospital\vitalSigns.routes.js
# Should show the file exists
```

**Check Import Path:**
```bash
# In server.js, verify this line exists:
# import vitalSignsRoutes from './routes/hospital/vitalSigns.routes.js';
```

**Test Route File Directly:**
```bash
node test-vital-signs-routes.js
# Should show routes are loaded
```

### If Firebase Connection Issues:

**Check Environment Variables:**
```bash
# Verify .env file exists and has:
# SERVICE_ACCOUNT_PATH=path/to/service-account.json
```

**Check Firebase Credentials:**
```bash
# Verify service account file exists and is valid JSON
```

## 🎯 Expected Results After Fix

### Server Console Should Show:
```
✅ Hospital routes registered:
   - /api/v1/hospital/vital-signs ✨ NEW
API running on port 5000
```

### Browser Console Should NOT Show:
```
❌ GET http://localhost:5000/api/v1/hospital/vital-signs/patient/... 404
❌ POST http://localhost:5000/api/v1/hospital/vital-signs 404
```

### Medical Record Page Should:
- ✅ Load without errors
- ✅ Display "No vital signs recorded yet" (if no data)
- ✅ Allow recording new vital signs
- ✅ Save vital signs to database
- ✅ Display vital signs after recording

## 🚀 Quick Test Commands

**After server restart, run these tests:**

```bash
# Test 1: Health check
curl http://localhost:5000/api/v1/health

# Test 2: Vital signs endpoint (should return empty array, not 404)
curl http://localhost:5000/api/v1/hospital/vital-signs/patient/test

# Test 3: Check server is running
netstat -ano | findstr :5000
```

## 📝 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Run `npm install` in backend directory

### Issue: "Port already in use"
**Solution:** Kill existing process or change port in .env

### Issue: "Firebase initialization failed"
**Solution:** Check SERVICE_ACCOUNT_PATH in .env file

### Issue: Routes still 404 after restart
**Solution:** 
1. Verify import statement in server.js
2. Check file path is correct
3. Restart server completely (not just refresh)

### Issue: "SyntaxError in routes file"
**Solution:** Check vitalSigns.routes.js for syntax errors

## 🔄 Alternative Restart Methods

### Method 1: PM2 (if installed)
```bash
pm2 restart all
```

### Method 2: Forever (if installed)
```bash
forever restart src/server.js
```

### Method 3: Docker (if containerized)
```bash
docker-compose restart backend
```

## ✅ Success Checklist

After restart, verify:
- [ ] Server starts without errors
- [ ] Console shows "Hospital routes registered"
- [ ] Console shows "vital-signs ✨ NEW"
- [ ] Health endpoint returns {"ok":true}
- [ ] Vital signs endpoint doesn't return 404
- [ ] Medical record page loads without errors
- [ ] Can record new vital signs
- [ ] Vital signs save to database
- [ ] Browser console shows no 404 errors

## 🆘 If All Else Fails

1. **Complete Clean Restart:**
   ```bash
   # Stop all processes
   taskkill /F /IM node.exe
   
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   
   # Start fresh
   npm start
   ```

2. **Check System Resources:**
   - Ensure enough RAM available
   - Check disk space
   - Close other applications

3. **Restart Computer:**
   - Sometimes a full system restart resolves port/process conflicts

---

**🎯 Goal:** Get vital signs API working so medical records can display and save vital signs data properly.

**⏱️ Expected Time:** 2-5 minutes for restart and verification.

**🔗 Next Steps:** Once server is running properly, test the complete workflow from medical record view to vital signs recording.