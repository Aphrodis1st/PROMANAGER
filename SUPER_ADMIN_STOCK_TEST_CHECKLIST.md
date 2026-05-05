# Super Admin Stock Integration - Test Checklist

## Test URL: http://localhost:5173/super-admin

---

## 1. Dashboard (`/super-admin/dashboard`)

### ✅ Visual Elements
- [ ] Page loads without errors
- [ ] Header shows: "Manage hospitals, stocks, and monitor system-wide activities"
- [ ] 5 stat cards displayed:
  - [ ] Total Hospitals (with active/suspended breakdown)
  - [ ] Total Stocks (with active/suspended breakdown)
  - [ ] All Admins (with active/inactive breakdown)
  - [ ] Premium Plans (with basic/enterprise breakdown)
  - [ ] System Entities (combined hospitals + stocks)

### ✅ Data Display
- [ ] Hospital count displays correctly
- [ ] Stock count displays correctly
- [ ] Combined entity count = hospitals + stocks
- [ ] Admin statistics show all admins (hospital + stock)
- [ ] Recent activities show both hospital and stock events

### ✅ Recent Activities
- [ ] Hospital creation shows with "H" icon
- [ ] Stock creation shows with "S" icon
- [ ] Admin login shows with "A" icon
- [ ] Activity descriptions are correct
- [ ] Timestamps display properly

### ✅ Quick Actions
- [ ] "Add Hospital" button visible
- [ ] "Add Stock" button visible
- [ ] "Add Admin" button visible
- [ ] "Activity" button visible

---

## 2. Admin Management (`/super-admin/hospital-admins`)

### ✅ Page Header
- [ ] Title shows "Admin Management"
- [ ] Subtitle: "Manage hospital and stock administrators"
- [ ] "Add Admin" button visible

### ✅ Statistics Cards
- [ ] Total Admins count
- [ ] Active Admins count
- [ ] Inactive Admins count

### ✅ Admin Table
- [ ] Table header shows "Administrators" (not "Hospital Administrators")
- [ ] Column header shows "Entity" (not "Hospital")
- [ ] Entity column displays hospital OR stock name
- [ ] All admins listed (both hospital and stock admins)

### ✅ Create Admin Modal
- [ ] Modal opens when clicking "Add Admin"
- [ ] Email field present
- [ ] Password field present
- [ ] Entity Type dropdown with options:
  - [ ] Hospital
  - [ ] Stock
- [ ] Entity selection dropdown changes based on type:
  - [ ] Shows hospitals when "Hospital" selected
  - [ ] Shows stocks when "Stock" selected
- [ ] Can create admin for hospital
- [ ] Can create admin for stock
- [ ] Modal closes after creation
- [ ] Form resets to default (entityType: 'hospital')

### ✅ Admin Actions
- [ ] Activate/Deactivate button works
- [ ] Reset Password button opens modal
- [ ] Reassign button opens modal with:
  - [ ] Entity Type selector (Hospital/Stock)
  - [ ] Entity dropdown updates based on type
  - [ ] Can reassign to hospital
  - [ ] Can reassign to stock
- [ ] Delete button works

### ✅ Reassign Modal
- [ ] Shows current admin email
- [ ] Entity Type dropdown present
- [ ] Entity selection updates when type changes
- [ ] Can reassign from hospital to stock
- [ ] Can reassign from stock to hospital
- [ ] Can reassign within same type

---

## 3. System Activity (`/super-admin/activity`)

### ✅ Page Header
- [ ] Title: "System Activity"
- [ ] Subtitle: "Monitor all system-wide activities and events"
- [ ] Refresh button present

### ✅ Activity Filters
- [ ] 7 filter buttons displayed:
  - [ ] All Activities
  - [ ] Hospital Created
  - [ ] Stock Created
  - [ ] Admin Logins
  - [ ] Hospital Updates
  - [ ] Stock Updates
  - [ ] Admin Created
- [ ] Each filter shows count
- [ ] Clicking filter updates activity list

