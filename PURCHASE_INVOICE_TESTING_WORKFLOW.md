# 🧪 Purchase Invoice System - Complete Testing Workflow

## Prerequisites
- ✅ Backend running on `localhost:3001`
- ✅ Frontend running on `localhost:3000`
- ✅ Firebase connection active
- ✅ Stock module access
- ✅ Products created in system
- ✅ Suppliers created or ability to add them

---

## 📍 Access Point
```
URL: http://localhost:3000/stock/purchases
Expected: Purchase Management page with form and empty table
```

---

## 🧪 TEST WORKFLOW 1: Create & Submit Invoice

### Step 1: Access Purchase Page
```
Action: Navigate to http://localhost:3000/stock/purchases
Expected Result:
  ✅ Page loads with "Create Purchase Invoice" form visible
  ✅ Form shows:
     - Supplier selector (dropdown)
     - "Add New" button for suppliers
     - Product selector (empty initially)
     - Quantity field (default: 1)
     - Unit Price field (default: 0)
     - Discount field (default: 0)
     - Tax field (default: 0)
     - Payment Type dropdown (default: "accrual")
  ✅ "Purchases History" table shown below (empty if first time)
  ✅ No console errors
```

### Step 2: Select Supplier (If exists)
```
Action: Click Supplier dropdown
Expected Result:
  ✅ Dropdown opens
  ✅ All suppliers listed
  ✅ Select first supplier
Expected UI Update:
  ✅ Supplier name appears in dropdown
  ✅ Form remains visible
  ✅ Ready for next input
```

### Step 3: Add Supplier (If none exists)
```
Action: Click "Add New" button under Supplier
Expected Result:
  ✅ AddSupplierForm appears below
  ✅ Form shows fields:
     - Supplier Name (required)
     - Company Name
     - Email
     - Location
     - Contact (+250...)
     - TIN (999999999)

Action: Fill in supplier details
Fields:
  Name: "Test Supplier"
  Company: "Test Company Ltd"
  Email: "supplier@test.com"
  Location: "Kigali"
  Contact: "+250 789 123 456"
  TIN: "100001001"

Action: Click "Add Supplier" button
Expected Result:
  ✅ Supplier added to Firebase
  ✅ Dropdown updates with new supplier
  ✅ New supplier selected automatically
  ✅ Form hides
  ✅ Form ready for product selection
```

### Step 4: Select Product
```
Action: Click Product dropdown
Expected Result:
  ✅ Dropdown opens
  ✅ All products from ProductSettings listed
  ✅ Each product shows name

Action: Select first product
Expected Result:
  ✅ Product name appears in dropdown
  ✅ Form auto-fills:
     - productName: from selected product
     - tax: from product settings
     - storeCategory: from product settings
  ✅ Total price recalculates to 0 (price field empty)
  ✅ Form ready for quantity input
```

### Step 5: Enter Quantity & Price
```
Action: Click Quantity field, clear and enter: 10
Expected Result:
  ✅ Quantity updates to 10
  ✅ Total price recalculates
  ✅ Console shows calculation

Action: Click Unit Price field, clear and enter: 500
Expected Result:
  ✅ Unit Price updates to 500
  ✅ Total price recalculates to 5,000 (10 × 500)
  ✅ Amount displayed with currency format
  ✅ Form shows: "Total: 5,000 RWF" (or configured currency)
```

### Step 6: Add Optional Discount
```
Action: Enter Discount: 500 (absolute or percentage)
Expected Result:
  ✅ Discount accepted
  ✅ Total price recalculates
  ✅ If discount > 1: treated as absolute (5,000 - 500 = 4,500)
  ✅ If discount ≤ 1: treated as percentage (5,000 × 0.1% = 5)
  ✅ Display shows new total
```

### Step 7: Add Optional Tax
```
Action: Enter Tax: 200
Expected Result:
  ✅ Tax accepted
  ✅ Total price recalculates
  ✅ Final total shows: (5,000 - discount) + 200
  ✅ Amount displayed: "Total: 4,700 RWF"
  ✅ Ready to add to invoice
```

