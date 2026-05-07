# Backend Fix - ProductSettings Integration

## Issue
Backend was returning 400 error when starting production cycle:
```
❌ Product not found in products or purchases: Pinaple Juice
```

Even though "Pinaple Juice" exists in the inventory (productSettings collection).

## Root Cause
The production controller was only checking two collections:
1. `products` collection
2. `purchases` collection

But it was NOT checking `productSettings` collection, which is where inventory items are stored.

## Solution
Updated the backend to check THREE collections in priority order:
1. **productSettings** (inventory - PRIMARY)
2. **products** (product catalog)
3. **purchases** (purchase records)

## Files Changed

### 1. `backend/src/models/stock/productSetting.model.js`
**Added Methods:**
```javascript
// Adjust stock for production consumption
async adjustStock(id, adjustment) {
  // Validates stock before adjustment
  // Prevents negative stock
  // Updates currentStock field
}

// Alias for consistency with other models
async findById(id) {
  return this.getById(id);
}
```

### 2. `backend/src/controllers/production/production.controller.js`

#### Import Added:
```javascript
import { ProductSettingModel } from "../../models/stock/productSetting.model.js";
```

#### startCycle() Updated:
Now checks materials in this order:
```javascript
// 1. Try productSettings (inventory)
product = await ProductSettingModel.findById(materialId);

// 2. Try products
if (!product) {
  product = await ProductModel.findById(materialId);
}

// 3. Try purchases
if (!product) {
  product = await PurchaseModel.findById(materialId);
}
```

Then adjusts stock based on source:
```javascript
if (source === "productSettings") {
  await ProductSettingModel.adjustStock(id, -qtyUsed);
} else if (source === "product") {
  await ProductModel.adjustStock(id, -qtyUsed);
} else if (source === "purchase") {
  await PurchaseModel.adjustStock(id, -qtyUsed);
}
```

#### completeCycle() Updated:
Now checks finished product in this order:
```javascript
// 1. Try productSettings
finishedProduct = await ProductSettingModel.findById(finishedProductId);

// 2. Try products
if (!finishedProduct) {
  finishedProduct = await ProductModel.findById(finishedProductId);
}

// 3. Create in productSettings if not found
if (!finishedProduct) {
  finishedProduct = await ProductSettingModel.create({...});
}
```

## How It Works Now

### Starting a Production Cycle:

```
1. Frontend sends materials from inventory
   ↓
2. Backend receives consumedMaterials array
   ↓
3. For each material:
   a. Check productSettings (inventory) ✓
   b. If not found, check products
   c. If not found, check purchases
   d. If not found, return 400 error
   ↓
4. Adjust stock in the source collection
   ↓
5. Create material consumption record
   ↓
6. Create production cycle
   ↓
7. Return success
```

### Completing a Production Cycle:

```
1. Frontend sends produced quantity
   ↓
2. Backend fetches cycle and plan
   ↓
3. Find finished product:
   a. Check productSettings ✓
   b. If not found, check products
   c. If not found, create in productSettings
   ↓
4. Calculate costs (material + labor + overhead)
   ↓
5. Adjust finished product stock (+producedQty)
   ↓
6. Create finished goods record
   ↓
7. Create journal entry
   ↓
8. Update cycle status to "completed"
   ↓
9. Return success
```

## Error Handling

### Better Error Messages:
```javascript
// Before:
"Raw material X not found in products or purchases"

// After:
"Raw material X not found in inventory, products, or purchases"
```

### Stock Validation:
```javascript
// Catches insufficient stock errors
try {
  await ProductSettingModel.adjustStock(id, -qtyUsed);
} catch (stockError) {
  return res.status(400).json({
    error: `Insufficient stock for ${name}. ${stockError.message}`
  });
}
```

## Console Logs Added

For debugging, the backend now logs:
```
✅ Found in productSettings: Pinaple Juice
Quantity to use: 1000, Source: productSettings
Adjusting stock in productSettings for Pinaple Juice
```

## Testing

### Test Case 1: Material from Inventory
```
Material: "Pinaple Juice"
Location: productSettings collection
Expected: ✅ Found and stock adjusted
```

### Test Case 2: Material from Products
```
Material: "Steel Rods"
Location: products collection
Expected: ✅ Found and stock adjusted
```

### Test Case 3: Material from Purchases
```
Material: "Raw Cotton"
Location: purchases collection
Expected: ✅ Found and stock adjusted
```

### Test Case 4: Material Not Found
```
Material: "Non-existent Item"
Location: None
Expected: ❌ 400 error with clear message
```

## Database Collections

### productSettings (Inventory):
```javascript
{
  id: "XCKfwYamKc5b9a3y96Q1",
  name: "Pinaple Juice",
  currentStock: 1000,
  openingStock: 1000,
  defaultBuyingPrice: 500,
  costPrice: 500,
  unit: "liters",
  type: "Product",
  status: "Active"
}
```

### products:
```javascript
{
  id: "prod-123",
  name: "Steel Rods",
  currentStock: 500,
  costPrice: 1500,
  unit: "kg"
}
```

### purchases:
```javascript
{
  id: "purchase-456",
  productId: "prod-789",
  productName: "Raw Cotton",
  quantity: 200,
  unitPrice: 800
}
```

## Benefits

1. ✅ **Unified Inventory**: Materials from inventory page now work in production
2. ✅ **Multiple Sources**: System checks all possible locations
3. ✅ **Better Errors**: Clear messages when materials not found
4. ✅ **Stock Validation**: Prevents negative stock
5. ✅ **Flexible**: Works with different data structures
6. ✅ **Debugging**: Detailed console logs

## Migration Notes

No database migration needed. The system now works with existing data in all three collections.

## Next Steps

1. Test starting a production cycle with inventory items
2. Verify stock is deducted correctly
3. Test completing a cycle
4. Verify finished product stock is added
5. Check journal entries are created

## Rollback Plan

If issues occur, the changes are backward compatible. The system will still work with products and purchases collections as before.
