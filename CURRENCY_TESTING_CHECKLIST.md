# ✅ CURRENCY SETTINGS - TESTING CHECKLIST

## 🎯 Quick Test (5 Minutes)

### ☑️ Step 1: Set Currency
- [ ] Go to: `http://localhost:3000/stock/user-settings`
- [ ] Find "Currency Configuration" section
- [ ] Click dropdown "Select Currency"
- [ ] Choose: **RWF - RWANDAN FRANC (RWF)**
- [ ] Click: **Save Currency Settings**
- [ ] See message: ✅ "Currency updated successfully!"

### ☑️ Step 2: Check Dashboard
- [ ] Go to: `http://localhost:3000/stock`
- [ ] Find "Inventory Value" card
- [ ] Check icon is: 🏛️ (NOT $)
- [ ] Check amount shows: **RWF X,XXX.XX** (NOT $X,XXX.XX)
- [ ] Scroll to "Recent Activity"
- [ ] Check all amounts show: **RWF X,XXX.XX**

### ☑️ Step 3: Check Other Pages
- [ ] Go to: `http://localhost:3000/stock/inventory`
- [ ] Check all prices show: **RWF** symbol
- [ ] Go to: `http://localhost:3000/stock/purchases`
- [ ] Check amounts show: **RWF** symbol
- [ ] Go to: `http://localhost:3000/stock/sales`
- [ ] Check amounts show: **RWF** symbol

### ☑️ Step 4: Verify Persistence
- [ ] Refresh page (F5)
- [ ] Currency should still be **RWF**
- [ ] Close browser completely
- [ ] Reopen and go to `http://localhost:3000/stock`
- [ ] Currency should STILL be **RWF**

---

## 🔍 Detailed Verification

### Browser DevTools Check:
1. Press **F12** (open DevTools)
2. Go to **Application** tab
3. Left side: **Local Storage** → `http://localhost:3000`
4. Find key: `stock.currencySettings.v1`
5. Value should be:
```json
{"code":"RWF","symbol":"RWF","name":"RWANDAN FRANC","decimalPlaces":2}
```

### Console Check:
1. Press **F12** (open DevTools)
2. Go to **Console** tab
3. Type and press Enter:
```javascript
localStorage.getItem('stock.currencySettings.v1')
```
4. Should show: `"{"code":"RWF","symbol":"RWF","name":"RWANDAN FRANC","decimalPlaces":2}"`

---

## ✅ PASS Criteria

### Dashboard Page:
```
Before: $1,234.56
After:  RWF 1,234.56 ✅
```

### Inventory Page:
```
Before: $500.00
After:  RWF 500.00 ✅
```

### All Pages Should Show:
- ✅ RWF symbol (not $)
- ✅ Consistent formatting
- ✅ Proper decimal places (2 digits)

---

## ❌ FAIL Indicators (What to Watch For)

- ❌ Still shows **$** symbol anywhere
- ❌ Shows **USD** instead of **RWF**
- ❌ Currency changes back to $ after refresh
- ❌ Different currencies on different pages
- ❌ Shows "-" instead of formatted amounts

---

## 🛠️ If Test FAILS

### Fix 1: Clear and Reset
```
1. Go to settings page
2. Select currency again
3. Click Save
4. Press Ctrl+Shift+R (hard refresh)
```

### Fix 2: Clear Storage
```
1. F12 → Application → Local Storage
2. Right-click → Clear
3. Reload page
4. Go to settings and set currency again
```

### Fix 3: Check Backend
```
1. Make sure backend is running on port 3001
2. Go to: http://localhost:3001/currency
3. Should show list of currencies including RWF
```

---

## 📊 Visual Comparison

### BEFORE (Default USD):
```
┌────────────────────────┐
│ 💵 Inventory Value     │
│ $1,234,567.89         │
└────────────────────────┘
```

### AFTER (Set to RWF):
```
┌────────────────────────┐
│ 🏛️  Inventory Value    │
│ RWF 1,234,567.89      │
└────────────────────────┘
```

---

## 🎯 Success = All ✅

- ✅ Can set currency in settings
- ✅ Currency saves successfully
- ✅ Dashboard shows RWF
- ✅ Inventory shows RWF
- ✅ All pages show RWF
- ✅ Persists after refresh
- ✅ Persists after browser restart
- ✅ No $ symbol anywhere
- ✅ Balance icon instead of $ icon

---

## 📞 Final Check Commands

Run these in browser console (F12):

```javascript
// 1. Check if currency is saved
console.log('Currency:', localStorage.getItem('stock.currencySettings.v1'));

// 2. Check organization ID
console.log('Org ID:', localStorage.getItem('stockOrganizationId'));

// 3. Test formatting function (paste all lines together)
const getSavedStockCurrency = () => {
  const saved = localStorage.getItem('stock.currencySettings.v1');
  return saved ? JSON.parse(saved) : null;
};
console.log('Current Currency:', getSavedStockCurrency());
```

Expected output:
```
Currency: {"code":"RWF","symbol":"RWF","name":"RWANDAN FRANC","decimalPlaces":2}
Org ID: stock-org-1
Current Currency: {code: "RWF", symbol: "RWF", name: "RWANDAN FRANC", decimalPlaces: 2}
```

---

## 🎉 DONE!

If all checks pass, your currency system is working perfectly!

**Summary:**
- ✅ Set once in settings
- ✅ Used everywhere automatically
- ✅ Persists permanently
- ✅ Easy to change anytime

**Your currency is now:** RWF (RWANDAN FRANC) 🇷🇼
