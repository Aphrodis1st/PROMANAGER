# Advanced Property Management System

## Overview
Complete property management solution integrated into PROMANAGER system, following the same architecture as Hospital, Stock, HR, and Pharmacy modules.

## Features Implemented

### 1. Global Dashboard (Owner / Admin)
**Location:** `/property`
- Total properties overview
- Total units/rooms count
- Occupancy rate tracking
- Rent collected this month
- Pending payments monitoring
- Open maintenance tickets
- Expiring leases alerts
- Staff on duty status
- Recent activities feed

### 2. Properties Management
**Location:** `/property/properties`
- Properties list with search/filter
- Add/Edit/Delete properties
- Property profile (photos, address, amenities)
- Buildings/Blocks/Floors structure
- Document management (titles, permits)
- Property owner assignment
- Status tracking (Active/Inactive)

### 3. Units / Rooms / Houses
**Location:** `/property/units`
- Units list by property
- Status tracking: Vacant / Occupied / Maintenance / Reserved
- Rent price management
- Size and features tracking
- Meter readings (water, electricity)
- Unit history
- Bulk import functionality

### 4. Tenants / Guests Management
**Location:** `/property/tenants`
- Tenants list with full profiles
- Document management (ID, lease)
- Check-in / Check-out tracking
- Notices & communication
- Blacklist / history tracking
- Contact information management

### 5. Lease / Booking Management
**Location:** `/property/leases`
- Create and manage leases
- Lease start/end dates
- Rent escalation rules
- Renewal reminders
- E-signature lease documents
- Availability calendar
- Lease status tracking

### 6. Billing, Invoicing & Payments
**Location:** `/property/billing`
- Auto rent invoice generation
- Utilities billing (water/electricity)
- Tenant ledger
- Payment history tracking
- Receipt generation
- Overdue penalties calculation
- Multiple payment methods:
  - Mobile Money
  - Bank Transfer
  - Card Payment
  - Cash

### 7. Maintenance & Work Orders
**Location:** `/property/maintenance`
- Create maintenance tickets
- Assign technicians
- Priority levels (Low, Medium, High, Urgent)
- Status tracking (Open, In Progress, Completed)
- Cost of repair tracking
- Preventive maintenance calendar
- Before/after photos
- Work order history

### 8. Staff / Technicians / Security
**Location:** `/property/staff`
- Staff list management
- Roles & permissions
- Shift schedules
- Task assignment
- Performance tracking
- Contact information

### 9. Reports & Analytics
**Location:** `/property/reports`
- Revenue per property
- Occupancy trends
- Rent collection reports
- Maintenance cost reports
- Tenant reports
- Financial summary
- Lease expiry tracking
- Vacancy analysis
- Export to PDF/Excel

### 10. Communication & Notices
**Location:** `/property/communication`
- Send SMS/Email to tenants
- Payment reminders
- Announcements
- In-app messages
- Bulk messaging
- Message templates
- Communication history

### 11. System Settings
**Location:** `/property/settings`
- Roles & permissions management
- Taxes & currencies configuration
- Payment gateway setup
- Invoice/lease templates
- Audit logs
- Late fee configuration
- System preferences

### 12. Owner Portal
**Location:** `/property/owner-portal`
- View owned properties
- Revenue & expenses tracking
- Download statements
- Approve maintenance costs
- Property performance metrics
- Financial reports

### 13. Tenant / Guest Portal
**Location:** `/property/tenant-portal`
- Pay rent online
- Submit maintenance requests
- View lease agreement
- Upload meter readings
- Download receipts
- View announcements
- Payment history

## Technical Architecture

### Backend Structure
```
backend/src/
├── models/property/
│   ├── property.model.js
│   ├── unit.model.js
│   ├── tenant.model.js
│   ├── lease.model.js
│   ├── billing.model.js
│   ├── maintenance.model.js
│   └── staff.model.js
├── controllers/property/
│   ├── property.controller.js
│   ├── unit.controller.js
│   ├── tenant.controller.js
│   ├── lease.controller.js
│   ├── billing.controller.js
│   ├── maintenance.controller.js
│   └── staff.controller.js
└── routes/property/
    ├── property.routes.js
    ├── unit.routes.js
    ├── tenant.routes.js
    ├── lease.routes.js
    ├── billing.routes.js
    ├── maintenance.routes.js
    └── staff.routes.js
```

### Frontend Structure
```
frontend/src/
├── propertyPages/
│   ├── dashboard/
│   │   └── PropertyDashboard.jsx
│   ├── properties/
│   │   ├── PropertiesList.jsx
│   │   └── PropertyForm.jsx
│   ├── units/
│   │   └── UnitsList.jsx
│   ├── tenants/
│   │   └── TenantsList.jsx
│   ├── leases/
│   │   └── LeasesList.jsx
│   ├── billing/
│   │   └── BillingDashboard.jsx
│   ├── maintenance/
│   │   └── MaintenanceList.jsx
│   ├── staff/
│   │   └── StaffList.jsx
│   ├── reports/
│   │   └── ReportsDashboard.jsx
│   ├── communication/
│   │   └── Communication.jsx
│   ├── settings/
│   │   └── PropertySettings.jsx
│   ├── owner/
│   │   └── OwnerPortal.jsx
│   └── tenant-portal/
│       └── TenantPortal.jsx
└── components/property/
    └── PropertyLayout.jsx
```

