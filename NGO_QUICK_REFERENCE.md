# NGO System - Quick Reference Guide

## 🚀 Quick Start

### Access Points
- **Main NGO Dashboard**: `http://localhost:5173/ngo`
- **Super Admin NGO Management**: `http://localhost:5173/super-admin/ngos`
- **Backend API**: `http://localhost:3001/api/v1/ngo`

---

## 📋 Navigation Tabs

### 1. Organization Tab
**What it does**: Manage multiple NGOs and churches
- Create new organizations
- Switch between organizations
- Edit organization details
- Upload logos and documents
- Set default language and currency

### 2. Branches Tab
**What it does**: Manage headquarters, regional offices, and church branches
- Add branches with GPS coordinates
- Link branches to organizations
- Upload branch photos and documents
- Track branch services
- Manage church-specific details

### 3. Departments Tab
**What it does**: Create department structure with budgets
- Add departments to branches
- Assign department heads
- Set cost centers and account codes
- Allocate budgets
- Track department services

### 4. Org Chart Tab
**What it does**: Build staff hierarchy
- Add staff members
- Assign to branches and departments
- Set up reporting lines
- Manage permissions
- Upload staff photos and documents

### 5. Roles Tab
**What it does**: Configure user permissions
- Create permission bundles
- Assign to staff, branches, or departments
- Set approval limits
- Control access scope

### 6. Finance Audit Tab
**What it does**: Professional accounting system
- **Chart of Accounts**: NGO-specific GL accounts
- **Bank Accounts**: Multiple accounts with reconciliation
- **Payments**: Payment vouchers with approvals
- **Journal Entries**: Double-entry bookkeeping

### 7. Beneficial Owners Tab
**What it does**: Transparency and KYC compliance
- Record governance control
- Track PEP status
- Verify KYC
- Maintain transparency register

### 8. Projects & Tenders Tab
**What it does**: Project portfolio and procurement
- **Projects**: Budget, beneficiaries, outcomes
- **Tenders**: Procurement with evaluation methods
- Track project spending
- Monitor beneficiary reach

### 9. Contracts & Storage Tab
**What it does**: Contract and document management
- **Contracts**: Professional contract register
- **Storage**: Physical and digital repositories
- Track contract values
- Manage retention policies

### 10. Impact Evaluation Tab
**What it does**: Outcome measurement
- **Impact Indicators**: Baseline, target, actual
- **Evaluations**: Baseline, midline, final reviews
- Verification status
- Learning recommendations

### 11. Field GIS Tab
**What it does**: GPS-enabled field operations
- Map field sites with GPS
- Track beneficiaries per site
- Log field visits
- Google Maps integration

### 12. Service Control Tab
**What it does**: Multi-service integration
- Enable/disable services
- Monitor service health
- View cross-service permissions
- Track unified audit trail

### 13. Settings Tab
**What it does**: Master system controller
- Allow/Restrict features
- Clear feature data
- Reset to defaults
- System-wide controls

---

## 🔑 Key Features by Use Case

### For NGO Administrators
1. **Organization** → Create and manage NGOs
2. **Branches** → Set up regional offices
3. **Departments** → Structure your organization
4. **Org Chart** → Build staff hierarchy
5. **Roles** → Control permissions
6. **Service Control** → Enable services

### For Finance Officers
1. **Finance Audit** → Chart of accounts
2. **Finance Audit** → Bank accounts
3. **Finance Audit** → Payment vouchers
4. **Finance Audit** → Journal entries
5. **Projects & Tenders** → Budget tracking
6. **Beneficial Owners** → Transparency register

### For Field Officers
1. **Field GIS** → Map project sites
2. **Field GIS** → Log field visits
3. **Field GIS** → Track beneficiaries
4. **Branches** → View field offices
5. **Projects & Tenders** → Project details

### For Church Leaders
1. **Organization** → Create church organization
2. **Branches** → Add church branches
3. **Branches** → Track offerings and attendance
4. **Org Chart** → Manage pastoral staff
5. **Service Control** → Enable church operations

### For Compliance Officers
1. **Beneficial Owners** → KYC register
2. **Contracts & Storage** → Contract register
3. **Contracts & Storage** → Document repositories
4. **Impact Evaluation** → Verification status
5. **Service Control** → Audit trail

---

## 📊 Common Workflows

