# Purchase Invoice Management System - Complete Implementation

## Overview
The purchase invoice management system at `http://localhost:3000/stock/purchases` now includes complete functionality for:
- ✅ Create purchase invoices
- ✅ Submit invoices
- ✅ Approve invoices
- ✅ Confirm payment
- ✅ Reject invoices

## Features Implemented

### 1. Create Purchase Invoice
**Path**: `/stock/purchases`

**Steps**:
1. Click "Create Purchase Invoice" button
2. Select or add a supplier
3. Add products to the invoice:
   - Select product
   - Enter quantity
   - Enter unit price
   - Add discount (optional)
   - Add tax (optional)
   - Select payment type (Accrual/Cash/Credit)
4. Click "Add to Invoice" to add items
5. Review items in draft table
6. Click "Submit Invoice" to save

**Data Flow**:
- Form → Invoice creation in Firebase
- Creates supplier invoice document
- Creates purchase records linked to invoice
- Updates purchase status to "pending"

### 2. Invoice Status Management in Table
**Columns**:
- Invoice ID with date
- Supplier name and contact
- Product details and quantity
- Total amount (formatted with currency)
- Payment type (Accrual/Cash/Credit)
- Status badge (Pending/Approved/Paid/Rejected)
- Action buttons

### 3. Invoice Approval Workflow
**Pending Status** → Actions Available:
- **Approve Button**: Changes status to "approved"
- **Reject Button**: Changes status to "rejected"

**Approved Status** → Actions Available:
- **Confirm Payment Button**: Changes status to "paid"
- **Reject Button**: Changes status to "rejected"

**Paid Status** → No Actions (Final state)
**Rejected Status** → No Actions (Final state)

## API Endpoints Used

### Supplier Management
```
GET    /api/v1/stock/supplier                - Get all suppliers
POST   /api/v1/stock/supplier                - Create supplier
PUT    /api/v1/stock/supplier/{id}           - Update supplier
DELETE /api/v1/stock/supplier/{id}           - Delete supplier
```

### Supplier Invoice Management
```
GET    /api/v1/stock/supplier-invoices       - Get all invoices
POST   /api/v1/stock/supplier-invoices       - Create invoice
GET    /api/v1/stock/supplier-invoices/{id}  - Get invoice details
PUT    /api/v1/stock/supplier-invoices/{id}  - Update invoice status
DELETE /api/v1/stock/supplier-invoices/{id}  - Delete invoice
```

### Purchase Management
```
GET    /api/v1/stock/purchase                - Get all purchases
POST   /api/v1/stock/purchase                - Create purchase
PUT    /api/v1/stock/purchase/{id}           - Update purchase
DELETE /api/v1/stock/purchase/{id}           - Delete purchase
```

## Database Structure

### Supplier Invoice Document
```typescript
{
  id: string;
  supplierId: string;
  totalAmount: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
    total: number;
    inventoryAccountId?: string;
    storeCategory?: string;
  }>;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  paymentType: 'accrual' | 'cash' | 'credit';
  date: ISO8601 timestamp;
  createdAt: ISO8601 timestamp;
  updatedAt: ISO8601 timestamp;
}
```

### Purchase Record
```typescript
{
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplierId: string;
  invoiceId: string;
  invoiceStatus: 'pending' | 'approved' | 'paid' | 'rejected';
  paymentType: 'accrual' | 'cash' | 'credit';
  inventoryAccountId: string;
  date: ISO8601 timestamp;
  createdAt: ISO8601 timestamp;
}
```

## Frontend Components

### PurchasesPage (Main Component)
**Location**: `/src/views/stock/PurchasesPage.jsx`

**Features**:
- Invoice creation form with dynamic calculation
- Supplier management (add/select)
- Product selection with auto-fill of tax
- Real-time total calculation
- Draft invoice preview
- Purchase history table
- Status-based action buttons
- Loading states for all operations
- Error handling with user feedback

### Key Functions

#### `submitInvoice()`
- Validates invoice items
- Calculates total amount
- Creates supplier invoice
- Creates purchase records for each item
- Updates UI with new records
- Shows success/error messages

#### `approveInvoiceHandler(invoiceId)`
- Updates invoice status to "approved"
- Updates all related purchase records
- Shows confirmation message

#### `confirmPaymentHandler(invoiceId)`
- Updates invoice status to "paid"
- Updates all related purchase records
- Shows confirmation message

#### `rejectInvoiceHandler(invoiceId)`
- Updates invoice status to "rejected"
- Asks for confirmation
- Updates all related purchase records
- Shows confirmation message

#### `deletePurchase(id)`
- Deletes purchase record
- Asks for confirmation
- Updates UI

## Context Management

### PurchaseContext
**Location**: `/src/context/PurchaseContext.tsx`

