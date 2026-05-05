# Tax System Troubleshooting Guide

## Error: "Failed to save tax"

### Quick Fixes

#### 1. Check Backend Server
```bash
# Make sure backend is running
cd backend
npm start

# Should see:
# 🚀 Server running on 127.0.0.1:3001
```

#### 2. Check Authentication
```javascript
// Open browser console (F12)
console.log(localStorage.getItem('stockToken'));

// Should show a token like: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
// If null, login again
```

#### 3. Check API URL
```javascript
// In browser console
console.log(import.meta.env.VITE_API_URL);

// Should be: http://localhost:3001/api/v1
```

#### 4. Test API Endpoint
```bash
# Open new terminal
curl http://localhost:3001/api/v1/health

# Should return: {"ok":true,"firebase":"ready"}
```

### Detailed Debugging

#### Step 1: Check Browser Console
1. Open Tax Settings page
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Try to save a tax
5. Look for error messages

**Common Errors:**

**Error: "Network Error"**
```
Solution: Backend server is not running
Fix: cd backend && npm start
```

**Error: "401 Unauthorized"**
```
Solution: Token expired or invalid
Fix: Logout and login again
```

**Error: "500 Internal Server Error"**
```
Solution: Backend error
Fix: Check backend console for error details
```

#### Step 2: Check Backend Console
Look at your backend terminal for errors:

**Error: "Firebase not initialized"**
```
Solution: Firebase credentials missing
Fix: Check backend/.env file has firebase config
```

**Error: "Collection 'taxes' not found"**
```
Solution: Firestore collection doesn't exist yet
Fix: It will be created automatically on first save
```

**Error: "Cannot read property 'taxName' of undefined"**
```
Solution: Data validation issue
Fix: Ensure all required fields are filled
```

#### Step 3: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to save tax
4. Look for the POST request to `/stock/taxes`
5. Click on it to see details

**Check Request:**
- URL: http://localhost:3001/api/v1/stock/taxes
- Method: POST
- Status: Should be 201 (Created)
- Headers: Should have Authorization: Bearer ...

**Check Response:**
- If 201: Success! Tax created
- If 401: Authentication issue
- If 500: Server error (check backend console)

### Common Issues & Solutions

#### Issue 1: CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```javascript
// backend/src/server.js
// Check CORS configuration
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true
}));
```

#### Issue 2: Missing GL Accounts
```
Error: GL accounts not found
```

**Solution:**
1. Go to Tax Settings
2. Click "Initialize GL Accounts" button
3. Wait for success message
4. Try saving tax again

#### Issue 3: Validation Error
```
Error: Tax Name and Tax Code are required
```

**Solution:**
- Fill in Tax Name (e.g., "Standard VAT")
- Fill in Tax Code (e.g., "VAT-18")
- Both fields are mandatory

#### Issue 4: Rate/Amount Error
```
Error: Rate must be a number
```

**Solution:**
- Enter numeric value only
- For percentage: 18 (not 18%)
- For fixed: 5 (not $5)

### Testing Checklist

Before reporting an issue, verify:

- [ ] Backend server is running (port 3001)
- [ ] Frontend server is running (port 5173)
- [ ] Logged in to stock system
- [ ] Token exists in localStorage
- [ ] Tax Name filled in
- [ ] Tax Code filled in
- [ ] Rate or Fixed Amount entered
- [ ] GL Accounts initialized
- [ ] No console errors
- [ ] Network request shows in DevTools

### Manual API Test

If UI doesn't work, test API directly:

```bash
# 1. Get your token
# Login to stock system, then in browser console:
# localStorage.getItem('stockToken')

# 2. Test create tax (replace YOUR_TOKEN)
curl -X POST http://localhost:3001/api/v1/stock/taxes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "taxName": "Test VAT",
    "taxCode": "TEST-18",
    "taxType": "VAT",
    "calculationType": "Percentage",
    "rate": 18,
    "priceType": "Exclusive",
    "appliesTo": "All",
    "isActive": true,
    "outputGLCode": "2101",
    "inputGLCode": "1301",
    "controlGLCode": "2102"
  }'

# Should return: {"id":"...","taxName":"Test VAT",...}
```

### Environment Check

```bash
# Check Node version
node --version
# Should be: v16+ or v18+

# Check npm version
npm --version
# Should be: 8+

# Check if ports are available
netstat -ano | findstr :3001
netstat -ano | findstr :5173
# Should show node.exe processes
```

### Firebase Check

```bash
# Check Firebase credentials
cd backend
type firebase-service-account.json
# Should show JSON with project_id, private_key, etc.

# Check .env file
type .env
# Should have FIREBASE_* variables
```

### Reset & Retry

If nothing works, try a clean restart:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear browser cache
# In browser: Ctrl+Shift+Delete
# Clear: Cached images and files

# 3. Clear localStorage
# In browser console: localStorage.clear()

# 4. Restart backend
cd backend
npm start

# 5. Restart frontend
cd frontend
npm run dev

# 6. Login again
# Go to http://localhost:5173/stock/login

# 7. Try creating tax again
```

### Get Help

If issue persists:

1. **Check Backend Logs**
   - Copy error from backend console
   - Look for stack trace

2. **Check Browser Console**
   - Copy error from browser console
   - Include network request details

3. **Provide Details**
   - What were you trying to do?
   - What error message appeared?
   - Backend console output
   - Browser console output
   - Network tab screenshot

### Quick Diagnostic Script

Run this in browser console:

```javascript
// Tax System Diagnostic
console.log('=== TAX SYSTEM DIAGNOSTIC ===');
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Token exists:', !!localStorage.getItem('stockToken'));
console.log('Token length:', localStorage.getItem('stockToken')?.length);

// Test API connection
fetch('http://localhost:3001/api/v1/health')
  .then(r => r.json())
  .then(d => console.log('API Health:', d))
  .catch(e => console.error('API Error:', e));

// Test auth
const token = localStorage.getItem('stockToken');
if (token) {
  fetch('http://localhost:3001/api/v1/stock/taxes', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(d => console.log('Taxes loaded:', d.length))
    .catch(e => console.error('Auth Error:', e));
}
```

### Success Indicators

When everything works correctly:

✅ Backend console shows: "Tax created successfully"  
✅ Browser console shows: "Tax saved successfully!"  
✅ Alert shows: "Tax saved successfully!"  
✅ Tax appears in the table  
✅ No red errors in console  
✅ Network tab shows 201 status  

---

**Still having issues?**
Check the main documentation: TAX_MANAGEMENT_SYSTEM.md
