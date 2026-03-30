# Authentication Debugging Guide

## Issue: 401 Unauthorized / JWT Malformed

### Quick Diagnosis Steps

#### 1. **Test Backend is Running**
```bash
curl http://localhost:5000/api/v1/health
# Should return: { "ok": true }
```

#### 2. **Test Hospital Auth Routes**
```bash
curl http://localhost:5000/api/v1/hospital/auth/test
# Should return: { "success": true, "message": "Hospital auth routes working" }
```

#### 3. **Test Login Endpoint**
```bash
curl -X POST http://localhost:5000/api/v1/hospital/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"password123"}'
# Should return: { "success": true, "token": "...", "admin": {...}, "hospital": {...} }
```

#### 4. **Test Token Debug Endpoint**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/v1/hospital/admin/debug/token
# Should show token was received
```

---

## Common Issues & Solutions

### Issue 1: "jwt malformed"
**Cause:** Token is not in correct format or contains invalid characters

**Solution:**
1. Check token is being sent with "Bearer " prefix
2. Verify token doesn't have extra spaces
3. Ensure token is complete (not truncated)

**Test:**
```javascript
// In browser console
const token = localStorage.getItem('hospitalToken');
console.log('Token length:', token?.length);
console.log('Token starts with:', token?.substring(0, 50));
```

### Issue 2: "No token provided"
**Cause:** Authorization header is missing

**Solution:**
1. Verify `hospitalToken` is in localStorage
2. Check service is using correct token key
3. Verify login was successful

**Test:**
```javascript
// In browser console
console.log('hospitalToken:', localStorage.getItem('hospitalToken'));
console.log('All localStorage keys:', Object.keys(localStorage));
```

### Issue 3: "User not found"
**Cause:** User exists in wrong collection or with wrong ID

**Solution:**
1. Verify user exists in `hospitalAdmins` collection
2. Check user ID matches token ID
3. Verify hospitalId is set

**Test in Firebase Console:**
```
Collection: hospitalAdmins
Document ID: [should match token.id]
Fields: email, password, hospitalId, role, status
```

### Issue 4: "Hospital admin role required"
**Cause:** User role is not 'hospital_admin'

**Solution:**
1. Verify user role in database is 'hospital_admin'
2. Check token contains correct role
3. Verify user is not 'hospital_sub_admin'

---

## Step-by-Step Debugging

### Step 1: Verify Backend Environment
```bash
# Check .env file has JWT_ACCESS_SECRET
cd backend
cat .env | grep JWT_ACCESS_SECRET
# Should output: JWT_ACCESS_SECRET=<long_string>
```

### Step 2: Check Frontend Token Storage
```javascript
// In browser DevTools Console
localStorage.getItem('hospitalToken')
// Should return a long JWT string starting with "eyJ"
```

### Step 3: Verify Token Format
```javascript
// In browser DevTools Console
const token = localStorage.getItem('hospitalToken');
const parts = token.split('.');
console.log('Token parts:', parts.length); // Should be 3
console.log('Header:', parts[0]);
console.log('Payload:', parts[1]);
console.log('Signature:', parts[2]);
```

### Step 4: Decode Token Payload
```javascript
// In browser DevTools Console
const token = localStorage.getItem('hospitalToken');
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log('Token payload:', payload);
// Should show: { id, hospitalId, role, iat, exp }
```

### Step 5: Check Network Request
1. Open DevTools → Network tab
2. Make a request to `/api/v1/hospital/admin/users`
3. Check Request Headers:
   - Authorization: Bearer [token]
4. Check Response:
   - Status code (401, 403, 200)
   - Error message

---

## Complete Login & Test Flow

### 1. Login
```bash
curl -X POST http://localhost:5000/api/v1/hospital/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "admin_doc_id",
    "email": "admin@hospital.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "hospital_admin",
    "hospitalId": "hospital_id"
  },
  "hospital": {
    "id": "hospital_id",
    "name": "Hospital Name"
  }
}
```

### 2. Store Token
```javascript
// Frontend
localStorage.setItem('hospitalToken', response.token);
```

### 3. Use Token in Request
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/api/v1/hospital/admin/users
```

---

## Middleware Flow Diagram

```
Request
  ↓
[authenticateToken middleware]
  ├─ Extract token from Authorization header
  ├─ Verify JWT signature
  ├─ Decode token payload
  ├─ Look up user in database
  └─ Attach user to req.user
  ↓
[checkHospitalAdmin middleware]
  ├─ Verify user role is hospital_admin
  ├─ Verify user has hospitalId
  └─ Attach hospitalId to req.user
  ↓
[Controller]
  └─ Process request with authenticated user
```

---

## Environment Variables Checklist

- [ ] JWT_ACCESS_SECRET is set in .env
- [ ] JWT_ACCESS_SECRET is not empty
- [ ] FIREBASE_PROJECT_ID is set
- [ ] SERVICE_ACCOUNT_PATH points to valid file
- [ ] PORT is set (default 5000)
- [ ] CORS_ORIGIN is set or defaults to '*'

---

## Database Verification

### Check Hospital Admin Exists
```javascript
// In Firebase Console
db.collection('hospitalAdmins').where('email', '==', 'admin@hospital.com').get()
// Should return 1 document with:
// - id: document_id
// - email: admin@hospital.com
// - password: hashed_password
// - role: hospital_admin
// - hospitalId: valid_hospital_id
// - status: active
```

### Check Hospital Exists
```javascript
// In Firebase Console
db.collection('hospitals').doc('hospital_id').get()
// Should return document with:
// - id: hospital_id
// - name: Hospital Name
// - status: active
```

---

## Frontend Service Verification

### Check Service is Using Correct Token Key
```javascript
// In hospitalAdmin.service.js
getAuthHeaders() {
  const token = localStorage.getItem('hospitalToken'); // ✅ Correct
  // NOT: localStorage.getItem('token'); ❌ Wrong
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}
```

---

## Quick Fix Checklist

- [ ] Restart backend server
- [ ] Clear browser localStorage
- [ ] Login again
- [ ] Check token is stored as 'hospitalToken'
- [ ] Verify JWT_ACCESS_SECRET in .env
- [ ] Check user exists in hospitalAdmins collection
- [ ] Verify user role is 'hospital_admin'
- [ ] Check user status is 'active'
- [ ] Verify hospitalId is set on user

---

## Testing with Postman

### 1. Login Request
```
POST http://localhost:5000/api/v1/hospital/auth/login
Headers:
  Content-Type: application/json
Body:
{
  "email": "admin@hospital.com",
  "password": "password123"
}
```

### 2. Get Users Request
```
GET http://localhost:5000/api/v1/hospital/admin/users
Headers:
  Authorization: Bearer [token_from_login]
  Content-Type: application/json
```

---

## Logs to Check

### Backend Console
```
✅ Token verified successfully. Decoded: { id: '...', role: 'hospital_admin' }
✅ User found: { id: '...', role: 'hospital_admin', isActive: true }
✅ Authentication successful for user: ...
```

### Browser Console
```
✅ Using token: eyJ...
✅ GET http://localhost:5000/api/v1/hospital/admin/users 200
```

---

## Still Having Issues?

1. **Check backend logs** - Look for error messages
2. **Verify network request** - Use DevTools Network tab
3. **Test with curl** - Bypass frontend issues
4. **Check Firebase connection** - Verify Firestore is accessible
5. **Restart everything** - Backend, frontend, browser

---

**Last Updated:** 2024
**Status:** Debugging Guide Complete ✅