### Step 8: Add Item to Invoice
```
Action: Click "Add to Invoice" button
Expected Result:
  ✅ Item added to draft table
  ✅ Draft Items section appears/updates
  ✅ Table shows:
     Header: Product | Qty | Unit Price | Total | Action
     Row: "Product Name" | "10" | "500 RWF" | "4,700 RWF" | ✕
  ✅ Invoice total displayed: "Total: 4,700 RWF"
  ✅ Form resets:
     - Product dropdown: empty
     - Quantity: 1
     - Price: 0
     - Discount: 0
     - Tax: 0
  ✅ Ready to add more items (optional)
```

### Step 9: Add More Items (Optional)
```
Action: Repeat Steps 4-8 with different product
Expected Result:
  ✅ Second item added to draft table
  ✅ Table shows both items
  ✅ Total amount sums both: "Total: 10,200 RWF" (example)
  ✅ Can add unlimited items
```

### Step 10: Remove Draft Item (Optional)
```
Action: Click ✕ button on any draft item
Expected Result:
  ✅ Item removed from draft table
  ✅ Total amount recalculates
  ✅ If all items removed, draft table disappears
  ✅ Form remains ready for new items
```

### Step 11: Submit Invoice
```
Action: Click "Submit Invoice" button
Expected Result:
  ✅ Button shows "Submitting..." (disabled)
  ✅ All buttons disabled (loading state)
  ✅ Processing animation (if present)
  
After 1-2 seconds:
  ✅ Success message: "Invoice created successfully!"
  ✅ Form hides automatically
  ✅ "Create Purchase Invoice" button appears
  ✅ Switch to table view
  ✅ Invoice appears in "Purchases History" table
```

### Step 12: Verify Invoice in Table
```
Expected Table Display:
  ✅ New row with:
     - Invoice: "#<ID>" with today's date
     - Supplier: "Test Supplier" (+250 789...)
     - Products: "Product Name (Qty: 10)"
     - Total: "4,700 RWF" (formatted amount)
     - Payment Type: "Accrual" (chip/badge)
     - Status: "Pending" (gray badge)
     - Actions: [✓ Approve] [✗ Reject] [🗑 Delete]
  ✅ No console errors
  ✅ Table responsive and readable
```

---

## 🧪 TEST WORKFLOW 2: Approve Invoice

### Step 1: Locate Pending Invoice
```
Action: Look at Purchases History table
Expected: Find row with Status: "Pending" (gray)
```

### Step 2: Click Approve Button
```
Action: Click "Approve" button on Pending invoice
Expected Result:
  ✅ Button disabled immediately
  ✅ Loading state visible
  ✅ No console errors
  
After 1-2 seconds:
  ✅ Success message: "Invoice approved successfully!"
  ✅ Status badge changes from "Pending" → "Approved"
  ✅ Status color changes: Gray → Blue
  ✅ Action buttons update
```

### Step 3: Verify Status Change
```
Expected Table Update:
  ✅ Same invoice row, but:
     - Status: "Approved" (blue badge)
     - Approve button disappears
     - New button appears: "Confirm Payment" (green outline)
     - Reject button still present (red outline)
     - Delete button gone
```

### Step 4: Verify Data Persistence
```
Action: Refresh page (F5)
Expected Result:
  ✅ Table reloads
  ✅ Approved invoice still shows "Approved" status
  ✅ Buttons correct for approved state
  ✅ No data loss
```

---

## 🧪 TEST WORKFLOW 3: Confirm Payment

### Step 1: Locate Approved Invoice
```
Action: Look at table for Status: "Approved" (blue)
Expected: Find row with "Confirm Payment" button
```

### Step 2: Click Confirm Payment Button
```
Action: Click "Confirm Payment" button
Expected Result:
  ✅ Button disabled immediately
  ✅ Loading state visible
  
After 1-2 seconds:
  ✅ Success message: "Payment confirmed successfully!"
  ✅ Status badge changes: "Approved" → "Paid"
  ✅ Status color changes: Blue → Green
  ✅ Action buttons disappear (final state)
```

