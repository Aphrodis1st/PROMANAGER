# Currency Integration Testing Checklist

## Pre-Testing Setup

### 1. Initialize Currency System
- [ ] Navigate to `http://localhost:5173/stock/user-settings`
- [ ] Check if currencies are loaded
- [ ] If no currencies, click "Initialize Currencies" button
- [ ] Verify currencies list appears

### 2. Set Default Currency
- [ ] Select "GBP - British Pound (£)" from dropdown
- [ ] Click "Save" button
- [ ] Verify success message appears
- [ ] Verify "Current Currency" shows GBP

---

## Core Functionality Tests

### Test 1: User Settings Page
**Location**: `http://localhost:5173/stock/user-settings`

- [ ] Currency dropdown displays all available currencies
- [ ] Selected currency is highlighted
- [ ] Save button is enabled when currency is selected
- [ ] Success message appears after saving
- [ ] Current currency display updates after saving
- [ ] Page doesn't reload unnecessarily

**Expected Result**: Currency saved successfully, UI updates immediately

---

### Test 2: Sales Page
**Location**: `http://localhost:5173/stock/sales`

#### Price Display
- [ ] Unit prices show with currency symbol (£)
- [ ] Total prices show with currency symbol
- [ ] Discount amounts show with currency symbol
- [ ] Tax amounts show with currency symbol
- [ ] Cart total shows with currency symbol

#### Inventory Information
- [ ] Stock value shows with currency symbol
- [ ] Selling price shows with currency symbol
- [ ] All monetary values formatted correctly

#### Cart Items
- [ ] Each cart item shows price with currency
- [ ] Cart subtotal shows with currency
- [ ] Cart total shows with currency

**Expected Result**: All monetary values display with £ symbol

---

### Test 3: Purchases Page
**Location**: `http://localhost:5173/stock/purchases`

#### Invoice Display
- [ ] Unit prices show with currency symbol
- [ ] Total amounts show with currency symbol
- [ ] Invoice totals show with currency symbol
- [ ] Payment amounts show with currency symbol

#### Purchase Form
- [ ] Unit cost field shows currency hint
- [ ] Total price shows with currency symbol
- [ ] Invoice items show prices with currency

#### Invoice List
- [ ] All invoice totals show with currency
- [ ] Payment amounts show with currency

**Expected Result**: All purchase-related amounts show with £ symbol

---

### Test 4: Inventory Page
**Location**: `http://localhost:5173/stock/inventory`

#### Stock Valuation
- [ ] Opening stock value shows with currency
- [ ] Closing stock value shows with currency
- [ ] Stock movement values show with currency
- [ ] Total inventory value shows with currency

#### Product Prices
- [ ] Buying prices show with currency
- [ ] Selling prices show with currency
- [ ] Average costs show with currency

**Expected Result**: All inventory values display with £ symbol

---

### Test 5: Reports Dashboard
**Location**: `http://localhost:5173/stock/reports-dashboard`

#### Financial Reports
- [ ] Revenue figures show with currency
- [ ] Expense figures show with currency
- [ ] Profit/Loss shows with currency
- [ ] Net income shows with currency

#### Summary Cards
- [ ] Total sales show with currency
- [ ] Total purchases show with currency
- [ ] Total expenses show with currency
- [ ] Balance shows with currency

#### Charts & Graphs
- [ ] Y-axis labels show currency symbol
- [ ] Tooltips show currency symbol
- [ ] Legend shows currency symbol

**Expected Result**: All financial figures display with £ symbol

---

### Test 6: Expenses Page
**Location**: `http://localhost:5173/stock/expenses`

#### Expense Entry
- [ ] Amount field shows currency hint
- [ ] Total expense shows with currency
- [ ] Expense list shows amounts with currency

#### Expense Categories
- [ ] Category totals show with currency
- [ ] Grand total shows with currency

**Expected Result**: All expense amounts display with £ symbol

---

### Test 7: Fixed Assets Page
**Location**: `http://localhost:5173/stock/fixed-assets`

#### Asset Costs
- [ ] Purchase cost shows with currency
- [ ] Depreciation amount shows with currency
- [ ] Book value shows with currency
- [ ] Accumulated depreciation shows with currency

#### Asset List
- [ ] All asset costs show with currency
- [ ] Total assets value shows with currency

**Expected Result**: All asset values display with £ symbol

---

### Test 8: Production Pages

#### Production Cost Page
**Location**: `http://localhost:5173/stock/production-cost`

