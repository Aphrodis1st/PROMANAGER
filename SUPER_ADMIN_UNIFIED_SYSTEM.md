# Super Admin Unified System - Hospitals & Stocks

## Overview
All super admin pages now support both Hospital and Stock management from a unified interface. The super admin can manage hospitals, stocks, and their respective administrators from the same dashboard using the same authentication.

## Updated Pages

### 1. Dashboard (`/super-admin/dashboard`)
**Changes:**
- Added stock statistics card showing total, active, and suspended stocks
- Updated "System Entities" card to show combined count of hospitals and stocks
- Displays breakdown: X Hospitals • Y Stocks

**Features:**
- Total Hospitals with active/suspended breakdown
- Total Stocks with active/suspended breakdown
- Hospital Admins statistics
- Combined system entities count
- Premium Plans statistics
- Recent system activities for both hospitals and stocks

---

### 2. Admin Management (`/super-admin/hospital-admins`)
**Changes:**
- Renamed from "Hospital Admin Management" to "Admin Management"
- Added entity type selection (Hospital or Stock)
- Supports creating admins for both hospitals and stocks
- Reassign admins between hospitals or stocks

**Features:**
- **Create Admin:**
  - Select entity type (Hospital/Stock)
  - Choose specific hospital or stock
  - Set email and password
  
- **Manage Admins:**
  - View all admins for hospitals and stocks
  - Activate/Deactivate admin accounts
  - Reset passwords
  - Reassign to different hospital or stock
  - Delete admin accounts

- **Statistics:**
  - Total Admins
  - Active Admins
  - Inactive Admins

**Entity Column:**
- Shows the hospital or stock name the admin is assigned to
- Automatically detects entity type

---

### 3. System Activity (`/super-admin/activity`)
**Changes:**
- Added stock-related activity types
- Tracks both hospital and stock events
- Updated activity filters and descriptions

**Activity Types:**
- `hospital_created` - New hospital created
- `stock_created` - New stock created
- `hospital_updated` - Hospital updated
- `stock_updated` - Stock updated
- `hospital_suspended` - Hospital suspended
- `stock_suspended` - Stock suspended
- `hospital_activated` - Hospital activated
- `stock_activated` - Stock activated
- `admin_login` - Admin login activity
- `admin_created` - New admin created

**Features:**
- Filter by activity type (7 filter options)
- Activity timeline with icons and colors
- Activity summary showing:
  - Total activities today
  - Most active type
  - Last activity time
- Quick insights:
  - System health
  - Recent growth (hospitals + stocks)
  - Admin activity

---

### 4. Settings (`/super-admin/settings`)
**Changes:**
- Added Hospital Management toggle
- Added Stock Management toggle
- System-wide feature control

**Settings:**
- **System Name:** Configure system name (default: PROMANAGER)
- **Maintenance Mode:** Disable access for non-admin users
- **Hospital Management:** Enable/disable hospital features
- **Stock Management:** Enable/disable stock features

**Features:**
- Toggle switches for each feature
- Save settings with confirmation
- Visual feedback on save

---

## Navigation Structure

### Super Admin Sidebar Menu:
1. **Dashboard** - Overview of all entities
2. **Hospital Management** - Manage hospitals
3. **Hospital Admins** - Manage all admins (hospitals & stocks)
4. **Stock Management** - Manage stocks
5. **System Activity** - Monitor all activities
6. **Settings** - System configuration

---

## API Endpoints

### Existing Hospital Endpoints:
- `GET /api/v1/super-admin/hospitals`
- `POST /api/v1/super-admin/hospitals`
- `GET /api/v1/super-admin/hospitals/:id`
- `PUT /api/v1/super-admin/hospitals/:id`
- `PATCH /api/v1/super-admin/hospitals/:id/status`
- `PATCH /api/v1/super-admin/hospitals/:id/features`
- `PATCH /api/v1/super-admin/hospitals/:id/soft-delete`
- `DELETE /api/v1/super-admin/hospitals/:id`

### New Stock Endpoints:
- `GET /api/v1/super-admin/stocks`
- `POST /api/v1/super-admin/stocks`
- `GET /api/v1/super-admin/stocks/:id`
- `PUT /api/v1/super-admin/stocks/:id`
- `PATCH /api/v1/super-admin/stocks/:id/status`
- `PATCH /api/v1/super-admin/stocks/:id/features`
- `PATCH /api/v1/super-admin/stocks/:id/soft-delete`
- `DELETE /api/v1/super-admin/stocks/:id`

### Dashboard Endpoints:
- `GET /api/v1/super-admin/dashboard/stats` - Returns both hospital and stock stats
- `GET /api/v1/super-admin/dashboard/activity` - Returns all activities
- `GET /api/v1/super-admin/dashboard/settings` - Returns system settings

---

## Data Structure

### Admin Entity Assignment:
```javascript
{
  email: "admin@example.com",
  password: "********",
  hospitalId: "entity-id", // Can be hospital or stock ID
  entityType: "hospital" | "stock", // Type of entity
  status: "active" | "inactive",
  lastLogin: timestamp
}
```

### Dashboard Stats:
```javascript
{
  totalHospitals: number,
  activeHospitals: number,
  suspendedHospitals: number,
  totalStocks: number,
  activeStocks: number,
  suspendedStocks: number,
  totalAdmins: number,
  activeAdmins: number,
  inactiveAdmins: number,
  subscriptionPlans: {
    basic: number,
    premium: number,
    enterprise: number
  }
}
```

### Activity Log:
```javascript
{
  type: "hospital_created" | "stock_created" | "admin_login" | ...,
  data: {
    name: string,
    email: string,
    location: string
  },
  timestamp: Date
}
```

---

## Key Features

### Unified Management:
✅ Single dashboard for hospitals and stocks
✅ Same authentication for all operations
✅ Consistent UI/UX across all pages
✅ Unified admin management system

### Entity Support:
✅ Create and manage hospitals
✅ Create and manage stocks
✅ Assign admins to either entity type
✅ Track activities for both entity types

### Flexibility:
✅ Reassign admins between entities
✅ Toggle features per entity
✅ Soft delete and hard delete
✅ Status management (active/suspended)

### Monitoring:
✅ Real-time activity tracking
✅ Combined statistics
✅ Activity filtering by type
✅ System health monitoring

---

## Access Information

**URL:** `http://localhost:5173/super-admin`
**Authentication:** Single super admin login
**Email:** Same email for all super admin operations

---

## Benefits

1. **Centralized Control:** Manage all entities from one place
2. **Consistent Experience:** Same interface for hospitals and stocks
3. **Efficient Administration:** Single login for all operations
4. **Comprehensive Monitoring:** Track all system activities
5. **Flexible Management:** Easy reassignment and configuration
6. **Scalable Design:** Easy to add more entity types in the future

---

## Future Enhancements

- Role-based permissions for super admins
- Bulk operations for entities
- Advanced analytics and reporting
- Email notifications for activities
- Audit trail export functionality
- Multi-language support
