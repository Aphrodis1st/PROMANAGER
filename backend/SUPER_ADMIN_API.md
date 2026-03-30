# 🏥 SUPER ADMIN HOSPITAL MANAGEMENT API

## Overview
Professional Super Admin Dashboard for managing multiple hospitals in a multi-tenant system.

## Authentication
All Super Admin endpoints require Bearer token with `super_admin` role.

```
Authorization: Bearer <jwt_token>
```

## 📊 Dashboard Endpoints

### GET /api/v1/super-admin/dashboard/stats
Get system-wide statistics
```json
{
  "success": true,
  "data": {
    "totalHospitals": 15,
    "activeHospitals": 12,
    "suspendedHospitals": 3,
    "totalAdmins": 45,
    "activeAdmins": 40,
    "inactiveAdmins": 5,
    "subscriptionPlans": {
      "basic": 5,
      "premium": 7,
      "enterprise": 3
    }
  }
}
```

### GET /api/v1/super-admin/dashboard/activity
Get recent system activities
```json
{
  "success": true,
  "data": [
    {
      "type": "hospital_created",
      "data": { "name": "City Hospital", "location": "New York" },
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### GET /api/v1/super-admin/dashboard/settings
Get system settings and available features
```json
{
  "success": true,
  "data": {
    "availableFeatures": ["appointments", "billing", "lab", "pharmacy"],
    "subscriptionPlans": [
      {
        "name": "basic",
        "features": ["appointments", "billing", "medical_records"]
      }
    ]
  }
}
```

## 🏥 Hospital Management Endpoints

### POST /api/v1/super-admin/hospitals
Create new hospital
```json
{
  "name": "City General Hospital",
  "location": "123 Main St, New York, NY",
  "contactInfo": {
    "phone": "+1-555-0123",
    "email": "admin@citygeneral.com"
  },
  "subscriptionPlan": "premium",
  "featuresEnabled": ["appointments", "billing", "lab", "pharmacy"]
}
```

### GET /api/v1/super-admin/hospitals
Get all hospitals
```json
{
  "success": true,
  "data": [
    {
      "id": "hospital_123",
      "name": "City General Hospital",
      "location": "123 Main St, New York, NY",
      "status": "active",
      "subscriptionPlan": "premium",
      "featuresEnabled": ["appointments", "billing", "lab"],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### GET /api/v1/super-admin/hospitals/:id
Get specific hospital

### PUT /api/v1/super-admin/hospitals/:id
Update hospital information

### PATCH /api/v1/super-admin/hospitals/:id/status
Update hospital status
```json
{
  "status": "suspended"  // active, suspended
}
```

### PATCH /api/v1/super-admin/hospitals/:id/features
Update hospital features
```json
{
  "features": ["appointments", "billing", "lab", "pharmacy", "medical_records"]
}
```

### PATCH /api/v1/super-admin/hospitals/:id/soft-delete
Soft delete hospital (recoverable)

### DELETE /api/v1/super-admin/hospitals/:id
Hard delete hospital (permanent)

## 👨‍💼 Hospital Admin Management Endpoints

### POST /api/v1/super-admin/hospital-admins
Create hospital admin
```json
{
  "email": "admin@citygeneral.com",
  "password": "securePassword123",
  "hospitalId": "hospital_123"
}
```

### GET /api/v1/super-admin/hospital-admins
Get all hospital admins

### GET /api/v1/super-admin/hospital-admins/hospital/:hospitalId
Get admins for specific hospital

### GET /api/v1/super-admin/hospital-admins/:id
Get specific admin

### PATCH /api/v1/super-admin/hospital-admins/:id/status
Activate/deactivate admin
```json
{
  "status": "inactive"  // active, inactive
}
```

### PATCH /api/v1/super-admin/hospital-admins/:id/reset-password
Reset admin password
```json
{
  "newPassword": "newSecurePassword123"
}
```

### PATCH /api/v1/super-admin/hospital-admins/:id/track-activity
Track admin login activity

### DELETE /api/v1/super-admin/hospital-admins/:id
Delete hospital admin

## 🔐 Super Admin Features

### Hospital Management
- ✅ Add hospital (name, location, contact, subscription, features)
- ✅ Enable/Disable features per hospital
- ✅ Activate/Suspend hospital
- ✅ Soft delete (recoverable)
- ✅ Hard delete (permanent)

### Hospital Admin Management
- ✅ Create hospital admin
- ✅ Assign to specific hospital
- ✅ Manage admin access (activate/deactivate)
- ✅ Reset passwords
- ✅ Track activity

### System Monitoring
- ✅ Dashboard statistics
- ✅ System-wide activity monitoring
- ✅ Multi-tenant system control
- ✅ Access & permission management

## Error Responses
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden (Super Admin role required)
- 404: Not Found
- 500: Internal Server Error