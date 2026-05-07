# Raw Materials Not Showing - Troubleshooting Guide

## Issue
When clicking "Start Cycle" on the production cycle page, the modal shows:
- "Available Materials: 0"
- "No materials available"

Even though the inventory page (`http://localhost:5173/stock/inventory`) shows items with stock.

## Root Cause Analysis

The RawMaterialSelector component was only looking at the `purchases` array, but your inventory data is stored in `productSettings` (which is what the inventory page displays).

## Changes Made

### 1. Updated RawMaterialSelector Component
**File**: `frontend/src/components/prodution/RawMaterialSelector.jsx`

Now pulls materials from THREE sources (in order of priority):
1. **productSettings** - Main inventory items (what shows on inventory page)
2. **products** - Alternative product storage
3. **purchases** - Purchase records (fallback)

### 2. Updated StockContext
**File**: `frontend/src/context/stockContext.jsx`

Exposed `purchases` array through the StockContext for easier access.

## How to Debug

### Step 1: Open Browser Console
1. Navigate to `http://localhost:5173/stock/production-cycle`
2. Open browser DevTools (F12)
3. Go to Console tab

### Step 2: Click "Start Cycle"
When you click "Start Cycle" on any approved plan, you should see console logs like:

```
🔍 RawMaterialSelector - Data sources: {
  productSettings: 5,
  products: 3,
  purchases: 2
}
📦 Processing productSettings...
✅ Added 5 items from productSettings
📦 Processing products...
✅ Added 0 items from products
📦 Processing purchases...
✅ Added 0 items from purchases
🎯 Total raw materials found: 5
📋 Sample material: { id: "...", name: "...", available: 10, ... }
```

### Step 3: Check What Data You Have

#### Check ProductSettings (Inventory):
```javascript
// In browser console:
// This should show your inventory items
console.log('ProductSettings:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
```

Or add this temporarily to your code:
```javascript
console.log('📊 ProductSettings:', productSettings);
console.log('📊 Products:', products);
console.log('📊 Purchases:', purchases);
```

## Common Issues & Solutions

### Issue 1: "Available Materials: 0" but inventory shows items

**Possible Causes:**
1. Items have `currentStock: 0` or `openingStock: 0`
2. Items don't have `costPrice` or `buyingPrice` set
3. Data structure is different than expected

**Solution:**
Check your inventory items in the database. Each item should have:
```javascript
{
  id: "some-id",
  name: "Material Name",
  currentStock: 10,  // or openingStock: 10
  costPrice: 100,    // or buyingPrice: 100
  unit: "kg",
  productCategory: "Raw Materials"
}
```

### Issue 2: Console shows "productSettings: 0"

**Possible Causes:**
1. Data not loaded yet (loading state)
2. Backend not returning productSettings
3. Different collection name in database

**Solution:**
1. Check if inventory page loads correctly
2. Check network tab for API calls
3. Verify backend endpoint: `/api/stock/product-settings`

### Issue 3: Materials show but can't start cycle

**Possible Causes:**
1. Backend can't find the material by ID
2. Stock adjustment fails
3. Missing required fields

**Solution:**
Check backend logs for errors when starting cycle.

## Testing Checklist

- [ ] Open `http://localhost:5173/stock/inventory`
- [ ] Verify you see items with stock > 0
- [ ] Note the item names and quantities
- [ ] Open browser console (F12)
- [ ] Navigate to `http://localhost:5173/stock/production-cycle`
- [ ] Click "Start Cycle" on an approved plan
- [ ] Check console logs for data source counts
- [ ] Verify modal shows the same items from inventory
- [ ] Select materials and enter quantities
- [ ] Click "Attach & Start Cycle"
- [ ] Verify cycle starts successfully

## Quick Fix: Add Test Data

If you need to add test inventory items, you can:

1. Go to inventory/product settings page
2. Add a new product with:
   - Name: "Test Raw Material"
   - Current Stock: 100
   - Cost Price: 50
   - Unit: "kg"
   - Category: "Raw Materials"

3. Save and try starting a production cycle again

## Database Structure Expected

### ProductSettings Collection:
```javascript
{
  id: "prod-123",
  name: "Steel Sheets",
  currentStock: 500,
  openingStock: 450,
  costPrice: 1500,
  buyingPrice: 1500,
  unit: "kg",
  productCategory: "Raw Materials",
  storeCategory: "Materials"
}
```

### Products Collection:
```javascript
{
  id: "prod-456",
  name: "Aluminum Rods",
  quantity: 200,
  currentStock: 200,
  buyingPrice: 800,
  costPrice: 800,
  unit: "pcs",
  category: "Raw Materials"
}
```

### Purchases Collection:
```javascript
{
  id: "purchase-789",
  productId: "prod-123",
  productName: "Steel Sheets",
  quantity: 100,
  unitPrice: 1500,
  unit: "kg",
  storeCategory: "Raw Materials"
}
```

## Next Steps

1. **Check Console Logs**: Open the modal and check what the console says
2. **Verify Data**: Make sure your inventory items have stock > 0
3. **Test with Sample Data**: Add a test item if needed
4. **Report Back**: Share the console logs if still not working

## Contact Points

If materials still don't show:
1. Share the console logs from browser DevTools
2. Share a screenshot of your inventory page
3. Share the network response from `/api/stock/product-settings`