- [ ] Material costs show with currency
- [ ] Labor costs show with currency
- [ ] Overhead costs show with currency
- [ ] Total production cost shows with currency

#### Finished Goods Page
**Location**: `http://localhost:5173/stock/finished-goods`

- [ ] Production cost shows with currency
- [ ] Selling price shows with currency
- [ ] Profit margin shows with currency

#### Material Consumption Page
**Location**: `http://localhost:5173/stock/Material-consumptions`

- [ ] Material costs show with currency
- [ ] Total consumption value shows with currency

**Expected Result**: All production-related amounts display with £ symbol

---

### Test 9: Invoice Page
**Location**: `http://localhost:5173/stock/invoice/:id`

#### Invoice Details
- [ ] Line item prices show with currency
- [ ] Subtotal shows with currency
- [ ] Tax amount shows with currency
- [ ] Discount shows with currency
- [ ] Grand total shows with currency

#### Invoice Header
- [ ] Invoice total shows with currency
- [ ] Amount paid shows with currency
- [ ] Balance due shows with currency

**Expected Result**: All invoice amounts display with £ symbol

---

### Test 10: Product Settings Page
**Location**: `http://localhost:5173/stock/Product-Settings`

#### Product Pricing
- [ ] Default selling price shows currency hint
- [ ] Default buying price shows currency hint
- [ ] Reorder cost shows currency hint

**Expected Result**: Currency hints visible in price fields

---

## Currency Switching Tests

### Test 11: Change Currency to USD
- [ ] Go to User Settings
- [ ] Select "USD - US Dollar ($)"
- [ ] Click Save
- [ ] Navigate to Sales page
- [ ] Verify all amounts show with $ symbol
- [ ] Navigate to Purchases page
- [ ] Verify all amounts show with $ symbol
- [ ] Navigate to Reports page
- [ ] Verify all amounts show with $ symbol

**Expected Result**: All pages update to show $ symbol

---

### Test 12: Change Currency to EUR
- [ ] Go to User Settings
- [ ] Select "EUR - Euro (€)"
- [ ] Click Save
- [ ] Navigate to Inventory page
- [ ] Verify all amounts show with € symbol
- [ ] Navigate to Expenses page
- [ ] Verify all amounts show with € symbol

**Expected Result**: All pages update to show € symbol

---

### Test 13: Change Currency to RWF
- [ ] Go to User Settings
- [ ] Select "RWF - Rwandan Franc (FRw)"
- [ ] Click Save
- [ ] Navigate to Fixed Assets page
- [ ] Verify all amounts show with FRw symbol
- [ ] Navigate to Production pages
- [ ] Verify all amounts show with FRw symbol

**Expected Result**: All pages update to show FRw symbol

---

## Edge Cases & Error Handling

### Test 14: Null/Undefined Amounts
- [ ] Create a product with no price
- [ ] View in sales page
- [ ] Verify displays "-" instead of error
- [ ] Check console for errors (should be none)

**Expected Result**: Graceful handling of missing amounts

---

### Test 15: Zero Amounts
- [ ] Create a sale with 0 quantity
- [ ] Verify total shows £0.00
- [ ] Create an expense with 0 amount
- [ ] Verify shows £0.00

**Expected Result**: Zero amounts display correctly

---

### Test 16: Negative Amounts
- [ ] Create a return/refund
- [ ] Verify negative amount shows with currency
- [ ] Check if negative sign is visible
- [ ] Verify color coding (if applicable)

**Expected Result**: Negative amounts display correctly

---

### Test 17: Large Amounts
- [ ] Enter amount: 1,000,000.00
- [ ] Verify displays as £1,000,000.00
- [ ] Check thousands separator
- [ ] Verify decimal places

**Expected Result**: Large amounts formatted correctly

---

### Test 18: Decimal Precision
- [ ] Enter amount: 1234.567
- [ ] Verify rounds to £1,234.57 (2 decimal places)
- [ ] Enter amount: 1234.564
- [ ] Verify rounds to £1,234.56

**Expected Result**: Proper rounding to currency decimal places

---

## Integration Tests

### Test 19: Sales to Invoice Flow
- [ ] Create a sale with multiple items
- [ ] View invoice
- [ ] Verify all amounts show with currency
- [ ] Verify totals are correct
- [ ] Verify currency is consistent

**Expected Result**: Currency consistent throughout flow

---