### Step 3: Verify Final State
```
Expected Table Update:
  ✅ Same invoice row, but:
     - Status: "Paid" (green badge)
     - ALL action buttons gone
     - Row locked (no more modifications)
     - Delete button NOT present (can't modify paid invoices)
```

### Step 4: Verify No Actions Available
```
Action: Try to interact with paid invoice row
Expected: No clickable action buttons
Status: LOCKED ✔️
```

---

## 🧪 TEST WORKFLOW 4: Reject Invoice

### Scenario A: Reject Pending Invoice
```
Step 1: Create and submit a new invoice (follow Workflow 1)
Result: Invoice with "Pending" status

Step 2: Click "Reject" button on pending invoice
Expected: Confirmation dialog appears
Message: "Are you sure you want to reject this invoice?"
Buttons: [OK] [Cancel]

Step 3: Click "OK" to confirm rejection
Expected Result:
  ✅ Loading state during API call
  ✅ After 1-2 seconds, success message
  ✅ Status changes: "Pending" → "Rejected"
  ✅ Status color: Gray → Red
  ✅ All buttons disappear (final state)

Step 4: Verify Rejected State
  ✅ Status badge: "Rejected" (red)
  ✅ No action buttons
  ✅ Invoice locked
```

### Scenario B: Reject Approved Invoice
```
Step 1: Find or create "Approved" invoice
Result: Invoice with "Approved" status, "Confirm Payment" button visible

Step 2: Click "Reject" button
Expected: Confirmation dialog
Message: "Are you sure you want to reject this invoice?"

Step 3: Click "OK" to confirm
Expected Result:
  ✅ Status changes: "Approved" → "Rejected"
  ✅ Status color: Blue → Red
  ✅ All buttons disappear
  ✅ Invoice locked from further changes
```

### Scenario C: Cancel Rejection
```
Step 1: Find Pending or Approved invoice
Step 2: Click "Reject" button
Step 3: See confirmation dialog
Step 4: Click "Cancel" button
Expected Result:
  ✅ Dialog closes
  ✅ No status change
  ✅ Buttons remain as before
  ✅ Invoice unchanged
```

---

## 🧪 TEST WORKFLOW 5: Delete Invoice

### Step 1: Create Invoice
```
Action: Create and submit new invoice (Workflow 1)
Result: Invoice in table with "Pending" status
```

### Step 2: Click Delete Button
```
Action: Click 🗑️ (delete icon) on the invoice
Expected: Confirmation dialog
Message: "Delete this purchase?"
Buttons: [OK] [Cancel]
```

### Step 3: Confirm Deletion
```
Action: Click "OK" to confirm
Expected Result:
  ✅ Loading state
  ✅ After 1-2 seconds: "Purchase deleted successfully"
  ✅ Invoice row disappears from table
  ✅ Table updates in real-time
```

### Step 4: Verify Deletion
```
Expected: Invoice no longer appears in table
Action: Refresh page
Expected: Invoice remains deleted (persisted)
```

### Step 5: Attempt Delete on Paid Invoice
```
Setup: Find a "Paid" status invoice
Expected: No delete button present
Action: Cannot delete paid invoices (final protection)
Status: ✅ PROTECTED
```

---

## 🧪 TEST WORKFLOW 6: Multiple Invoices

### Step 1: Create 3 Different Invoices
```
Invoice 1: Supplier A, Product 1, Status: Pending
Invoice 2: Supplier B, Product 2, Status: Approved
Invoice 3: Supplier C, Product 3, Status: Paid
```

### Step 2: Verify Table Display
```
Expected:
  ✅ All 3 invoices show in table
  ✅ Different suppliers displayed
  ✅ Different statuses color-coded
  ✅ Correct buttons for each status
  ✅ Table sorts/displays correctly
```

### Step 3: Test Table Interactions
```
Action: Approve Invoice 1
Expected: Status updates, buttons change

Action: Confirm Payment on Invoice 2
Expected: Status updates to Paid, locked

Action: Reject Invoice 1
Expected: Status updates to Rejected, locked

Result: All 3 invoices in different final states
```

---

## 🧪 TEST WORKFLOW 7: Error Handling

