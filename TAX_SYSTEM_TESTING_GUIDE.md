# Tax Management System - Testing Guide

## 🧪 Testing Checklist

### Prerequisites
- ✅ Backend server running on port 3001
- ✅ Frontend server running on port 5173
- ✅ Firebase configured and connected
- ✅ Stock user logged in with appropriate role (ADMIN/ACCOUNTANT)

---

## 1️⃣ Tax Configuration Testing

### Test 1.1: Create VAT Tax
**Steps:**
1. Navigate to `/stock/tax-settings`
2. Click "Add Tax" button
3. Fill in form:
   - Tax Name: "Standard VAT"
   - Tax Code: "VAT-18"
   - Tax Type: "VAT"
   - Calculation Type: "Percentage"
   - Rate: 18
   - Price Type: "Exclusive"
   - Applies To: "All"
   - Status: Active (checked)
4. Click "Save"

**Expected Result:**
- ✅ Tax appears in the table
- ✅ Shows 18% in Rate column
- ✅ Shows "Active" status
- ✅ Shows "Exclusive" price type

### Test 1.2: Create Excise Duty
**Steps:**
1. Click "Add Tax"
2. Fill in form:
   - Tax Name: "Alcohol Excise"
   - Tax Code: "EXC-10"
   - Tax Type: "Excise"
   - Calculation Type: "Percentage"
   - Rate: 10
   - Price Type: "Exclusive"
   - Applies To: "Category"
3. Click "Save"

**Expected Result:**
- ✅ Tax appears in the table
- ✅ Shows 10% in Rate column

### Test 1.3: Create Fixed Tax
**Steps:**
1. Click "Add Tax"
2. Fill in form:
   - Tax Name: "Environmental Levy"
   - Tax Code: "ENV-5"
   - Tax Type: "Sales Tax"
   - Calculation Type: "Fixed"
   - Fixed Amount: 5
   - Price Type: "Exclusive"
3. Click "Save"

**Expected Result:**
- ✅ Tax appears in the table
- ✅ Shows "$5" in Rate column

### Test 1.4: Edit Tax
**Steps:**
1. Click edit icon on any tax
2. Change rate from 18 to 16
3. Click "Save"

**Expected Result:**
- ✅ Tax updated in table
- ✅ Shows new rate

### Test 1.5: Deactivate Tax
**Steps:**
1. Click edit icon on any tax
2. Toggle "Active" switch to off
3. Click "Save"

**Expected Result:**
- ✅ Status shows "Inactive"
- ✅ Tax still visible in list

### Test 1.6: Delete Tax
**Steps:**
1. Click delete icon on any tax
2. Confirm deletion

**Expected Result:**
- ✅ Tax removed from table
- ✅ Confirmation message shown

---

## 2️⃣ Tax Group Testing

### Test 2.1: Create Tax Group
**Steps:**
1. Switch to "Tax Groups" tab
2. Click "Add Tax Group"
3. Fill in form:
   - Group Name: "Alcohol Taxes"
   - Group Code: "ALC-TAX"
   - Select Taxes: VAT + Excise
   - Description: "Combined taxes for alcohol"
4. Click "Save"

**Expected Result:**
- ✅ Tax group appears in table
- ✅ Shows "2 taxes" in Taxes column

### Test 2.2: Edit Tax Group
**Steps:**
1. Click edit icon on tax group
2. Add another tax to the group
3. Click "Save"

**Expected Result:**
- ✅ Shows "3 taxes" in Taxes column

### Test 2.3: Delete Tax Group
**Steps:**
1. Click delete icon on tax group
2. Confirm deletion

**Expected Result:**
- ✅ Tax group removed from table

---

## 3️⃣ Product Tax Assignment Testing

### Test 3.1: Assign Tax to Product
**Steps:**
1. Navigate to `/stock/product-settings`
2. Edit any product
3. In "Pricing & Defaults" section:
   - Set Tax: 18
4. Click "Save"

**Expected Result:**
- ✅ Product saved with tax
- ✅ Tax will apply on sales

### Test 3.2: Mark Product as Tax Exempt
**Steps:**
1. Edit a product
2. Check "Tax Exempt" checkbox
3. Click "Save"

**Expected Result:**
- ✅ Product marked as exempt
- ✅ No tax on sales of this product

---

## 4️⃣ Tax Transaction Recording Testing

