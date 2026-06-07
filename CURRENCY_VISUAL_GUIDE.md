# 🎨 Currency Settings - Visual Guide

## 🚀 Step-by-Step: Setting Currency

### Step 1: Navigate to Settings
```
URL: http://localhost:3000/stock/user-settings
```

### Step 2: Find Currency Configuration Section
```
┌─────────────────────────────────────────────────────────┐
│  💱 Currency Configuration                              │
│                                                         │
│  Select the currency to be used for all stock          │
│  transactions, purchases, sales, expenses, and          │
│  financial reports. This currency will be applied       │
│  across the entire stock management system.             │
│                                                         │
│  ┌───────────────────────────────────────────────┐     │
│  │ Select Currency ▼                             │     │
│  │ RWF - RWANDAN FRANC (RWF)                     │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
│  [Save Currency Settings]                               │
└─────────────────────────────────────────────────────────┘
```

### Step 3: Select Your Currency
```
Available Options:
  ┌─────────────────────────────────┐
  │ USD - US Dollar ($)             │
  │ EUR - Euro (€)                  │
  │ GBP - British Pound (£)         │
  │ RWF - RWANDAN FRANC (RWF)       │◄── Select this
  │ KES - Kenyan Shilling (KES)     │
  │ TZS - Tanzanian Shilling (TZS)  │
  └─────────────────────────────────┘
```

### Step 4: Save Settings
```
Click: [Save Currency Settings] button
Result: ✅ Currency updated successfully!
```

---

## 📊 Where Currency Appears

### Dashboard (http://localhost:3000/stock)

#### Before (Hardcoded)
```
┌────────────────────────┐
│ Inventory Value        │
│ ₹1,234.5K             │ ◄── Hardcoded ₹ symbol
└────────────────────────┘

Recent Activity:
  Purchase Order  ₹5,678  ◄── Hardcoded
  Sales Transaction ₹9,876 ◄── Hardcoded
```

#### After (Dynamic)
```
┌────────────────────────┐
│ Inventory Value        │
│ RWF 1,234.5K          │ ◄── Dynamic from settings
└────────────────────────┘

Recent Activity:
  Purchase Order  RWF 5,678    ◄── Dynamic
  Sales Transaction RWF 9,876   ◄── Dynamic
```

---

### Inventory Page (http://localhost:3000/stock/inventory)

```
┌─────────────────────────────────────────────────────────────────┐
│ Product Name  │  Unit Cost   │ Selling Price │  Total Value    │
├─────────────────────────────────────────────────────────────────┤
│ Product A     │  RWF 1,500   │  RWF 2,000   │  RWF 200,000   │
│ Product B     │  RWF 2,500   │  RWF 3,200   │  RWF 160,000   │
│ Product C     │  RWF 800     │  RWF 1,100   │  RWF 220,000   │
└─────────────────────────────────────────────────────────────────┘

Summary:
┌────────────────────────────┐
│ Total Inventory Value      │
│ RWF 580,000               │ ◄── All use selected currency
└────────────────────────────┘
```

---

## 🎯 Currency Flow Diagram

```
     USER INTERACTION
           │
           ↓
┌──────────────────────────┐
│  Settings Page           │
│  Select: RWF             │
│  Click: Save             │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│  Backend API             │
│  POST /currency/default  │
└──────────┬───────────────┘
           │
           ├─────────────────────┐
           ↓                     ↓
┌──────────────────┐   ┌────────────────┐
│  Firestore       │   │ LocalStorage   │
│  Save currency   │   │ Save currency  │
└──────────┬───────┘   └────────┬───────┘
           │                    │
           └──────────┬─────────┘
                      ↓
           ┌──────────────────────┐
           │  CurrencyContext     │
           │  Loads on app start  │
           └──────────┬───────────┘
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   Dashboard     Inventory      Sales
   Purchases     Expenses       Reports
   
   ALL PAGES USE SELECTED CURRENCY
```

---

## 💻 Code Examples

### Example 1: Dashboard Stat Card
```javascript
// Old Code (Hardcoded)
<Typography variant="h3">
  ₹{stats.totalValue}
</Typography>

// New Code (Dynamic)
import { formatStockCurrency } from '@/lib/stockCurrency';

<Typography variant="h3">
  {formatStockCurrency(stats.totalValue)}
</Typography>

// Result: "RWF 1,234.56" (based on settings)
```

