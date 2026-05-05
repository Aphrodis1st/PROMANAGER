# Stock Dashboard - Quick Reference Guide

## Access URLs

### ❌ OLD (Removed)
- `http://localhost:5173/stock/dashboard` - **NO LONGER EXISTS**

### ✅ NEW (Current)
- `http://localhost:5173/` - Homepage (Service Selection)
- `http://localhost:5173/stock/login` - Login Page
- `http://localhost:5173/stock` - **Main Dashboard (Requires Authentication)**

## User Flow

```
Homepage → Click "Access Stock Management" → Login Page → Enter Credentials → Dashboard (/stock)
```

## Dashboard Access Requirements

### Authentication Required
- User must be logged in with valid JWT token
- Unauthenticated users are redirected to `/stock/login`

### Allowed Roles
- SUPER_ADMIN
- ADMIN
- DIRECTOR_MANAGER
- PRODUCTION_MANAGER
- FINANCE_MANAGER
- SALE_MANAGER
- MARKETTING_MANAGER
- ACCOUNTANT
- STOCK_KEEPER
- PROCUREMENT
- SALES

## Dashboard Features by Role

### All Users See
- User information (email, role, department)
- Statistics cards (Products, Inventory Value, Low Stock, Out of Stock)
- Recent activity section

### Quick Actions (Role-Based)

| Action | Roles | Departments |
|--------|-------|-------------|
| Manage Inventory | ADMIN, DIRECTOR_MANAGER, STOCK_KEEPER, ACCOUNTANT | Warehouse, Finance |
| New Purchase | ADMIN, DIRECTOR_MANAGER, PROCUREMENT, ACCOUNTANT | Purchasing, Finance |
| New Sale | ADMIN, DIRECTOR_MANAGER, SALE_MANAGER, SALES, ACCOUNTANT | Sales, Finance |
| View Reports | ADMIN, DIRECTOR_MANAGER, FINANCE_MANAGER, ACCOUNTANT | All |

### Admin Override
**ADMIN**, **SUPER_ADMIN**, and **DIRECTOR_MANAGER** have full access to:
- All quick actions
- All routes
- All departments
- All features

## Testing Checklist

- [ ] Navigate to `/stock` without login → Redirects to `/stock/login`
- [ ] Login with valid credentials → Redirects to `/stock` dashboard
- [ ] Dashboard shows user email, role, and department
- [ ] Quick actions appear based on user role
- [ ] Statistics cards are visible
- [ ] Navigation to other stock pages works
- [ ] Logout redirects to login page
- [ ] `/stock/dashboard` returns 404 (route removed)

## Example User Scenarios

### Scenario 1: Admin User
```
Role: ADMIN
Department: N/A
Quick Actions: All (Inventory, Purchase, Sale, Reports)
Access: Full system access
```

### Scenario 2: Stock Keeper
```
Role: STOCK_KEEPER
Department: Warehouse
Quick Actions: Manage Inventory
Access: Warehouse-related features
```

### Scenario 3: Sales Representative
```
Role: SALES
Department: Sales
Quick Actions: New Sale
Access: Sales-related features
```

### Scenario 4: Accountant
```
Role: ACCOUNTANT
Department: Finance
Quick Actions: All (Inventory, Purchase, Sale, Reports)
Access: Finance and cross-department features
```

## Key Implementation Files

### Frontend
- `frontend/src/App.jsx` - Route configuration
- `frontend/src/pages/stock/StockDashboardOverview.jsx` - Dashboard component
- `frontend/src/context/StockAuthContext.jsx` - Authentication context
- `frontend/src/components/stock/StockProtectedRoute.jsx` - Route protection
- `frontend/src/pages/ServiceSelection.jsx` - Homepage

### Backend
- `backend/src/middleware/stock/auth.js` - Authentication middleware
- `backend/src/controllers/stock/auth.controller.js` - Auth controller
- `backend/src/models/stock/user.model.js` - User model
- `backend/src/config/stock.rbac.config.js` - RBAC configuration

## Common Issues & Solutions

### Issue: Dashboard not loading after login
**Solution**: Check if user has valid role in ALLOWED_ROLES array

### Issue: Quick actions not appearing
**Solution**: Verify user role and department match the required permissions

### Issue: Redirected to login after successful authentication
**Solution**: Check JWT token is being stored in localStorage

### Issue: Access denied on dashboard
**Solution**: Ensure user role is in the allowed roles list for `/stock` route

## Development Commands

```bash
# Start frontend
cd frontend
npm run dev

# Start backend
cd backend
npm start

# Access application
http://localhost:5173
```

## Production Deployment Notes

1. Update environment variables for production API URL
2. Ensure JWT_ACCESS_SECRET is set securely
3. Configure CORS for production domain
4. Enable HTTPS for secure token transmission
5. Set up proper error logging
6. Configure session timeout appropriately

## Support & Documentation

- Full Implementation Guide: `STOCK_RBAC_DASHBOARD_IMPLEMENTATION.md`
- Routing Update Details: `STOCK_DASHBOARD_ROUTING_UPDATE.md`
- Hospital RBAC Reference: `RBAC_DOCUMENTATION.md`

---

**Last Updated**: 2024
**Version**: 2.0
**Status**: ✅ Production Ready
