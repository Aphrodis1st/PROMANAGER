# Debugging: Finished Products Not Showing in Inventory

## Current Status
✅ Fix script ran successfully and updated 2 products:
- MUKAMIRA MILK (stock: 10,019)
- Pinaple Juice (stock: 200,500)

Both now have `storeCategory: "Finished Products"`

## Step-by-Step Debugging

### Step 1: Verify Database (CRITICAL)
Open Firebase Console and check:

1. **productSettings Collection**
   - Find product: `xpTr9II75lmwHpd6FOKs` (MUKAMIRA MILK)
   - Verify fields:
     ```javascript
     {
       id: "xpTr9II75lmwHpd6FOKs",
       name: "MUKAMIRA MILK",
       storeCategory: "Finished Products",  // ← Must be EXACTLY this
       productCategory: "Finished Products", // ← Updated by script
       currentStock: 10019,
       openingStock: [check value],
       // ...
     }
     ```

2. **Check for Typos**
   - storeCategory must be EXACTLY: `"Finished Products"` (capital F, capital P, with space)
   - NOT: "finished products", "Finished Product", "FinishedProducts", etc.

### Step 2: Check Frontend Console
1. Open browser DevTools (F12)
2. Go to `http://localhost:5173/stock/inventory`
3. Look for console logs:
   ```
   📊 Calculating inventory from productSettings: [number]
   📝 Product: "MUKAMIRA MILK"
      - productCategory (display): "Finished Products"
      - storeCategory (for filtering): "Finished Products"
      - Display as: "Finished Products"
      - Detected type: finished
   ```

4. Check the summary:
   ```
   📈 Inventory data summary: {
     total: X,
     raw: X,
     finished: X,  // ← Should be > 0
     other: X
   }
   ```

5. Check the filtered list:
   ```
   🔍 Finished products: ["MUKAMIRA MILK (store: Finished Products)", ...]
   ```

### Step 3: Force Refresh
1. Go to inventory page
2. Click the "Refresh" button
3. Or press Ctrl+Shift+R (hard refresh)
4. Check if products appear

### Step 4: Check Stock Context
The inventory page uses `useStock()` hook which provides `productSettings`.

Add this to check what's loaded:
1. Open browser console
2. Type: `localStorage` and check if there's cached data
3. Clear cache: `localStorage.clear()`
4. Refresh page

### Step 5: Manual Database Query
Run this script to check the database directly:

```javascript
// check-finished-products.js
import { initFirebase, db } from './utils/firebase.js';

async function checkFinishedProducts() {
  await initFirebase();
  const firestore = db();
  
  console.log('\n🔍 Checking Finished Products in Database...\n');
  
  // Get all productSettings
  const productsSnapshot = await firestore.collection('productSettings').get();
  
  const finishedProducts = [];
  productsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.storeCategory === 'Finished Products') {
      finishedProducts.push({
        id: doc.id,
        name: data.name,
        storeCategory: data.storeCategory,
        productCategory: data.productCategory,
        currentStock: data.currentStock,
        openingStock: data.openingStock
      });
    }
  });
  
  console.log(`\n✅ Found ${finishedProducts.length} products with storeCategory = "Finished Products"\n`);
  
  finishedProducts.forEach(p => {
    console.log(`📦 ${p.name}`);
    console.log(`   ID: ${p.id}`);
    console.log(`   Store Category: "${p.storeCategory}"`);
    console.log(`   Product Category: "${p.productCategory}"`);
    console.log(`   Current Stock: ${p.currentStock}`);
    console.log(`   Opening Stock: ${p.openingStock}`);
    console.log('');
  });
  
  process.exit(0);
}

checkFinishedProducts();
```

Save as `backend/check-finished-products.js` and run:
```bash
cd backend
node check-finished-products.js
```

### Step 6: Check Inventory Service
The inventory page tries to fetch from `inventoryService.getReport()` first.

Check if this endpoint exists and works:
```bash
# Check backend routes
grep -r "inventory" backend/src/routes/
```

