# Testing Finished Goods Selling Price System

## 🧪 Test Steps

### Step 1: Verify Finished Good Migration
1. Go to `http://localhost:5173/stock/finished-goods`
2. Find a completed production cycle
3. Click "Migrate to Inventory"
4. Set selling price (e.g., £2500)
5. Confirm migration
6. ✅ Check console logs for: "Updated product with selling price: $2500"

### Step 2: Check Inventory Display
1. Go to `http://localhost:5173/stock/inventory`
2. Find the finished product
3. Verify columns show:
   - **Unit Cost**: £1500 (production cost)
   - **Selling Price**: £2500 (your set price) - GREEN background
4. ✅ Selling price should match what you set during migration

### Step 3: Test Sales Form
1. Go to `http://localhost:5173/stock/sales`
2. Click "Add New Sale"
3. Select the finished product from dropdown
4. Check the form:
   - **Unit Price field** should auto-fill with £2500
   - **Badge should show**: 🏭 Finished Good (purple badge)
   - **Inventory info panel** should show:
     - Selling Price: £2500
     - Source: 🏭 Finished Good (purple text)

### Step 4: Verify Console Logs
When you select the product in sales form, check browser console for:
```javascript
🔍 Product selection: {
  productId: "xxx",
  productName: "Your Product",
  isFinishedGood: true,
  inventorySellingPrice: 2500,
  settingsSellingPrice: 2500,
  finalSellingPrice: 2500
}
```

## 🎯 Expected Results

### For Finished Goods (Migrated from Production):
- Badge: **🏭 Finished Good** (purple)
- Price Source: Inventory data with `isFinishedGood: true`
- Selling Price: User-set price during migration

### For Regular Products (Purchased/Opening Stock):
- Badge: **From Settings** (teal)
- Price Source: ProductSettings.defaultSellingPrice
- Selling Price: Manually set in product settings

## 🔍 Troubleshooting

### Issue: Still showing "From Settings" for finished goods

**Solution 1: Refresh Inventory Data**
1. Go to inventory page
2. Click "Refresh" button
3. Go back to sales page
4. Try selecting product again

**Solution 2: Check Product Settings**
1. Go to `http://localhost:5173/stock/product-settings`
2. Find your finished product
3. Verify:
   - `defaultSellingPrice` = £2500
   - `storeCategory` = "Finished Products"
   - `isFinishedGood` = true (in database)

**Solution 3: Re-migrate**
1. If product was migrated before the update
2. The `isFinishedGood` flag might be missing
3. You may need to update the product manually or re-migrate

### Issue: Price is 0 or wrong

**Check:**
1. Was selling price set during migration?
2. Check browser console for errors
3. Verify ProductSettings in database has `defaultSellingPrice`

## 📊 Database Verification

### Check ProductSettings Collection:
```javascript
{
  id: "product123",
  name: "Your Finished Product",
  defaultSellingPrice: 2500,
  defaultBuyingPrice: 1500,
  storeCategory: "Finished Products",
  productCategory: "Finished Products",
  isFinishedGood: true,  // ← Should be true
  finishedGoodMigratedAt: Timestamp
}
```

### Check FinishedGoods Collection:
```javascript
{
  id: "fg123",
  productId: "product123",
  addedToInventory: true,
  sellingPrice: 2500,  // ← Should match
  migratedAt: Timestamp
}
```

## ✅ Success Criteria

- [ ] Finished goods show purple "🏭 Finished Good" badge
- [ ] Selling price matches migration price (£2500)
- [ ] Inventory shows correct selling price in green column
- [ ] Console logs show `isFinishedGood: true`
- [ ] Regular products still show "From Settings" badge
- [ ] All prices are consistent across pages

## 🚨 Common Mistakes

1. **Not refreshing inventory data** after migration
   - Solution: Click refresh on inventory page

2. **Selecting product before inventory loads**
   - Solution: Wait for inventory data to load (check console)

3. **Old migrations without isFinishedGood flag**
   - Solution: Re-migrate or manually update database

4. **Browser cache**
   - Solution: Hard refresh (Ctrl+Shift+R) or clear cache