### ✅ Activity Types Tracked
- [ ] `hospital_created` - Shows "H" icon
- [ ] `stock_created` - Shows "S" icon
- [ ] `hospital_updated` - Shows "U" icon
- [ ] `stock_updated` - Shows "U" icon
- [ ] `hospital_suspended` - Shows "X" icon
- [ ] `stock_suspended` - Shows "X" icon
- [ ] `hospital_activated` - Shows "R" icon
- [ ] `stock_activated` - Shows "R" icon
- [ ] `admin_login` - Shows "A" icon
- [ ] `admin_created` - Shows "+" icon

### ✅ Activity Descriptions
- [ ] Hospital activities show hospital name
- [ ] Stock activities show stock name
- [ ] Admin activities show admin email
- [ ] Timestamps display correctly
- [ ] Activity badges show correct colors

### ✅ Activity Summary
- [ ] Total Activities Today count
- [ ] Most Active Type displayed
- [ ] Last Activity time shown

### ✅ Quick Insights
- [ ] System Health status
- [ ] Recent Growth shows: "X new entities this month" (hospitals + stocks)
- [ ] Admin Activity shows login count

---

## 4. Settings (`/super-admin/settings`)

### ✅ Page Header
- [ ] Title: "System Settings"
- [ ] Subtitle: "Configure global system preferences"

### ✅ Settings Options
- [ ] System Name field (default: PROMANAGER)
- [ ] Maintenance Mode toggle
- [ ] Hospital Management toggle
- [ ] Stock Management toggle

### ✅ Toggle Functionality
- [ ] Maintenance Mode toggle works
- [ ] Hospital Management toggle works
- [ ] Stock Management toggle works
- [ ] Toggles show correct state (on/off)
- [ ] Visual feedback on toggle

### ✅ Save Functionality
- [ ] Save Settings button present
- [ ] Success message shows after save
- [ ] Message disappears after 3 seconds

---

## 5. Stock Management (`/super-admin/stocks`)

### ✅ Page Elements
- [ ] Title: "Stock Management"
- [ ] Subtitle: "Manage all stock entities in the system"
- [ ] "Add Stock" button visible

### ✅ Stock Cards
- [ ] All stocks displayed in grid
- [ ] Each card shows:
  - [ ] Stock name
  - [ ] Location
  - [ ] Status badge (active/suspended)
  - [ ] Contact info (email, phone)
  - [ ] Subscription plan
  - [ ] Features count
  - [ ] Action buttons

### ✅ Create Stock
- [ ] Modal opens on "Add Stock" click
- [ ] Form fields:
  - [ ] Stock Name
  - [ ] Location
  - [ ] Email
  - [ ] Phone
  - [ ] Subscription Plan dropdown
- [ ] Can create new stock
- [ ] Modal closes after creation
- [ ] New stock appears in list

### ✅ Stock Actions
- [ ] Suspend/Activate button works
- [ ] Features button opens modal
- [ ] Soft Delete works
- [ ] Hard Delete works (with confirmation)

### ✅ Features Modal
- [ ] Shows stock name
- [ ] Lists all available features:
  - [ ] inventory
  - [ ] purchases
  - [ ] sales
  - [ ] dispense
  - [ ] transfers
  - [ ] adjustments
  - [ ] returns
  - [ ] general_journal
  - [ ] expenses
  - [ ] fixed_assets
- [ ] Can check/uncheck features
- [ ] Update Features button saves changes

---

## 6. Hospital Management (`/super-admin/hospitals`)

### ✅ Verify Still Works
- [ ] Page loads correctly
- [ ] Can create hospitals
- [ ] Can manage hospital features
- [ ] Can suspend/activate hospitals
- [ ] All existing functionality intact

---

## Integration Tests

### ✅ Cross-Page Navigation
- [ ] Can navigate between all pages via sidebar
- [ ] Active page highlighted in sidebar
- [ ] No broken links

### ✅ Data Consistency
- [ ] Creating stock updates dashboard stats
- [ ] Creating hospital updates dashboard stats
- [ ] Creating admin updates admin count
- [ ] Activities appear in System Activity page
- [ ] Stats refresh correctly

### ✅ Admin Assignment
- [ ] Can create admin for hospital
- [ ] Can create admin for stock
- [ ] Admin appears in admin list with correct entity
- [ ] Can reassign admin from hospital to stock
- [ ] Can reassign admin from stock to hospital

