# Property Management - Quick Start Guide

## 🚀 Quick Access

### Main Dashboard
```
URL: http://localhost:5173/property
```

### Key Pages
| Feature | URL | Description |
|---------|-----|-------------|
| Dashboard | `/property` | Overview of all properties |
| Properties | `/property/properties` | Manage properties |
| Units | `/property/units` | Manage units/rooms |
| Tenants | `/property/tenants` | Manage tenants |
| Leases | `/property/leases` | Manage lease agreements |
| Billing | `/property/billing` | Invoices & payments |
| Maintenance | `/property/maintenance` | Work orders & tickets |
| Staff | `/property/staff` | Staff management |
| Reports | `/property/reports` | Analytics & reports |
| Communication | `/property/communication` | Send messages |
| Settings | `/property/settings` | System configuration |
| Owner Portal | `/property/owner-portal` | For property owners |
| Tenant Portal | `/property/tenant-portal` | For tenants |

## 📋 Common Workflows

### 1. Add New Property
```
1. Navigate to /property/properties
2. Click "Add Property"
3. Fill in:
   - Property Name
   - Address
   - Type (Apartment/House/Commercial)
   - Total Units
   - Amenities
4. Click "Save"
```

### 2. Add Units to Property
```
1. Navigate to /property/units
2. Click "Add Unit" OR "Bulk Import"
3. Fill in:
   - Unit Number
   - Property
   - Rent Price
   - Size
   - Status (Vacant/Occupied/Maintenance)
4. Click "Save"
```

### 3. Register New Tenant
```
1. Navigate to /property/tenants
2. Click "Add Tenant"
3. Fill in:
   - Personal Information
   - Contact Details
   - Unit Assignment
   - Documents (ID, etc.)
4. Click "Save"
```

### 4. Create Lease Agreement
```
1. Navigate to /property/leases
2. Click "Create Lease"
3. Select:
   - Tenant
   - Unit
   - Start Date
   - End Date
   - Rent Amount
   - Payment Terms
4. Generate & Sign
```

### 5. Generate Invoice
```
1. Navigate to /property/billing
2. Click "Create Invoice"
3. Select Tenant
4. Add Items:
   - Rent
   - Utilities (Water, Electricity)
   - Other Charges
5. Set Due Date
6. Send to Tenant
```

### 6. Create Maintenance Ticket
```
1. Navigate to /property/maintenance
2. Click "Create Ticket"
3. Fill in:
   - Property & Unit
   - Issue Description
   - Priority (Low/Medium/High/Urgent)
   - Assign Technician
4. Submit
```

## 🎯 Dashboard Widgets

### Key Metrics Displayed
- **Total Properties**: Count of all properties
- **Total Units**: Count of all units/rooms
- **Occupancy Rate**: Percentage of occupied units
- **Rent Collected**: Total rent collected this month
- **Pending Payments**: Outstanding payment amount
- **Open Tickets**: Active maintenance requests
- **Expiring Leases**: Leases ending soon
- **Staff on Duty**: Active staff members

## 🔧 API Quick Reference

### Base URL
```
http://localhost:3001/api/v1/property
```

### Endpoints
```javascript
// Properties
GET    /properties          // List all
GET    /properties/stats    // Dashboard stats
GET    /properties/:id      // Get one
POST   /properties          // Create
PUT    /properties/:id      // Update
DELETE /properties/:id      // Delete

// Units
GET    /units               // List all
GET    /units?status=vacant // Filter by status
POST   /units               // Create
POST   /units/bulk-import   // Bulk import
PUT    /units/:id           // Update
DELETE /units/:id           // Delete

// Tenants
GET    /tenants             // List all
POST   /tenants             // Create
PUT    /tenants/:id         // Update
DELETE /tenants/:id         // Delete

// Leases
GET    /leases              // List all
POST   /leases              // Create
PUT    /leases/:id          // Update
DELETE /leases/:id          // Delete

// Billing
GET    /billing             // List all invoices
GET    /billing?status=pending // Filter
POST   /billing             // Create invoice
PUT    /billing/:id         // Update
DELETE /billing/:id         // Delete

// Maintenance
GET    /maintenance         // List all tickets
GET    /maintenance?status=open // Filter
POST   /maintenance         // Create ticket
PUT    /maintenance/:id     // Update
DELETE /maintenance/:id     // Delete

// Staff
GET    /staff               // List all
POST   /staff               // Create
PUT    /staff/:id           // Update
DELETE /staff/:id           // Delete
```

## 📊 Status Values

### Unit Status
- `vacant` - Available for rent
- `occupied` - Currently rented
- `maintenance` - Under repair
- `reserved` - Reserved for tenant

### Lease Status
- `active` - Currently active
- `expired` - Lease ended
- `terminated` - Ended early
- `pending` - Not yet started

### Invoice Status
- `pending` - Awaiting payment
- `paid` - Payment received
- `overdue` - Past due date
- `cancelled` - Cancelled

### Maintenance Status
- `open` - New ticket
- `in-progress` - Being worked on
- `completed` - Finished
- `cancelled` - Cancelled

### Priority Levels
- `low` - Can wait
- `medium` - Normal priority
- `high` - Important
- `urgent` - Immediate attention

## 💡 Tips & Best Practices

### Property Management
1. Always add properties before units
2. Keep property documents updated
3. Regular property inspections
4. Maintain accurate amenity lists

### Unit Management
1. Use bulk import for multiple units
2. Update status immediately on changes
3. Track meter readings monthly
4. Keep unit photos current

### Tenant Management
1. Verify all documents before lease
2. Maintain emergency contacts
3. Regular communication
4. Track payment history

### Billing
1. Generate invoices on time
2. Send payment reminders
3. Apply late fees consistently
4. Keep detailed payment records

### Maintenance
1. Prioritize urgent issues
2. Assign qualified technicians
3. Track costs accurately
4. Take before/after photos
5. Schedule preventive maintenance

## 🔐 Security & Permissions

### Role-Based Access
- **Admin**: Full access to all features
- **Property Manager**: Manage properties and tenants
- **Accountant**: Access to billing and reports
- **Maintenance Staff**: Access to tickets only
- **Owner**: View their properties only
- **Tenant**: Access to tenant portal only

## 📱 Mobile Access

All pages are mobile-responsive and work on:
- Desktop computers
- Tablets
- Smartphones

## 🆘 Troubleshooting

### Common Issues

**Can't see properties?**
- Check if backend server is running
- Verify API endpoint is correct
- Check browser console for errors

**Invoice not generating?**
- Ensure tenant is selected
- Check all required fields
- Verify due date is valid

**Maintenance ticket not saving?**
- Fill all required fields
- Check property and unit selection
- Verify technician assignment

## 📞 Support

For technical support:
1. Check main documentation
2. Review error logs
3. Contact development team

## 🎓 Training Resources

- Video tutorials (coming soon)
- User manual (see PROPERTY_MANAGEMENT_SYSTEM.md)
- API documentation
- Sample data for testing

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Part of**: PROMANAGER System