### Test 20: Purchase to Payment Flow
- [ ] Create a purchase invoice
- [ ] Process payment
- [ ] Verify amounts show with currency
- [ ] Check payment confirmation
- [ ] Verify currency in payment record

**Expected Result**: Currency consistent in payment flow

---

### Test 21: Inventory to Reports Flow
- [ ] Add inventory items
- [ ] Generate inventory report
- [ ] Verify stock values show with currency
- [ ] Generate financial report
- [ ] Verify inventory value shows with currency

**Expected Result**: Currency consistent in reporting

---

## Performance Tests

### Test 22: Page Load Performance
- [ ] Clear browser cache
- [ ] Navigate to Sales page
- [ ] Measure load time
- [ ] Verify currency loads quickly
- [ ] Check for any delays

**Expected Result**: Currency loads without noticeable delay

---

### Test 23: Multiple Currency Displays
- [ ] Open page with 100+ items
- [ ] Verify all amounts show currency
- [ ] Check for performance issues
- [ ] Verify no lag in scrolling

**Expected Result**: No performance degradation

---

## Browser Compatibility Tests

### Test 24: Chrome
- [ ] Test all pages in Chrome
- [ ] Verify currency displays correctly
- [ ] Check for console errors

**Expected Result**: Works perfectly in Chrome

---

### Test 25: Firefox
- [ ] Test all pages in Firefox
- [ ] Verify currency displays correctly
- [ ] Check for console errors

**Expected Result**: Works perfectly in Firefox

---

### Test 26: Safari
- [ ] Test all pages in Safari
- [ ] Verify currency displays correctly
- [ ] Check for console errors

**Expected Result**: Works perfectly in Safari

---

### Test 27: Edge
- [ ] Test all pages in Edge
- [ ] Verify currency displays correctly
- [ ] Check for console errors

**Expected Result**: Works perfectly in Edge

---

## Mobile Responsiveness Tests

### Test 28: Mobile View
- [ ] Open on mobile device or emulator
- [ ] Verify currency displays correctly
- [ ] Check if symbol is visible
- [ ] Verify amounts are readable

**Expected Result**: Currency displays well on mobile

---

## Accessibility Tests

### Test 29: Screen Reader
- [ ] Use screen reader on Sales page
- [ ] Verify currency amounts are read correctly
- [ ] Check if symbol is announced

**Expected Result**: Currency accessible to screen readers

---

## Data Persistence Tests

### Test 30: Page Refresh
- [ ] Set currency to GBP
- [ ] Refresh page
- [ ] Verify currency is still GBP
- [ ] Navigate to different page
- [ ] Verify currency persists

**Expected Result**: Currency setting persists

---

### Test 31: Browser Close/Reopen
- [ ] Set currency to EUR
- [ ] Close browser
- [ ] Reopen browser
- [ ] Navigate to stock pages
- [ ] Verify currency is still EUR

**Expected Result**: Currency persists across sessions

---

## Multi-User Tests

### Test 32: Different Organizations
- [ ] Login as Organization A
- [ ] Set currency to GBP
- [ ] Logout
- [ ] Login as Organization B
- [ ] Set currency to USD
- [ ] Verify each org has its own currency

**Expected Result**: Each organization has independent currency

---

## Regression Tests

### Test 33: Existing Data
- [ ] View old sales records
- [ ] Verify amounts show with current currency
- [ ] View old purchase records
- [ ] Verify amounts show with current currency

**Expected Result**: Old data displays with current currency

---

## Final Verification

### Test 34: Complete User Journey
- [ ] Set currency to GBP
- [ ] Create a product
- [ ] Make a purchase
- [ ] Make a sale
- [ ] Add an expense
- [ ] Generate reports
- [ ] Verify currency throughout

**Expected Result**: Currency consistent in entire journey

---

## Test Summary

### Pass Criteria
- [ ] All monetary values display with correct currency symbol
- [ ] Currency changes apply immediately
- [ ] No console errors
- [ ] No visual glitches
- [ ] Performance is acceptable
- [ ] Works across all browsers
- [ ] Mobile responsive
- [ ] Accessible

### Known Issues
- Document any issues found during testing
- Note any workarounds needed
- List any limitations

### Sign-off
- [ ] All tests passed
- [ ] Issues documented
- [ ] Ready for production

---

**Testing Date**: _____________
**Tested By**: _____________
**Browser**: _____________
**OS**: _____________
**Result**: ☐ Pass  ☐ Fail  ☐ Partial

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

**Last Updated**: January 2025