### ✅ API Integration
- [ ] All API calls succeed
- [ ] Error handling works
- [ ] Loading states display
- [ ] Success messages show

---

## Backend Verification

### ✅ Database Collections
- [ ] `hospitals` collection exists
- [ ] `stocks` collection exists
- [ ] `hospitalAdmins` collection exists
- [ ] Data saves correctly

### ✅ API Endpoints
- [ ] `GET /api/v1/super-admin/stocks` works
- [ ] `POST /api/v1/super-admin/stocks` works
- [ ] `PATCH /api/v1/super-admin/stocks/:id/status` works
- [ ] `PATCH /api/v1/super-admin/stocks/:id/features` works
- [ ] `DELETE /api/v1/super-admin/stocks/:id` works
- [ ] Dashboard stats include stock data

### ✅ Dashboard Stats API
- [ ] Returns `totalStocks`
- [ ] Returns `activeStocks`
- [ ] Returns `suspendedStocks`
- [ ] Returns combined admin count

---

## Browser Console Checks

### ✅ No Errors
- [ ] No console errors on dashboard
- [ ] No console errors on admin management
- [ ] No console errors on activity page
- [ ] No console errors on settings
- [ ] No console errors on stock management

### ✅ Network Requests
- [ ] All API calls return 200/201
- [ ] No 404 errors
- [ ] No 500 errors
- [ ] Authentication headers present

---

## User Experience

### ✅ Visual Consistency
- [ ] All pages use same design language
- [ ] Colors consistent across pages
- [ ] Icons appropriate for context
- [ ] Spacing and layout uniform

### ✅ Responsive Design
- [ ] Dashboard responsive on mobile
- [ ] Tables scroll on small screens
- [ ] Modals display correctly
- [ ] Cards stack properly

### ✅ Loading States
- [ ] Spinner shows while loading
- [ ] No flash of empty content
- [ ] Smooth transitions

### ✅ User Feedback
- [ ] Success messages display
- [ ] Error messages display
- [ ] Confirmation dialogs work
- [ ] Button states update

---

## Test Scenarios

### Scenario 1: Create Stock and Admin
1. [ ] Go to Stock Management
2. [ ] Create new stock "Test Stock"
3. [ ] Verify stock appears in list
4. [ ] Go to Dashboard
5. [ ] Verify stock count increased
6. [ ] Go to Admin Management
7. [ ] Create admin for "Test Stock"
8. [ ] Verify admin appears with stock name

### Scenario 2: Reassign Admin
1. [ ] Go to Admin Management
2. [ ] Select admin assigned to hospital
3. [ ] Click Reassign
4. [ ] Change entity type to Stock
5. [ ] Select a stock
6. [ ] Confirm reassignment
7. [ ] Verify admin now shows stock name

### Scenario 3: Track Activities
1. [ ] Create a new hospital
2. [ ] Create a new stock
3. [ ] Go to System Activity
4. [ ] Verify both activities appear
5. [ ] Filter by "Hospital Created"
6. [ ] Verify only hospital activity shows
7. [ ] Filter by "Stock Created"
8. [ ] Verify only stock activity shows

### Scenario 4: Manage Features
1. [ ] Go to Stock Management
2. [ ] Click Features on a stock
3. [ ] Enable/disable features
4. [ ] Save changes
5. [ ] Verify features updated
6. [ ] Repeat for Hospital Management
7. [ ] Verify both work independently

---

## Final Verification

### ✅ All Pages Accept Stock
- [ ] Dashboard displays stock data
- [ ] Admin Management handles stock admins
- [ ] System Activity tracks stock events
- [ ] Settings controls stock features
- [ ] Stock Management fully functional

### ✅ No Regressions
- [ ] Hospital functionality still works
- [ ] Existing admins not affected
- [ ] Previous activities still visible
- [ ] No data loss

### ✅ Documentation
- [ ] README updated
- [ ] API documentation current
- [ ] User guide reflects changes

---

## Sign-off

**Tested By:** _________________
**Date:** _________________
**Status:** ☐ Pass ☐ Fail
**Notes:** _________________
