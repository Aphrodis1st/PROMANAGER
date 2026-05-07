# 🚀 Quick Test Guide - Production Cycle Raw Materials

## ✅ What Was Fixed
- Raw materials now load from inventory page data
- Modal shows all items with available stock
- Multiple data sources checked (productSettings, products, purchases)
- Better error messages and debugging

## 🧪 Quick Test (2 minutes)

### 1. Check Inventory
```
URL: http://localhost:5173/stock/inventory
Look for: Items with "Closing Stock" > 0
```

### 2. Open Console
```
Press: F12
Tab: Console
```

### 3. Start Cycle
```
URL: http://localhost:5173/stock/production-cycle
Click: "Start Cycle" button (▶️ icon)
```

### 4. Check Console Output
```
Should see:
🔍 RawMaterialSelector - Data sources: { productSettings: X, products: Y, purchases: Z }
🎯 Total raw materials found: N
```

### 5. Verify Modal
```
Should show:
✓ Material names from inventory
✓ Available quantities
✓ Cost per unit
✓ Ability to select and enter quantities
```

## 🐛 If No Materials Show

### Check 1: Console Logs
```javascript
// Look for these numbers:
productSettings: 0  ← Should be > 0 if you have inventory
products: 0
purchases: 0
```

### Check 2: Inventory Data
```javascript
// In console, type:
// (This checks if data is loaded)
```

### Check 3: Item Requirements
Each item needs:
- ✅ Stock > 0 (currentStock or openingStock)
- ✅ Price > 0 (costPrice or buyingPrice)
- ✅ Valid ID
- ✅ Name

## 📊 Console Commands for Debugging

```javascript
// Check if data is loaded (paste in console)
console.log('ProductSettings:', window.productSettings);
console.log('Products:', window.products);
console.log('Purchases:', window.purchases);
```

## 🎯 Expected Flow

```
Inventory Page → Has Items with Stock
         ↓
Production Cycle Page → Click Start Cycle
         ↓
Modal Opens → Shows Materials from Inventory
         ↓
Select Materials → Enter Quantities
         ↓
Click "Attach & Start Cycle"
         ↓
Cycle Starts → Stock Deducted
         ↓
Success! ✅
```

## 🔧 Quick Fixes

### Fix 1: No Data in Console
```
Solution: Refresh the page and wait for data to load
Check: Network tab for API calls
```

### Fix 2: Items in Inventory but Not in Modal
```
Solution: Check if items have:
- currentStock > 0 OR openingStock > 0
- costPrice > 0 OR buyingPrice > 0
```

### Fix 3: Can't Start Cycle
```
Solution: Check backend logs
Verify: Material IDs are correct
```

## 📝 Test Checklist

- [ ] Inventory page shows items with stock
- [ ] Console shows data source counts > 0
- [ ] Modal displays materials
- [ ] Can select materials
- [ ] Can enter quantities
- [ ] "Attach & Start Cycle" button works
- [ ] Cycle appears in cycles table
- [ ] Stock is deducted from inventory

## 🆘 Still Not Working?

Share these in your message:
1. Screenshot of inventory page
2. Console logs (copy/paste)
3. Network tab response for `/api/stock/product-settings`
4. Any error messages

## 📚 Full Documentation

- `PRODUCTION_CYCLE_FIXES.md` - What was fixed
- `RAW_MATERIALS_TROUBLESHOOTING.md` - Detailed troubleshooting
- `PRODUCTION_CYCLE_INTEGRATION.md` - Complete technical overview

---

**Last Updated**: Now
**Status**: ✅ Ready to Test