### Workflow 1: Set Up New NGO
1. Go to **Organization** tab
2. Fill "Create NGO / Church" form
3. Add organization details
4. Upload logo and documents
5. Click "Create Organization"

### Workflow 2: Add Regional Office
1. Go to **Branches** tab
2. Select your organization
3. Fill branch form
4. Add GPS coordinates
5. Upload branch photo
6. Click "Add Branch"

### Workflow 3: Create Department Budget
1. Go to **Departments** tab
2. Select organization and branch
3. Add department name and head
4. Set cost center and account code
5. Enter budget amount
6. Click "Add Department"

### Workflow 4: Build Staff Hierarchy
1. Go to **Org Chart** tab
2. Add staff member
3. Assign to branch and department
4. Select "Reports To" (manager)
5. Set permissions
6. Click "Add Staff"

### Workflow 5: Set Up Finance
1. Go to **Finance Audit** tab
2. Review chart of accounts
3. Add bank account
4. Create payment voucher
5. Record journal entry

### Workflow 6: Map Field Site
1. Go to **Field GIS** tab
2. Enter site name
3. Select branch
4. Add GPS coordinates
5. Enter beneficiary count
6. Click "Map Site"

### Workflow 7: Enable Services
1. Go to **Service Control** tab
2. Fill service form
3. Enter service name (e.g., "Finance")
4. Set owner role
5. List linked modules
6. Click "Add Service"

---

## 🎯 Quick Tips

### Multi-Organization Management
- Use the organization selector to switch between NGOs
- Each organization has separate branches, staff, and finances
- Export workspace to backup all organizations

### GPS Mapping
- Format: `latitude, longitude` (e.g., `9.0300, 38.7400`)
- Click GPS link to open in Google Maps
- Track beneficiaries per site

### Finance Audit
- Chart of accounts is pre-configured for NGOs
- Use fund accounting (Restricted vs Unrestricted)
- Payment vouchers require approval workflow

### Permissions
- Create roles with permission bundles
- Assign roles to staff, branches, or departments
- Set approval limits per role

### Service Integration
- Enable services in Service Control tab
- Monitor service health in real-time
- View unified audit trail across all services

### Data Persistence
- All data saves automatically in browser
- Export workspace as JSON for backup
- Import workspace to restore data

---

## 🔧 Troubleshooting

### Issue: Can't see my organization
**Solution**: Check the organization selector at the top of each tab

### Issue: Branch not showing in department form
**Solution**: Make sure the branch is linked to the active organization

### Issue: Staff not appearing in "Reports To" dropdown
**Solution**: Staff must be in the same organization to appear

### Issue: GPS link not working
**Solution**: Ensure GPS format is `latitude, longitude` with comma

### Issue: Service not showing as enabled
**Solution**: Check Service Control tab and verify status is "Enabled"

### Issue: Data not saving
**Solution**: Check browser console for errors, ensure localStorage is enabled

---

## 📞 API Endpoints Reference

### Super Admin Endpoints
```
POST   /api/v1/super-admin/ngos          - Create NGO
GET    /api/v1/super-admin/ngos          - List all NGOs
GET    /api/v1/super-admin/ngos/:id      - Get NGO
PUT    /api/v1/super-admin/ngos/:id      - Update NGO
DELETE /api/v1/super-admin/ngos/:id      - Delete NGO
```

### NGO Operations Endpoints
```
GET/POST /api/v1/ngo/branches           - Branches
GET/POST /api/v1/ngo/field-sites        - Field sites
GET/POST /api/v1/ngo/field-visits       - Field visits
GET/POST /api/v1/ngo/grants             - Grants
GET/POST /api/v1/ngo/donor-reports      - Donor reports
GET      /api/v1/ngo/service-health     - Service health
```

---

## ✅ System Status

**Backend**: ✅ Fully operational
**Frontend**: ✅ Fully operational
**Integration**: ✅ Complete
**Data Persistence**: ✅ Working
**Export/Import**: ✅ Working

---

## 📚 Additional Resources

- **Full Documentation**: `NGO_SYSTEM_INTEGRATION_COMPLETE.md`
- **Backend Code**: `backend/src/routes/ngo/`
- **Frontend Code**: `frontend/src/pages/ngo/`
- **Models**: `backend/src/models/superAdmin/ngo.model.js`

---

**Last Updated**: 2026-01-20
**Version**: 1.0.0
**Status**: ✅ Production Ready
