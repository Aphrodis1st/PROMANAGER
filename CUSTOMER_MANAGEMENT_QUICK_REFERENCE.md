# Customer Management - Quick Reference Guide

## 🚀 Quick Start

### Access the Customer Management Page
```
URL: http://localhost:5173/stock/customers
```

### Required Roles
- ADMIN
- DIRECTOR_MANAGER
- SALE_MANAGER
- SALES
- ACCOUNTANT

### Required Departments
- Sales
- Finance

## 📋 Customer Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | Text | ✓ | Customer name |
| Email | Email | ✓ | Customer email |
| Phone | Text | ✓ | Customer phone |
| Address | Text | ✗ | Street address |
| City | Text | ✗ | City name |
| State | Text | ✗ | State/Province |
| Postal Code | Text | ✗ | ZIP code |
| Country | Text | ✗ | Country name |
| Tax ID | Text | ✗ | Tax ID number |
| Credit Limit | Number | ✗ | Credit limit amount |
| Payment Terms | Select | ✗ | Payment terms |
| Status | Select | ✗ | Active/Inactive/Suspended |
| Notes | Text | ✗ | Additional notes |

## 🎯 Common Tasks

### Create a New Customer
1. Click **"Add Customer"** button
2. Fill in required fields (Name, Email, Phone)
3. Fill in optional fields
4. Click **"Save Customer"**

### Edit a Customer
1. Click the **edit icon** (pencil) in the row
2. Modify the fields
3. Click **"Update Customer"**

### Delete a Customer
1. Click the **delete icon** (trash) in the row
2. Confirm deletion
3. Customer is removed

### Search Customers
1. Use the **search box** at the top
2. Type name, email, or phone
3. Results filter automatically

## 🔧 Form Controls

### Resizable Form
- **Width Slider**: Adjust form width (20-50%)
- **Height Slider**: Adjust form height (30-80vh)

### Payment Terms Options
- Net 30 (default)
- Net 60
- Net 90
- Due on Receipt
- 2/10 Net 30

### Status Options
- Active (default)
- Inactive
- Suspended

## 📊 Table Columns

| Column | Description |
|--------|-------------|
| Name | Customer name |
| Email | Email address |
| Phone | Phone number |
| City | City location |
| Credit Limit | Credit limit amount |
| Status | Active/Inactive/Suspended |
| Actions | Edit/Delete buttons |

## 🔐 Security Features

- ✓ Role-Based Access Control (RBAC)
- ✓ Department-based access
- ✓ Confirmation dialogs for deletions
- ✓ Secure API authentication
- ✓ Input validation

## 📱 Responsive Design

- ✓ Desktop (1920px+)
- ✓ Tablet (768px - 1024px)
- ✓ Mobile (320px - 767px)

## 🔗 Integration Points

### Sales Module
- Select customers when creating sales
- Track customer invoices
- Monitor customer payments

### Customer Invoices
- View invoices per customer
- Track payment status
- Generate reports

## 💾 Data Storage

- **Database**: Firestore
- **Collection**: `customers`
- **Auto-generated**: ID, createdAt, updatedAt

## 🎨 UI Features

- **Color-coded Status**: Green (Active), Gray (Inactive), Red (Suspended)
- **Hover Effects**: Smooth transitions on buttons
- **Icons**: Professional Material Design icons
- **Notifications**: Success/Error alerts
- **Loading States**: Visual feedback during operations

## 📞 API Endpoints

```
POST   /api/v1/stock/customer          - Create
GET    /api/v1/stock/customer          - Get all
GET    /api/v1/stock/customer/:id      - Get by ID
PUT    /api/v1/stock/customer/:id      - Update
DELETE /api/v1/stock/customer/:id      - Delete
```

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Cannot access page | Check role and department |
| Form won't submit | Fill all required fields |
| Search not working | Ensure data is loaded |
| Delete not working | Confirm deletion dialog |

## 🎓 Best Practices

1. **Always fill required fields** (Name, Email, Phone)
2. **Use consistent naming** for customer names
3. **Keep contact info updated** for communication
4. **Set appropriate credit limits** based on customer history
5. **Use notes** for special customer information
6. **Review status regularly** to keep data clean

## 📈 Performance Tips

- Search filters in real-time
- Lazy load customer data
- Responsive design optimized
- Minimal re-renders
- Efficient state management

## 🔄 Workflow Example

```
1. Create Customer
   ↓
2. Add to Sales
   ↓
3. Create Invoice
   ↓
4. Track Payment
   ↓
5. Update Status
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify your role and department
3. Check browser console for errors
4. Contact the development team

## 🎯 Next Steps

1. ✓ Access the customer page
2. ✓ Create your first customer
3. ✓ Test the search functionality
4. ✓ Create a sale with the customer
5. ✓ Track customer invoices

---

**Version**: 1.0  
**Last Updated**: 2025  
**Status**: Production Ready