## API Endpoints

### Properties
- `GET /api/v1/property/properties` - Get all properties
- `GET /api/v1/property/properties/stats` - Get dashboard stats
- `GET /api/v1/property/properties/:id` - Get property by ID
- `POST /api/v1/property/properties` - Create property
- `PUT /api/v1/property/properties/:id` - Update property
- `DELETE /api/v1/property/properties/:id` - Delete property

### Units
- `GET /api/v1/property/units` - Get all units
- `GET /api/v1/property/units?status=vacant` - Filter by status
- `GET /api/v1/property/units/:id` - Get unit by ID
- `POST /api/v1/property/units` - Create unit
- `POST /api/v1/property/units/bulk-import` - Bulk import units
- `PUT /api/v1/property/units/:id` - Update unit
- `DELETE /api/v1/property/units/:id` - Delete unit

### Tenants
- `GET /api/v1/property/tenants` - Get all tenants
- `GET /api/v1/property/tenants/:id` - Get tenant by ID
- `POST /api/v1/property/tenants` - Create tenant
- `PUT /api/v1/property/tenants/:id` - Update tenant
- `DELETE /api/v1/property/tenants/:id` - Delete tenant

### Leases
- `GET /api/v1/property/leases` - Get all leases
- `GET /api/v1/property/leases/:id` - Get lease by ID
- `POST /api/v1/property/leases` - Create lease
- `PUT /api/v1/property/leases/:id` - Update lease
- `DELETE /api/v1/property/leases/:id` - Delete lease

### Billing
- `GET /api/v1/property/billing` - Get all invoices
- `GET /api/v1/property/billing?status=pending` - Filter by status
- `GET /api/v1/property/billing/:id` - Get invoice by ID
- `POST /api/v1/property/billing` - Create invoice
- `PUT /api/v1/property/billing/:id` - Update invoice
- `DELETE /api/v1/property/billing/:id` - Delete invoice

### Maintenance
- `GET /api/v1/property/maintenance` - Get all tickets
- `GET /api/v1/property/maintenance?status=open` - Filter by status
- `GET /api/v1/property/maintenance/:id` - Get ticket by ID
- `POST /api/v1/property/maintenance` - Create ticket
- `PUT /api/v1/property/maintenance/:id` - Update ticket
- `DELETE /api/v1/property/maintenance/:id` - Delete ticket

### Staff
- `GET /api/v1/property/staff` - Get all staff
- `GET /api/v1/property/staff/:id` - Get staff by ID
- `POST /api/v1/property/staff` - Create staff
- `PUT /api/v1/property/staff/:id` - Update staff
- `DELETE /api/v1/property/staff/:id` - Delete staff

## Database Collections (Firebase)

### Collections Created
1. `properties` - Property information
2. `units` - Units/rooms/houses
3. `tenants` - Tenant profiles
4. `leases` - Lease agreements
5. `propertyBilling` - Invoices and payments
6. `maintenance` - Maintenance tickets
7. `propertyStaff` - Staff members

## Key Features

### Advanced Functionality
- **Real-time Updates**: Live data synchronization
- **Bulk Operations**: Import multiple units at once
- **Automated Billing**: Auto-generate rent invoices
- **Smart Notifications**: Payment reminders and alerts
- **Multi-currency Support**: Handle different currencies
- **Role-based Access**: Granular permissions
- **Audit Trail**: Complete activity logging
- **Mobile Responsive**: Works on all devices
- **Export Capabilities**: PDF and Excel reports

### Integration Points
- Integrates with existing Stock module for inventory
- Uses HR module for staff management
- Connects to Currency system for multi-currency
- Leverages existing authentication system

## Getting Started

### 1. Start Backend Server
```bash
cd backend
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Access Property Management
Navigate to: `http://localhost:5173/property`

## Usage Examples

### Create a Property
1. Go to `/property/properties`
2. Click "Add Property"
3. Fill in property details
4. Save

### Add Units
1. Go to `/property/units`
2. Click "Add Unit" or "Bulk Import"
3. Enter unit details
4. Assign to property

### Create Lease
1. Go to `/property/leases`
2. Click "Create Lease"
3. Select tenant and unit
4. Set dates and rent amount
5. Generate lease document

### Generate Invoice
1. Go to `/property/billing`
2. Click "Create Invoice"
3. Select tenant
4. Add line items (rent, utilities)
5. Send to tenant

### Submit Maintenance Request
1. Go to `/property/maintenance`
2. Click "Create Ticket"
3. Describe issue
4. Set priority
5. Assign technician

## Future Enhancements

- Mobile app for tenants
- Online payment gateway integration
- Automated lease renewals
- AI-powered maintenance scheduling
- Tenant screening integration
- Virtual property tours
- Smart home integration
- Predictive analytics

## Support

For issues or questions, refer to the main PROMANAGER documentation or contact the development team.

## License

Part of PROMANAGER system - All rights reserved