### Test 4.1: Create Sale with Tax
**Steps:**
1. Navigate to `/stock/sales`
2. Create a new sale:
   - Product: Select product with tax
   - Quantity: 1
   - Price: $100
3. Save sale

**Expected Result:**
- ✅ Sale created
- ✅ Tax transaction recorded automatically
- ✅ Check tax reports to verify

### Test 4.2: Create Purchase with Tax
**Steps:**
1. Navigate to `/stock/purchases`
2. Create a new purchase:
   - Product: Select product with tax
   - Quantity: 1
   - Price: $100
3. Save purchase

**Expected Result:**
- ✅ Purchase created
- ✅ Tax transaction recorded automatically

---

## 5️⃣ Tax Reports Testing

### Test 5.1: View Tax Transactions
**Steps:**
1. Navigate to `/stock/tax-reports`
2. Ensure "Tax Transactions" tab is active
3. Set date range to current month
4. Click "Apply Filters"

**Expected Result:**
- ✅ Shows list of all tax transactions
- ✅ Summary cards show totals
- ✅ Table shows transaction details

### Test 5.2: Filter by Tax Type
**Steps:**
1. In Tax Reports page
2. Select Tax Type: "VAT"
3. Click "Apply Filters"

**Expected Result:**
- ✅ Shows only VAT transactions
- ✅ Summary cards update

### Test 5.3: View Tax Summary
**Steps:**
1. Switch to "Tax Summary" tab
2. Set date range
3. Click "Apply Filters"

**Expected Result:**
- ✅ Shows aggregated data by tax type
- ✅ Shows transaction count
- ✅ Shows total taxable amount
- ✅ Shows total tax amount
- ✅ Shows grand totals at bottom

### Test 5.4: Export Report
**Steps:**
1. In Tax Reports page
2. Click "Export" button

**Expected Result:**
- ✅ CSV file downloads
- ✅ File contains all visible data
- ✅ Can open in Excel

### Test 5.5: Print Report
**Steps:**
1. In Tax Reports page
2. Click "Print" button

**Expected Result:**
- ✅ Print dialog opens
- ✅ Report formatted for printing

---

## 6️⃣ API Testing (Using Postman/Thunder Client)

### Test 6.1: Get All Taxes
```
GET http://localhost:3001/api/v1/stock/taxes
Headers:
  Authorization: Bearer <your_token>
```

**Expected Result:**
```json
[
  {
    "id": "...",
    "taxName": "Standard VAT",
    "taxCode": "VAT-18",
    "taxType": "VAT",
    "rate": 18,
    "isActive": true,
    ...
  }
]
```

### Test 6.2: Get Active Taxes Only
```
GET http://localhost:3001/api/v1/stock/taxes/active
Headers:
  Authorization: Bearer <your_token>
```

**Expected Result:**
- ✅ Returns only active taxes

### Test 6.3: Create Tax via API
```
POST http://localhost:3001/api/v1/stock/taxes
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
Body:
{
  "taxName": "Test Tax",
  "taxCode": "TEST-5",
  "taxType": "VAT",
  "calculationType": "Percentage",
  "rate": 5,
  "priceType": "Exclusive",
  "appliesTo": "All",
  "isActive": true
}
```

**Expected Result:**
- ✅ Status: 201 Created
- ✅ Returns created tax with ID

### Test 6.4: Get Tax Transactions
```
GET http://localhost:3001/api/v1/stock/taxes/transactions/all?startDate=2024-01-01&endDate=2024-12-31
Headers:
  Authorization: Bearer <your_token>
```

**Expected Result:**
- ✅ Returns array of tax transactions
- ✅ Filtered by date range

### Test 6.5: Get Tax Summary
```
GET http://localhost:3001/api/v1/stock/taxes/reports/summary?startDate=2024-01-01&endDate=2024-12-31
Headers:
  Authorization: Bearer <your_token>
```

**Expected Result:**
```json
[
  {
    "taxType": "VAT",
    "totalTaxableAmount": 1000,
    "totalTaxAmount": 180,
    "transactionCount": 5
  },
  ...
]
```

---

## 7️⃣ Edge Cases Testing

### Test 7.1: Zero-Rated Tax
**Steps:**
1. Create tax with 0% rate
2. Assign to product
3. Create sale

**Expected Result:**
- ✅ Tax recorded with 0 amount
- ✅ Still appears in reports