### Example 2: Price Table
```javascript
// Usage in table
<TableCell align="right">
  {formatStockCurrency(product.price)}
</TableCell>

// Output: "RWF 1,500.00"
```

### Example 3: Total Calculation
```javascript
const total = items.reduce((sum, item) => sum + item.amount, 0);

<Typography variant="h4">
  Total: {formatStockCurrency(total)}
</Typography>

// Output: "Total: RWF 5,678.90"
```

---

## 🔄 Currency Change Impact

### Change Currency:
```
Settings: RWF → USD
```

### Results Across All Pages:

| Page | Before | After |
|------|--------|-------|
| Dashboard | RWF 1,234 | $1,234.00 |
| Inventory | RWF 5,678 | $5,678.00 |
| Purchases | RWF 9,876 | $9,876.00 |
| Sales | RWF 3,456 | $3,456.00 |

**All pages update automatically!** 🎉

---

## 📱 User Experience Flow

```
1. Login → Stock Dashboard
   │
   ↓
2. Notice: All amounts in ₹ (default)
   │
   ↓
3. Navigate: Settings (/stock/user-settings)
   │
   ↓
4. Action: Select RWF currency
   │
   ↓
5. Action: Click "Save"
   │
   ↓
6. Result: ✅ Currency updated!
   │
   ↓
7. Navigate: Back to Dashboard
   │
   ↓
8. Observe: All amounts now in RWF
   │
   ↓
9. Check: Inventory, Purchases, Sales
   │
   ↓
10. Confirm: Everything in RWF ✅
```

---

## 🎨 Visual Examples

### Stats Card
```
┌──────────────────────────────┐
│  💰 Total Revenue            │
│                              │
│     RWF 1,234,567.89        │
│                              │
│  ↗ +15% from last month      │
└──────────────────────────────┘
```

### Invoice/Receipt
```
┌─────────────────────────────────┐
│  INVOICE #INV-001               │
├─────────────────────────────────┤
│  Item A  x 2      RWF 200.00   │
│  Item B  x 1      RWF 150.00   │
├─────────────────────────────────┤
│  Subtotal:        RWF 350.00   │
│  Tax (16%):       RWF 56.00    │
├─────────────────────────────────┤
│  TOTAL:           RWF 406.00   │
└─────────────────────────────────┘
```

### Report Summary
```
┌─────────────────────────────────────┐
│  FINANCIAL SUMMARY - JANUARY 2024   │
├─────────────────────────────────────┤
│  Total Sales:      RWF 1,500,000   │
│  Total Purchases:  RWF 800,000     │
│  Total Expenses:   RWF 200,000     │
│  Net Profit:       RWF 500,000     │
└─────────────────────────────────────┘
```

---

## ✅ Success Indicators

### You'll Know It's Working When:

1. **Settings Page**
   - ✅ Currency dropdown has options
   - ✅ Save button works
   - ✅ Success message appears

2. **Dashboard**
   - ✅ Inventory value shows currency symbol
   - ✅ Activity amounts show currency symbol
   - ✅ Stats cards use selected currency

3. **All Pages**
   - ✅ Consistent currency across pages
   - ✅ No hardcoded symbols (₹, $, etc.)
   - ✅ Proper decimal formatting

4. **After Refresh**
   - ✅ Currency persists
   - ✅ Settings remembered
   - ✅ Works offline

---

## 🎯 Quick Test

1. Go to: `/stock/user-settings`
2. Select: RWF
3. Save
4. Go to: `/stock` (dashboard)
5. Check: All amounts have "RWF" symbol ✅

**Done!** Your currency is now applied everywhere! 🎉

---

## 📞 Need Help?

**Documentation:**
- Full Guide: `CURRENCY_STOCK_INTEGRATION.md`
- Quick Reference: `CURRENCY_QUICK_GUIDE.md`
- Code Examples: `stock_manager/src/components/stock/CurrencyExample.tsx`

**Key Function:**
```javascript
formatStockCurrency(amount)
```

That's it! Simple to use, works everywhere! ✨
