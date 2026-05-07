# Production Cycle - Raw Materials Integration Fix

## Problem Statement
The production cycle page was not showing raw materials from the inventory page. When clicking "Start Cycle", the modal displayed "Available Materials: 0" even though the inventory page showed items with stock.

## Root Cause
The `RawMaterialSelector` component was only looking for data in the `purchases` array, but the inventory page displays data from `productSettings`. These are two different data sources that weren't connected.

## Solution Overview
Updated the system to pull materials from multiple data sources in the following priority:
1. **productSettings** (primary inventory - what shows on inventory page)
2. **products** (alternative product storage)
3. **purchases** (purchase records as fallback)

## Files Changed

### 1. `frontend/src/components/prodution/RawMaterialSelector.jsx`
**Changes:**
- ✅ Added imports for `useStock` and `usePurchase` hooks
- ✅ Now pulls from `productSettings`, `products`, and `purchases`
- ✅ Checks for stock in multiple fields: `currentStock`, `openingStock`, `quantity`
- ✅ Checks for price in multiple fields: `costPrice`, `buyingPrice`, `unitPrice`
- ✅ Prevents duplicate materials across sources
- ✅ Added detailed console logging for debugging
- ✅ Enhanced empty state with troubleshooting tips
- ✅ Added source tracking to identify where each material came from

### 2. `frontend/src/context/stockContext.jsx`
**Changes:**
- ✅ Exposed `purchases` array through StockContext
- ✅ Made purchases accessible via `useStock()` hook

### 3. `backend/src/models/stock/purchase.model.js`
**Changes:**
- ✅ Added `adjustStock(id, adjustment)` method
- ✅ Validates stock before adjustment
- ✅ Prevents negative stock

### 4. `backend/src/models/production/productionCycle.model.js`
**Changes:**
- ✅ Fixed `update()` method to properly reference collection

### 5. `frontend/src/context/ProductionContext.jsx`
**Changes:**
- ✅ Removed unnecessary dispense operations
- ✅ Added proper cost summary structure
- ✅ Improved cycle completion mapping

## How It Works Now

### Material Loading Process:
```
1. User clicks "Start Cycle" on approved plan
   ↓
2. RawMaterialSelector component mounts
   ↓
3. Loads materials from three sources:
   - productSettings (inventory items)
   - products (product catalog)
   - purchases (purchase records)
   ↓
4. Filters items with stock > 0
   ↓
5. Removes duplicates (same ID)
   ↓
6. Displays in modal with:
   - Material name
   - Category
   - Available quantity
   - Unit
   - Cost per unit
   ↓
7. User selects materials and quantities
   ↓
8. System validates and starts cycle
```

### Data Structure Mapping:

| Source | Stock Field | Price Field | Name Field |
|--------|------------|-------------|------------|
| productSettings | currentStock, openingStock | costPrice, buyingPrice | name |
| products | quantity, currentStock | buyingPrice, costPrice | name |
| purchases | quantity | unitPrice, buyingPrice | productName, name |

## Debugging Features

### Console Logs
When opening the modal, you'll see:
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
📋 Sample material: { ... }
```

### Empty State Message
If no materials found, shows:
- Clear "No materials available" message
- Troubleshooting checklist
- Instructions to check console logs
- Reminder to verify inventory

## Testing Instructions

### Step 1: Verify Inventory
1. Go to `http://localhost:5173/stock/inventory`
2. Confirm you see items with "Closing Stock" > 0
3. Note the item names

### Step 2: Open Production Cycle
1. Go to `http://localhost:5173/stock/production-cycle`
2. Open browser console (F12)
3. Click "Start Cycle" on an approved plan

### Step 3: Check Console
Look for the console logs showing:
- Data source counts
- Number of items added from each source
- Total materials found

### Step 4: Verify Modal
The modal should now show:
- Same items from inventory page
- Correct quantities
- Correct prices
- Ability to select and enter quantities

### Step 5: Start Cycle
1. Select materials
2. Enter quantities (must be > 0 and ≤ available)
3. Click "Attach & Start Cycle"
4. Verify cycle starts successfully

## Expected Behavior

### ✅ Success Case:
- Modal shows materials from inventory
- Can select and enter quantities
- Cycle starts successfully
- Stock is deducted from inventory
- Cycle appears in "Production Cycles" table

### ❌ Failure Cases & Solutions:

**Case 1: "Available Materials: 0"**
- Check console logs for data source counts
- Verify inventory items have stock > 0
- Ensure items have cost/price set
- Check if data is loading (loading state)

**Case 2: Materials show but can't start cycle**
- Check backend logs for errors
- Verify material IDs are correct
- Ensure backend can find materials
- Check stock adjustment permissions

**Case 3: Wrong quantities shown**
- Verify which field has the stock (currentStock vs openingStock)
- Check if sales/dispenses are deducting correctly
- Review inventory calculation logic

## Database Requirements

For materials to appear, items must have:
```javascript
{
  id: "required",
  name: "required",
  currentStock: > 0,  // OR openingStock > 0, OR quantity > 0
  costPrice: > 0,     // OR buyingPrice > 0, OR unitPrice > 0
  unit: "optional",
  category: "optional"
}
```

## API Endpoints Used

- `GET /api/stock/product-settings` - Loads productSettings
- `GET /api/stock/products` - Loads products
- `GET /api/stock/purchases` - Loads purchases (via stockService.getAll())
- `POST /api/production/cycles/start` - Starts production cycle

## Benefits

1. **Unified Material Source**: Materials from inventory automatically available for production
2. **Multiple Fallbacks**: System checks three sources to find materials
3. **Better Debugging**: Detailed console logs help identify issues
4. **User Guidance**: Clear messages when no materials found
5. **Flexible Data Structure**: Works with different field names and structures

## Future Improvements

1. Add material filtering by category
2. Add search functionality in modal
3. Show material history (recent usage)
4. Add bulk selection options
5. Save material templates for common production plans
6. Add material reservation system
7. Show real-time stock updates

## Support

If materials still don't show after these changes:
1. Check browser console logs
2. Verify inventory page shows items
3. Check network tab for API responses
4. Review backend logs for errors
5. Verify database has items with stock > 0

## Documentation Files Created

1. `PRODUCTION_CYCLE_FIXES.md` - Initial fixes summary
2. `RAW_MATERIALS_TROUBLESHOOTING.md` - Detailed troubleshooting guide
3. `PRODUCTION_CYCLE_INTEGRATION.md` - This file (complete overview)