### Step 7: Check Production Transactions
Finished products should have production transactions, not purchase transactions.

Check if there's a production transaction record:
```javascript
// In Firebase Console
// Collection: transactions or productionTransactions
// Look for records with:
{
  productId: "xpTr9II75lmwHpd6FOKs",
  type: "production",
  quantity: 20,
  // ...
}
```

## Common Issues & Solutions

### Issue 1: Products appear in "All Items" but not "Finished Products" tab
**Cause**: `storeCategory` is not exactly "Finished Products"
**Solution**: 
```bash
cd backend
node fix-finished-products-category.js
```

### Issue 2: Products don't appear at all
**Cause**: `currentStock` might be 0 or negative
**Solution**: Check the stock value in database

### Issue 3: Purchases column shows a number (not 0)
**Cause**: Product was purchased before being produced
**Solution**: This is OK, it just means the product existed before production

### Issue 4: Opening stock is wrong
**Cause**: Opening stock wasn't set correctly
**Solution**: Click "Update Opening Stocks" button on inventory page

### Issue 5: Context not refreshing
**Cause**: Frontend cache
**Solution**:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Restart frontend dev server

## Expected Behavior

### In Database:
```javascript
// productSettings/xpTr9II75lmwHpd6FOKs
{
  name: "MUKAMIRA MILK",
  storeCategory: "Finished Products",
  productCategory: "Finished Products",
  currentStock: 10019,
  openingStock: 0,
  // ...
}
```

### In Inventory Page:
```
Tab: Finished Products (2)  ← Should show count

┌─────────────────┬──────────────────┬──────┬──────────┬───────────┬───────┬──────────────┐
│ Product Name    │ Category         │ Unit │ Opening  │ Purchases │ Sales │ Closing Stock│
├─────────────────┼──────────────────┼──────┼──────────┼───────────┼───────┼──────────────┤
│ MUKAMIRA MILK   │ Finished Products│ pcs  │    0     │     0     │   0   │    10,019    │
│ Pinaple Juice   │ Finished Products│ pcs  │    0     │     0     │   0   │   200,500    │
└─────────────────┴──────────────────┴──────┴──────────┴───────────┴───────┴──────────────┘
```

### In Browser Console:
```
📊 Calculating inventory from productSettings: 50
📝 Product: "MUKAMIRA MILK"
   - productCategory (display): "Finished Products"
   - storeCategory (for filtering): "Finished Products"
   - Display as: "Finished Products"
   - Detected type: finished
   ---
📈 Inventory data summary: {
  total: 50,
  raw: 20,
  finished: 2,  ← MUKAMIRA MILK + Pinaple Juice
  other: 28
}
🔍 Finished products: [
  "MUKAMIRA MILK (store: Finished Products)",
  "Pinaple Juice (store: Finished Products)"
]
```

## Quick Test Commands

### 1. Check Database
```bash
cd backend
node check-finished-products.js
```

### 2. Fix Categories
```bash
cd backend
node fix-finished-products-category.js
```

### 3. Check Backend Logs
Look for these messages when completing a cycle:
```
✅ Updated product with storeCategory: Finished Products
✅ Finished good migrated to inventory successfully
```

### 4. Check Frontend
1. Open `http://localhost:5173/stock/inventory`
2. Open DevTools (F12)
3. Click "Finished Products" tab
4. Check console for logs

## Next Steps

1. ✅ Run `node backend/check-finished-products.js` to verify database
2. ✅ Check browser console for filtering logs
3. ✅ Hard refresh the inventory page (Ctrl+Shift+R)
4. ✅ Click "Refresh" button on inventory page
5. ✅ Check if products appear in "All Items" tab first
6. ✅ Then check "Finished Products" tab

## If Still Not Working

Please provide:
1. Screenshot of Firebase Console showing the product document
2. Screenshot of browser console logs
3. Screenshot of inventory page (All Items tab)
4. Output of `node backend/check-finished-products.js`

This will help identify the exact issue!
