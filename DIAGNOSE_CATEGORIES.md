# Diagnose Product Categories

## Step 1: Check Browser Console

1. **Open your inventory page:**
   ```
   http://localhost:5173/stock/inventory
   ```

2. **Open Browser Console** (Press F12)

3. **Look for these logs:**
   ```
   📊 Calculating inventory from productSettings: 10
   Product: Pinaple Juice, Category: "Drink", Type: other
   Product: Orange Juice, Category: "Food", Type: other
   ...
   📈 Inventory data summary: { total: 10, raw: 0, finished: 0, other: 10 }
   ```

## Step 2: Identify the Problem

If you see:
- `Category: "Drink"` → Type: **other** ❌
- `Category: "Food"` → Type: **other** ❌
- `Category: "Equipment"` → Type: **other** ❌

**This means your products don't have "Raw Materials" or "Finished Products" as their category!**

## Step 3: Fix the Categories

### Option A: Update via UI (Recommended)

1. **Go to Product Settings:**
   ```
   http://localhost:5173/stock/product-settings
   ```

2. **For EACH product:**
   - Click the **Edit** button (pencil icon)
   - Scroll to **"Product Category"** dropdown
   - Change from "Drink"/"Food"/etc. to:
     - **"Raw Materials"** (for ingredients)
     - **"Finished Products"** (for produced items)
   - Click **"Update"**

3. **Example Updates:**
   ```
   Pinaple Juice: "Drink" → "Finished Products"
   Orange Juice: "Drink" → "Finished Products"
   Sugar: "Food" → "Raw Materials"
   Flour: "Food" → "Raw Materials"
   ```

### Option B: Quick Database Update

If you have Firebase access:

1. **Open Firebase Console**
2. **Go to Firestore Database**
3. **Open `productSettings` collection**
4. **For each document:**
   - Find field: `productCategory`
   - Change value to: `"Raw Materials"` or `"Finished Products"`
   - Save

## Step 4: Verify the Fix

1. **Refresh inventory page** (Ctrl+R or Cmd+R)

2. **Check console again:**
   ```
   Product: Pinaple Juice, Category: "Finished Products", Type: finished ✓
   Product: Sugar, Category: "Raw Materials", Type: raw ✓
   📈 Inventory data summary: { total: 10, raw: 5, finished: 5, other: 0 }
   ```

3. **Check summary cards:**
   - Raw Materials: **5** (not 0)
   - Finished Products: **5** (not 0)

4. **Click tabs:**
   - "Raw Materials" tab → Should show items
   - "Finished Products" tab → Should show items

## Common Issues

### Issue 1: Category is "Drink" or "Food"
**Problem:** These are retail categories, not production categories
**Solution:** Change to "Raw Materials" or "Finished Products"

### Issue 2: Category field is empty
**Problem:** No category set
**Solution:** Set to "Raw Materials" or "Finished Products"

### Issue 3: Category is "Online" or "Service"
**Problem:** These are store categories, not product categories
**Solution:** Change `productCategory` field (not `storeCategory`)

## Quick Reference

### What Should Categories Be?

| Current Category | Should Be | Reason |
|-----------------|-----------|---------|
| "Drink" | "Finished Products" | If you produce it |
| "Drink" | "Raw Materials" | If you buy it to use in production |
| "Food" | "Finished Products" | If you produce it |
| "Food" | "Raw Materials" | If you buy it to use in production |
| "Equipment" | Leave as is | Not for production |
| "Electronics" | Leave as is | Not for production |

### Examples:

**Finished Products** (things you make/sell):
- Pinaple Juice
- Orange Juice
- Mango Juice
- Packaged Meals
- Baked Goods

**Raw Materials** (things you buy to make products):
- Sugar
- Flour
- Water
- Fruit Pulp
- Packaging Materials

## Test Script

Run this in browser console to see all your categories:

```javascript
// Paste this in browser console on inventory page
const productSettings = JSON.parse(localStorage.getItem('productSettings') || '[]');
console.table(productSettings.map(p => ({
  Name: p.name,
  ProductCategory: p.productCategory,
  StoreCategory: p.storeCategory,
  Status: p.status
})));
```

## Expected Result

After fixing, console should show:

```
Product: Pinaple Juice, Category: "Finished Products", Type: finished
Product: Orange Juice, Category: "Finished Products", Type: finished
Product: Sugar, Category: "Raw Materials", Type: raw
Product: Flour, Category: "Raw Materials", Type: raw
...
📈 Inventory data summary: {
  total: 10,
  raw: 5,
  finished: 5,
  other: 0
}
```

And inventory page should show:
- Raw Materials: **5**
- Finished Products: **5**

## Still Not Working?

If after updating categories you still see 0:

1. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear cache:** Clear browser cache and reload
3. **Check field name:** Must be exactly `productCategory` (case-sensitive)
4. **Check spelling:** Must be exactly "Raw Materials" or "Finished Products"
5. **Share console logs:** Copy the console output and share it

---

**The key is: Your products must have `productCategory` set to exactly "Raw Materials" or "Finished Products"**
