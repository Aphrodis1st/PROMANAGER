# Fix Product Categories - Quick Guide

## Problem
Your inventory shows:
- Raw Materials: 0
- Finished Products: 0

But you have 10 items total. This means your products don't have the correct categories set.

## Solution: Update Product Categories

### Option 1: Update via Product Settings Page (Recommended)

1. **Go to Product Settings**
   ```
   http://localhost:5173/stock/product-settings
   ```

2. **For Each Product:**
   - Click "Edit" button
   - Find "Product Category" dropdown
   - Select:
     - **"Raw Materials"** - for items used in production
     - **"Finished Products"** - for items you produce/sell
   - Click "Update"

3. **Examples:**
   - Pinaple Juice → **Finished Products**
   - Sugar → **Raw Materials**
   - Flour → **Raw Materials**
   - Orange Juice → **Finished Products**

### Option 2: Bulk Update via Database (Advanced)

If you have many products, you can update them directly in Firestore:

#### Step 1: Open Firebase Console
```
https://console.firebase.google.com
```

#### Step 2: Navigate to Firestore
```
Firestore Database → productSettings collection
```

#### Step 3: Update Each Document
For each product:
1. Click on the document
2. Find or add field: `productCategory`
3. Set value to: `"Raw Materials"` or `"Finished Products"`
4. Save

### Option 3: Use Firebase Admin SDK Script

Create a script to bulk update:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateCategories() {
  // Update Raw Materials
  const rawMaterials = ['Sugar', 'Flour', 'Salt', 'Water'];
  for (const name of rawMaterials) {
    const snapshot = await db.collection('productSettings')
      .where('name', '==', name)
      .get();
    
    snapshot.forEach(async (doc) => {
      await doc.ref.update({
        productCategory: 'Raw Materials'
      });
      console.log(`✅ Updated ${name} to Raw Materials`);
    });
  }

  // Update Finished Products
  const finishedProducts = ['Pinaple Juice', 'Orange Juice', 'Mango Juice'];
  for (const name of finishedProducts) {
    const snapshot = await db.collection('productSettings')
      .where('name', '==', name)
      .get();
    
    snapshot.forEach(async (doc) => {
      await doc.ref.update({
        productCategory: 'Finished Products'
      });
      console.log(`✅ Updated ${name} to Finished Products`);
    });
  }
}

updateCategories();
```

## Verification

After updating, check the inventory page:

1. **Go to Inventory**
   ```
   http://localhost:5173/stock/inventory
   ```

2. **Check Summary Cards**
   - Raw Materials: Should show count > 0
   - Finished Products: Should show count > 0

3. **Click Tabs**
   - Click "Raw Materials" tab → Should show your raw materials
   - Click "Finished Products" tab → Should show your finished products

4. **Test Production Cycle**
   ```
   http://localhost:5173/stock/production-cycle
   ```
   - Click "Start Cycle"
   - Should show only raw materials
   - Should NOT show finished products

## Category Guidelines

### Raw Materials
Items you BUY to use in production:
- ✅ Sugar
- ✅ Flour
- ✅ Salt
- ✅ Water
- ✅ Steel
- ✅ Cotton
- ✅ Chemicals
- ✅ Ingredients

### Finished Products
Items you PRODUCE or SELL:
- ✅ Pinaple Juice
- ✅ Orange Juice
- ✅ Furniture
- ✅ Clothing
- ✅ Packaged Goods
- ✅ Manufactured Items

### Other Categories
For retail or service items:
- Food (retail)
- Drink (retail)
- Equipment
- Electronics
- Services

## New Products

When creating new products:

1. **Go to Product Settings**
2. **Click "Add Product"**
3. **Select Product Category:**
   - First option: "Raw Materials" ✓
   - Second option: "Finished Products" ✓
4. **Fill other details**
5. **Save**

## Quick Test

After updating categories:

```
1. Open Inventory → See summary cards updated
2. Click "Raw Materials" tab → See your raw materials
3. Click "Finished Products" tab → See your finished products
4. Open Production Cycle → Click "Start Cycle"
5. Verify modal shows only raw materials
```

## Common Mistakes

❌ **Wrong:**
- productCategory: "Drink" (for raw material)
- productCategory: "Food" (for raw material)
- productCategory: "" (empty)

✅ **Correct:**
- productCategory: "Raw Materials" (for ingredients)
- productCategory: "Finished Products" (for produced items)

## Need Help?

If categories still don't show:

1. **Check Browser Console** (F12)
   - Look for errors
   - Check data loading

2. **Verify Database**
   - Open Firestore
   - Check productSettings collection
   - Verify productCategory field exists

3. **Refresh Page**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Check Field Name**
   - Must be exactly: `productCategory`
   - Case sensitive!
   - Not: `category`, `product_category`, or `ProductCategory`

## Summary

1. ✅ Update product categories to "Raw Materials" or "Finished Products"
2. ✅ Verify in inventory page (summary cards should update)
3. ✅ Test production cycle (should show only raw materials)
4. ✅ For new products, select correct category from dropdown

---

**After updating, your inventory will properly categorize items and production cycles will work correctly!**