### Test 7.2: Multiple Taxes on One Product
**Steps:**
1. Create tax group with 2+ taxes
2. Assign to product
3. Create sale

**Expected Result:**
- ✅ All taxes calculated
- ✅ All taxes recorded separately

### Test 7.3: Inclusive Tax Calculation
**Steps:**
1. Create tax with "Inclusive" price type
2. Assign to product
3. Create sale with $118 total

**Expected Result:**
- ✅ Tax extracted from total
- ✅ Net amount calculated correctly

### Test 7.4: Tax on Tax Exempt Product
**Steps:**
1. Mark product as tax exempt
2. Try to create sale

**Expected Result:**
- ✅ No tax applied
- ✅ No tax transaction recorded

---

## 8️⃣ Access Control Testing

### Test 8.1: Non-Finance User Access
**Steps:**
1. Login as user without Finance role
2. Try to access `/stock/tax-settings`

**Expected Result:**
- ✅ Access denied or redirected
- ✅ Menu item not visible

### Test 8.2: Accountant Access
**Steps:**
1. Login as ACCOUNTANT
2. Access tax settings and reports

**Expected Result:**
- ✅ Full access granted
- ✅ Can view and edit

---

## 9️⃣ Performance Testing

### Test 9.1: Large Dataset
**Steps:**
1. Create 100+ tax transactions
2. Load tax reports
3. Apply filters

**Expected Result:**
- ✅ Page loads within 2 seconds
- ✅ Filters work smoothly
- ✅ Export completes successfully

### Test 9.2: Concurrent Users
**Steps:**
1. Multiple users access tax reports simultaneously
2. Each applies different filters

**Expected Result:**
- ✅ No conflicts
- ✅ Each user sees correct data

---

## 🐛 Known Issues to Test

1. **Date Range Validation**
   - Test with invalid date ranges
   - Test with future dates

2. **Decimal Precision**
   - Test with rates like 18.5%
   - Verify calculations are accurate

3. **Currency Formatting**
   - Test with large amounts
   - Verify decimal places

4. **Browser Compatibility**
   - Test on Chrome, Firefox, Safari
   - Test on mobile devices

---

## ✅ Test Results Template

```
Test Date: _______________
Tester: _______________
Environment: Development / Production

Tax Configuration:
[ ] Test 1.1 - Create VAT Tax
[ ] Test 1.2 - Create Excise Duty
[ ] Test 1.3 - Create Fixed Tax
[ ] Test 1.4 - Edit Tax
[ ] Test 1.5 - Deactivate Tax
[ ] Test 1.6 - Delete Tax

Tax Groups:
[ ] Test 2.1 - Create Tax Group
[ ] Test 2.2 - Edit Tax Group
[ ] Test 2.3 - Delete Tax Group

Product Assignment:
[ ] Test 3.1 - Assign Tax to Product
[ ] Test 3.2 - Mark Product as Tax Exempt

Transaction Recording:
[ ] Test 4.1 - Create Sale with Tax
[ ] Test 4.2 - Create Purchase with Tax

Tax Reports:
[ ] Test 5.1 - View Tax Transactions
[ ] Test 5.2 - Filter by Tax Type
[ ] Test 5.3 - View Tax Summary
[ ] Test 5.4 - Export Report
[ ] Test 5.5 - Print Report

API Testing:
[ ] Test 6.1 - Get All Taxes
[ ] Test 6.2 - Get Active Taxes
[ ] Test 6.3 - Create Tax via API
[ ] Test 6.4 - Get Tax Transactions
[ ] Test 6.5 - Get Tax Summary

Edge Cases:
[ ] Test 7.1 - Zero-Rated Tax
[ ] Test 7.2 - Multiple Taxes
[ ] Test 7.3 - Inclusive Tax
[ ] Test 7.4 - Tax Exempt Product

Access Control:
[ ] Test 8.1 - Non-Finance User
[ ] Test 8.2 - Accountant Access

Performance:
[ ] Test 9.1 - Large Dataset
[ ] Test 9.2 - Concurrent Users

Issues Found:
_________________________________
_________________________________
_________________________________

Overall Status: PASS / FAIL
```

---

## 📝 Notes

- Run tests in order for best results
- Document any issues found
- Test with real-world scenarios
- Verify calculations manually
- Check database records after each test

---

**Testing Status:** Ready for QA  
**Priority:** High  
**Estimated Time:** 2-3 hours for complete testing
