# Stock Management Role-Based Dashboard Implementation

## Overview
The stock management system now has a role-based access control (RBAC) dashboard similar to the hospital module. Each user sees a personalized dashboard based on their role and department access.

## Implementation Details

### 1. Role-Based Access Control (RBAC)

#### Roles Hierarchy
- **SUPER_ADMIN** (Level 10) - Full system access
- **ADMIN** (Level 9) - Full system access
- **DIRECTOR_MANAGER** (Level 8) - Full system access
- **PRODUCTION_MANAGER** (Level 7) - Production department access
- **FINANCE_MANAGER** (Level 7) - Finance department access
- **SALE_MANAGER** (Level 7) - Sales department access
- **MARKETTING_MANAGER** (Level 7) - Marketing department access
- **ACCOUNTANT** (Level 5) - Finance department access
- **STOCK_KEEPER** (Level 4) - Warehouse department access
- **PROCUREMENT** (Level 4) - Purchasing department access
- **SALES** (Level 3) - Sales department access
- **GUEST** (Level 1) - Limited access

#### Departments
- **Warehouse** - Inventory management
- **Finance** - Financial operations
- **Purchasing** - Procurement operations
- **Sales** - Sales operations
- **Production** - Manufacturing operations
- **Marketing** - Marketing operations

### 2. Dashboard Features

#### User Information Display
The dashboard banner shows:
- User email
- User role
- User department
- Quick access to reports (for authorized roles)

#### Role-Based Quick Actions
Quick actions are dynamically generated based on user permissions:
- **Inventory Management** - ADMIN, DIRECTOR_MANAGER, STOCK_KEEPER, ACCOUNTANT (Warehouse/Finance)
- **New Purchase** - ADMIN, DIRECTOR_MANAGER, PROCUREMENT, ACCOUNTANT (Purchasing/Finance)
- **New Sale** - ADMIN, DIRECTOR_MANAGER, SALE_MANAGER, SALES, ACCOUNTANT (Sales/Finance)
- **View Reports** - ADMIN, DIRECTOR_MANAGER, FINANCE_MANAGER, ACCOUNTANT

#### Statistics Cards
All authenticated users can view:
- Total Products
- Total Inventory Value
- Low Stock Items
- Out of Stock Items

### 3. Authentication Flow

1. User logs in via `/stock/login`
2. Backend validates credentials and returns user data with role and department
3. Frontend stores user data in StockAuthContext
4. User is redirected to `/stock` (dashboard)
5. Dashboard displays role-based content

### 4. Protected Routes

All stock routes are protected with role and department checks:
- Routes check user role against allowed roles
- Routes check user department against allowed departments
- ADMIN, SUPER_ADMIN, and DIRECTOR_MANAGER bypass all restrictions

### 5. Backend Implementation

#### Middleware (`backend/src/middleware/stock/auth.js`)
- `requireAuth` - Validates JWT token and loads user
- `requireRole` - Checks user role (ADMIN/SUPER_ADMIN/DIRECTOR_MANAGER bypass)
- `requireDepartment` - Checks user department (ADMIN/SUPER_ADMIN/DIRECTOR_MANAGER bypass)

#### User Model (`backend/src/models/stock/user.model.js`)
- Stores user role and department
- Validates roles against ALLOWED_ROLES
- Returns complete user object with role and department

#### Auth Controller (`backend/src/controllers/stock/auth.controller.js`)
- Login returns user with role and department
- Register creates user with specified role and department
- Me endpoint returns current user data

### 6. Frontend Implementation

#### StockAuthContext (`frontend/src/context/StockAuthContext.jsx`)
- `hasRole(roles)` - Checks if user has required role
- `inDepartment(departments)` - Checks if user belongs to required department
- ADMIN/SUPER_ADMIN/DIRECTOR_MANAGER have full access

#### StockProtectedRoute (`frontend/src/components/stock/StockProtectedRoute.jsx`)
- Validates authentication
- Checks role requirements
- Checks department requirements
- Shows appropriate error messages

#### StockDashboardOverview (`frontend/src/pages/stock/StockDashboardOverview.jsx`)
- Displays user information
- Shows role-based quick actions
- Displays statistics cards
- Provides navigation to authorized pages

### 7. Configuration Files

#### Backend RBAC Config (`backend/src/config/stock.rbac.config.js`)
- Defines all roles with levels and departments
- Maps departments to allowed roles
- Defines page access rules

### 8. Usage Examples

#### Creating a Stock User
```javascript
// ADMIN user with full access
{
  name: "John Admin",
  email: "admin@stock.com",
  password: "password123",
  role: "ADMIN",
  department: null
}

// STOCK_KEEPER with warehouse access
{
  name: "Jane Keeper",
  email: "keeper@stock.com",
  password: "password123",
  role: "STOCK_KEEPER",
  department: "Warehouse"
}

// SALES user with sales department access
{
  name: "Bob Sales",
  email: "sales@stock.com",
  password: "password123",
  role: "SALES",
  department: "Sales"
}
```

#### Checking Access in Components
```javascript
const { user, hasRole, inDepartment } = useStockAuth();

// Check if user can access inventory
if (hasRole(["ADMIN", "STOCK_KEEPER"]) || inDepartment(["Warehouse"])) {
  // Show inventory management
}

// Check if user can create purchases
if (hasRole(["ADMIN", "PROCUREMENT"]) || inDepartment(["Purchasing"])) {
  // Show purchase creation
}
```

## Testing

### Test Different User Roles
1. Create users with different roles using the backend script
2. Login with each user
3. Verify dashboard shows appropriate content
4. Verify navigation to authorized pages works
5. Verify unauthorized pages show access denied

### Test Department Access
1. Create users in different departments
2. Login and verify department-specific access
3. Verify cross-department restrictions work

## Benefits

1. **Security** - Users only see what they're authorized to access
2. **Personalization** - Each user gets a tailored experience
3. **Scalability** - Easy to add new roles and departments
4. **Consistency** - Same pattern as hospital module
5. **Maintainability** - Centralized RBAC configuration

## Future Enhancements

1. Add real-time statistics from database
2. Add recent activity tracking
3. Add role-based notifications
4. Add department-specific widgets
5. Add user preferences and customization
