# Currency Settings Verification Guide

## ✅ How to Verify Currency is Working

### Step 1: Set Currency
1. Go to: `http://localhost:3000/stock/user-settings`
2. Scroll to "Currency Configuration" section
3. Select your currency (e.g., **RWF - RWANDAN FRANC (RWF)**)
4. Click **"Save Currency Settings"**
5. Wait for success message: ✅ "Currency updated successfully!"

### Step 2: Verify in Browser Storage
1. Open browser DevTools (F12)
2. Go to **Application** tab → **Local Storage** → `http://localhost:3000`
3. Look for key: `stock.currencySettings.v1`
4. Value should be:
```json
{
  "code": "RWF",
  "symbol": "RWF", 
  "name": "RWANDAN FRANC",
  "decimalPlaces": 2
}
```

### Step 3: Check Dashboard
1. Go to: `http://localhost:3000/stock`
2. Look at **"Inventory Value"** card
3. Should show: **RWF 1,234.56** (not $ or ₹)
4. Icon should be: 🏛️ (bank/balance icon, not $)

### Step 4: Check Recent Activity
1. On same dashboard page
2. Scroll to **"Recent Activity"** section
3. All amounts should show: **RWF XXX.XX**

### Step 5: Check Inventory Page
1. Go to: `http://localhost:3000/stock/inventory`
2. All prices should show: **RWF XXX.XX**
3. Unit Cost, Selling Price, Total Value - all should use RWF

---

## 🔧 Troubleshooting

### Currency Not Showing?

**1. Clear Browser Cache**
```
Ctrl + Shift + Delete → Clear cache and reload
```

**2. Check LocalStorage**
- F12 → Application → Local Storage
- Delete `stock.currencySettings.v1` if exists
- Go back to settings and set currency again

**3. Hard Refresh**
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

**4. Check Backend Currency Save**
- Go to: `http://localhost:3001/currency` (or your backend URL)
- Should return list of currencies
- Your selected currency should be there

---

## 📍 Where Currency is Used

### ✅ Currently Implemented:
1. **Dashboard** (`/stock`)
   - Inventory Value card
   - Recent Activity amounts
   
2. **Inventory Page** (`/stock/inventory`)
   - Unit Cost
   - Selling Price  
   - Total Value
   - Inventory Value summary

3. **User Settings** (`/stock/user-settings`)
   - Currency selection dropdown
   - Current currency display

### 🔄 How It Works:

```
User Sets Currency
      ↓
Saved to Firestore + LocalStorage
      ↓
CurrencyContext loads it
      ↓
formatStockCurrency() reads from localStorage
      ↓
All pages use formatStockCurrency()
      ↓
Currency displays everywhere
```

---

## 🎯 Quick Test Commands

### Check if currency is saved:
Open browser console (F12) and run:
```javascript
// Check localStorage
console.log(localStorage.getItem('stock.currencySettings.v1'));

// Should output: {"code":"RWF","symbol":"RWF","name":"RWANDAN FRANC","decimalPlaces":2}
```

### Force reload currency:
```javascript
// Clear and reload
localStorage.removeItem('stock.currencySettings.v1');
window.location.reload();
```

---

## ✨ Expected Results

### Before Setting Currency:
- Shows: **$1,234.56** (default USD)
- Icon: 💵 (dollar icon) 

### After Setting Currency to RWF:
- Shows: **RWF 1,234.56** 
- Icon: 🏛️ (balance icon)

---

## 📝 Files That Use Currency

1. **`src/lib/stockCurrency.ts`**
   - Core formatting function
   - Reads from localStorage
   - Returns formatted currency

2. **`src/context/CurrencyContext.tsx`**
   - Global currency state
   - Fetches from backend
   - Saves to localStorage

3. **`src/views/stock/StockDashboardOverview.jsx`**
   - Dashboard page
   - Uses formatStockCurrency()

4. **`src/views/stock/InventoryPage.jsx`**
   - Inventory page
   - Uses useOrganizationCurrency()

5. **`src/views/stock/UserSettingsPage.jsx`**
   - Settings page
   - Currency configuration UI

---

## 🚨 Common Issues

### Issue 1: Shows USD instead of RWF
**Solution:** 
- Go to settings, select RWF again
- Click Save
- Hard refresh page (Ctrl+Shift+R)

### Issue 2: Shows "-" instead of amount
**Solution:**
- Check if products have prices set
- Check if inventory has values

### Issue 3: Currency not persisting
**Solution:**
- Check browser allows localStorage
- Check if backend is running (port 3001)
- Verify Firestore connection

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Settings page shows "Currency updated successfully!"
- ✅ Dashboard shows **RWF** not **$**
- ✅ Balance icon (🏛️) shows instead of dollar icon
- ✅ All pages consistently show RWF
- ✅ Currency persists after page refresh
- ✅ Currency persists after browser close/reopen

---

## 🎉 All Done!

Your currency system is now:
- ✅ Centralized (one setting)
- ✅ Persistent (saved in DB + localStorage)
- ✅ Applied everywhere (all pages use it)
- ✅ Easy to change (just change in settings)

**Test it now:**
1. Set currency to RWF in settings
2. Go to dashboard
3. See RWF everywhere! 🎊