**Provides**:
- `purchases`: Array of purchase records
- `suppliers`: Array of suppliers
- `invoices`: Array of supplier invoices
- `addSupplier()`: Create new supplier
- `addInvoice()`: Create new invoice
- `updateInvoice()`: Update invoice status
- `addPurchase()`: Create purchase record
- `setPurchases()`: Manual purchase update

**Initialization**:
- Loads suppliers on mount
- Loads invoices on mount
- Maintains state synchronization

## Testing Checklist

### 1. Create Invoice ✅
- [ ] Navigate to /stock/purchases
- [ ] Click "Create Purchase Invoice"
- [ ] Add/Select supplier
- [ ] Select product
- [ ] Enter quantity and price
- [ ] Click "Add to Invoice"
- [ ] Verify item appears in draft table
- [ ] Click "Submit Invoice"
- [ ] Verify invoice appears in history table with "Pending" status

### 2. Approve Invoice ✅
- [ ] In history table, find "Pending" invoice
- [ ] Click "Approve" button
- [ ] Verify status changes to "Approved"
- [ ] Verify button changes to "Confirm Payment"

### 3. Confirm Payment ✅
- [ ] Find "Approved" invoice
- [ ] Click "Confirm Payment" button
- [ ] Verify status changes to "Paid"
- [ ] Verify no more action buttons appear

### 4. Reject Invoice ✅
- [ ] Find "Pending" or "Approved" invoice
- [ ] Click "Reject" button
- [ ] Confirm rejection
- [ ] Verify status changes to "Rejected"
- [ ] Verify no more action buttons appear

### 5. Delete Purchase ✅
- [ ] Find any invoice (except Paid/Rejected)
- [ ] Click delete icon
- [ ] Confirm deletion
- [ ] Verify invoice disappears from table

### 6. Supplier Management ✅
- [ ] Click "Add New" button for supplier
- [ ] Fill in supplier details
- [ ] Click "Add Supplier"
- [ ] Verify supplier appears in dropdown
- [ ] Select supplier for invoice

## Error Handling

### Frontend Error Messages
- "Invoice ID is required" - Missing invoice ID
- "Add products first" - Empty invoice items
- "Please select product" - No product selected
- "Please select supplier" - No supplier selected
- "Failed to create invoice: [error]" - Invoice creation failed
- "Failed to approve invoice" - Approval failed
- "Failed to confirm payment" - Payment confirmation failed
- "Failed to reject invoice" - Rejection failed
- "Failed to delete purchase" - Deletion failed

### Backend Error Handling
- 404: Invoice/Purchase not found
- 500: Server error with detailed message
- All errors logged to console

## Data Calculations

### Total Price Calculation
```javascript
const calculateTotalPrice = ({ quantity, unitPrice, discount, tax }) => {
  const subtotal = quantity * unitPrice;
  const discountAmount = discount > 1 ? discount : subtotal * (discount / 100);
  const taxAmount = tax > 1 ? tax : subtotal * (tax / 100);
  return subtotal - discountAmount + taxAmount;
};
```

## UI Features

### Status Badge Colors
- **Pending**: Default (gray)
- **Approved**: Info (blue)
- **Paid**: Success (green)
- **Rejected**: Error (red)

### Responsive Design
- Full width on mobile
- Horizontal scroll on small tables
- Grid layout for form fields
- Touch-friendly buttons

### Real-time Updates
- Total calculation on field change
- Currency display formatting
- Status updates without page reload
- Loading states during operations

## Security Considerations

- Token-based authentication for API calls
- Authorization headers on all requests
- Validation on frontend and backend
- Confirmation dialogs for critical actions
- Error messages don't expose sensitive data

## Performance Optimizations

- Lazy loading of data
- Minimal re-renders with proper state management
- Currency formatting hook
- Efficient table rendering
- Async/await error handling

## Integration Points

### StockContext Integration
- Product settings for dropdown
- Account settings for inventory accounts
- Currency formatting

### PaymentContext Integration
- Payment status tracking (if needed)
- Payment method management

## Future Enhancements

- [ ] Invoice PDF generation/download
- [ ] Bulk approval/rejection
- [ ] Invoice filtering and search
- [ ] Partial payment tracking
- [ ] Audit trail/history
- [ ] Email notifications
- [ ] Invoice templating
- [ ] Multi-currency support

## Troubleshooting

### Invoices Not Appearing
1. Check browser console for errors
2. Verify backend is running (`localhost:3001`)
3. Check Firebase connectivity
4. Verify user has authentication token

### Actions Not Working
1. Refresh page
2. Check network tab in DevTools
3. Verify API endpoint is correct
4. Check backend logs

### Status Not Updating
1. Manually refresh page
2. Check for duplicate invoices
3. Verify invoice ID is correct
4. Check backend update method

## Support

For issues or questions:
1. Check console logs
2. Verify backend is running
3. Check network requests in DevTools
4. Review backend logs at `/stock/purchases` route
