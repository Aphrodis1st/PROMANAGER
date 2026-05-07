# Migration to Inventory - Testing Checklist

## Issue Fixed
The finished goods were not appearing in the inventory because the `storeCategory` field was not set to "Finished Products".

## Changes Made

### 1. completeCycle Function
- Now sets `storeCategory: "Finished Products"` when creating new finished products
- Updates existing products to add `storeCategory: "Finished Products"` if missing

### 2. migrateToInventory Function
- Verifies and updates `storeCategory: "Finished Products"` during migration
- Ensures products are properly categorized for inventory display

## Testing Steps

### Step 1: Complete a Production Cycle
1. Go to production planning
2. Create and approve a plan
3. Start a cycle
4. Complete the cycle with quantity produced
5. ✅ Check backend logs for: "Updated product with storeCategory: Finished Products"

### Step 2: Check Finished Goods Page
1. Navigate to `http://localhost:5173/stock/finished-goods`
2. ✅ Verify the completed cycle appears in the table
3. ✅ Verify the "Date Completed" column shows the date
4. ✅ Verify the inventory icon button is visible (not checkmark)

### Step 3: Migrate to Inventory
1. Click the inventory icon (📦) button
2. Confirm the migration dialog
3. ✅ Wait for success message
4. ✅ Verify icon changes to green checkmark (✅)

### Step 4: Verify in Inventory
1. Navigate to `http://localhost:5173/stock/inventory`
2. ✅ Click on "Finished Products" tab
3. ✅ Verify the product appears in the list
4. ✅ Verify the "Purchases" column shows 0 (not purchased)
5. ✅ Verify the "Closing Stock" shows the produced quantity
6. ✅ Verify the category chip shows "Finished Products" in green

### Step 5: Check Database (Optional)
Open Firebase Console and check:
1. `productSettings` collection
2. Find the finished product
3. ✅ Verify `storeCategory: "Finished Products"`
4. ✅ Verify `productCategory: "Finished Products"`
5. ✅ Verify `currentStock` matches produced quantity

### Step 6: Check Journal Entries
1. Navigate to journals/ledger page
2. ✅ Verify journal entry for production completion
3. ✅ Verify journal entry for migration to inventory

## Expected Results

### Inventory Page Display
```
Tab: Finished Products (X)
┌─────────────────┬──────────────────┬──────┬──────────┬───────────┬───────┬──────────────┬──────────────┬────────┐
│ Product Name    │ Category         │ Unit │ Opening  │ Purchases │ Sales │ Closing Stock│ Reorder Level│ Status │
├─────────────────┼──────────────────┼──────┼──────────┼───────────┼───────┼──────────────┼──────────────┼────────┤
│ MUKAMIRA MILK   │ Finished Products│ pcs  │    0     │     0     │   0   │      20      │      0       │In Stock│
└─────────────────┴──────────────────┴──────┴──────────┴───────────┴───────┴──────────────┴──────────────┴────────┘
```

### Key Points:
- **Purchases = 0**: Because it was produced, not purchased
- **Closing Stock = Produced Qty**: Shows the quantity from production
- **Category = Finished Products**: Green chip
- **Tab = Finished Products**: Appears in the correct tab

## Troubleshooting

### If product still doesn't appear in inventory:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in console
   - Check Network tab for API responses

2. **Check Backend Logs**
   - Look for "Updated product with storeCategory: Finished Products"
   - Verify no errors during migration

3. **Refresh Inventory Page**
   - Click the "Refresh" button on inventory page
   - Or reload the page (F5)

4. **Check Product Settings**
   - Go to product settings page
   - Find the finished product
   - Verify storeCategory is set

5. **Manual Fix (if needed)**
   - Go to product settings
   - Edit the finished product
   - Set "Store Category" to "Finished Products"
   - Save and refresh inventory

### If migration button doesn't work:

1. Check browser console for errors
2. Verify backend is running
3. Check network tab for failed requests
4. Verify the cycle is completed (status = "completed")
5. Check if already migrated (green checkmark)

## Database Schema

### productSettings Collection
```javascript
{
  id: "abc123",
  name: "MUKAMIRA MILK",
  storeCategory: "Finished Products",  // ← CRITICAL FIELD
  productCategory: "Finished Products", // ← DISPLAY FIELD
  currentStock: 20,
  openingStock: 0,
  type: "Product",
  status: "Active",
  // ... other fields
}
```

### finishedGoods Collection
```javascript
{
  id: "xyz789",
  cycleId: "cycle123",
  productId: "abc123",
  productName: "MUKAMIRA MILK",
  quantityProduced: 20,
  addedToInventory: true,  // ← Set during migration
  migratedAt: Timestamp,   // ← Set during migration
  // ... other fields
}
```

## Success Criteria

✅ Product appears in "Finished Products" tab of inventory
✅ Purchases column shows 0 (not purchased)
✅ Closing stock shows produced quantity
✅ Category chip shows "Finished Products" in green
✅ Migration button changes to checkmark after migration
✅ Cannot migrate the same product twice
✅ Journal entries are created correctly

## Notes

- The stock quantity is added during cycle completion
- Migration is primarily for marking as "available for sale"
- The `storeCategory` field determines which tab the product appears in
- Products without `storeCategory` may appear in "All Items" but not in specific tabs