### Test 1: Missing Required Fields
```
Action: Click "Add to Invoice" without selecting product
Expected: Alert message: "Please select product"
Result: Item not added ✅

Action: Click "Add to Invoice" without selecting supplier
Expected: Alert message: "Please select supplier"
Result: Item not added ✅
```

### Test 2: Submit Empty Invoice
```
Action: Click "Submit Invoice" with no items
Expected: Alert message: "Add products first"
Result: No API call made ✅
```

### Test 3: Invalid Numbers
```
Action: Enter negative quantity
Expected: Field accepts but total shows correctly
Result: Calculation accurate ✅

Action: Enter invalid price (text)
Expected: Field rejects or treats as 0
Result: No NaN in display ✅
```

### Test 4: API Errors
```
If backend returns error:
Expected: User-friendly message
Message: "Failed to approve invoice"
Result: No technical errors shown ✅
```

---

## 🧪 TEST WORKFLOW 8: Currency & Formatting

### Step 1: Verify Currency Display
```
Action: Create invoice with amount: 1500
Expected Display: "1,500 RWF" (or configured currency)
Format: ✅ Proper thousands separator
Result: Amount formatted correctly
```

### Step 2: Verify Date Formatting
```
Action: Check invoice date column
Expected: "06 Aug" (short format)
Result: Consistent date formatting ✅
```

### Step 3: Verify Calculation Display
```
Action: Create invoice:
  - Quantity: 5
  - Price: 2000
  - Discount: 500
  - Tax: 100
Expected: Total = (5 × 2000) - 500 + 100 = 9,600 RWF
Result: Calculation correct ✅
```

---

## 🧪 TEST WORKFLOW 9: Mobile Responsiveness

### Step 1: Test on Mobile View
```
Action: Open on phone or use F12 responsive design
Expected:
  ✅ Form fields stack vertically
  ✅ Buttons full width or properly sized
  ✅ Table scrolls horizontally if needed
  ✅ All text readable
  ✅ No layout breaks
```

### Step 2: Test Table Scroll
```
Action: View table on small screen
Expected:
  ✅ Horizontal scroll available
  ✅ All columns visible when scrolling
  ✅ Sticky header (if implemented)
  ✅ Good readability
```

---

## ✅ Test Summary Checklist

- [ ] CREATE: Invoice form works
- [ ] CREATE: Calculations correct
- [ ] CREATE: Submit successful
- [ ] SUBMIT: Invoice appears in table
- [ ] SUBMIT: Status shows "Pending"
- [ ] APPROVE: Status changes to "Approved"
- [ ] APPROVE: Buttons update correctly
- [ ] PAYMENT: Status changes to "Paid"
- [ ] PAYMENT: Buttons disappear (locked)
- [ ] REJECT: Confirmation dialog works
- [ ] REJECT: Status changes to "Rejected"
- [ ] DELETE: Confirmation dialog works
- [ ] DELETE: Invoice removed from table
- [ ] ERROR: Messages display correctly
- [ ] PERSISTENCE: Refresh maintains data
- [ ] MULTI: Multiple invoices work
- [ ] CURRENCY: Amounts formatted
- [ ] MOBILE: Responsive design works
- [ ] BUTTONS: Context-correct display
- [ ] PERFORMANCE: No lag or delays

---

## 🎯 Expected Success Criteria

All tests passing ✅
```
✅ Create invoice - WORKING
✅ Submit to table - WORKING
✅ Approve invoice - WORKING
✅ Confirm payment - WORKING
✅ Reject invoice - WORKING
✅ Delete invoice - WORKING
✅ Error handling - WORKING
✅ Data persistence - WORKING
✅ UI/UX responsive - WORKING
✅ Currency formatting - WORKING
```

---

## 📞 If Tests Fail

1. Check browser console (F12 → Console tab)
2. Check network tab for API errors
3. Verify backend is running
4. Check Firebase connection
5. Review error messages
6. Try clearing browser cache
7. Refresh page and retry

---

**Test Date**: August 6, 2026
**Status**: Ready for QA
**Version**: 1.0 Complete
