# Inventory Categorization Guide

## Overview
The inventory system now supports proper categorization of items into:
- **Raw Materials** - Items used in production
- **Finished Products** - Items produced from raw materials
- **Other** - Uncategorized items

## How Categories Work

### Automatic Detection
The system automatically detects category types based on the category name:

#### Raw Materials
Category names containing:
- "raw"
- "material"
- "materials"

Examples:
- "Raw Materials"
- "Raw Material"
- "Materials"
- "Raw Ingredients"

#### Finished Products
Category names containing:
- "finished"
- "final"
- "product" (when not combined with "raw")

Examples:
- "Finished Products"
- "Finished Goods"
- "Final Products"
- "Products"

#### Other
Any category that doesn't match the above patterns.

## Setting Up Categories

### For New Items

When creating a new product in Product Settings:

1. **Field**: `productCategory` or `storeCategory`
2. **For Raw Materials**: Enter "Raw Materials"
3. **For Finished Products**: Enter "Finished Products"

### For Existing Items

Update the `productCategory` or `storeCategory` field in your database:

```javascript
// Raw Material Example
{
  id: "item-123",
  name: "Steel Sheets",
  productCategory: "Raw Materials",  // ← Set this
  currentStock: 500,
  costPrice: 1500
}

// Finished Product Example
{
  id: "item-456",
  name: "Pinaple Juice",
  productCategory: "Finished Products",  // ← Set this
  currentStock: 100,
  costPrice: 5000
}
```

## Inventory Page Features

### 1. Summary Cards
Shows counts for:
- Total Items
- Raw Materials
- Finished Products
- Low Stock Items

### 2. Category Tabs
Three tabs for easy filtering:
- **All Items** - Shows everything
- **Raw Materials** - Shows only raw materials
- **Finished Products** - Shows only finished products

### 3. Category Filter
Dropdown to filter by specific category names.

### 4. Visual Indicators
- Raw Materials: Orange/Yellow chip
- Finished Products: Green chip
- Other: Gray chip

## Production Cycle Integration

### Raw Material Selection
When starting a production cycle, the material selector:
- ✅ Shows ONLY raw materials
- ❌ Excludes finished products
- ✅ Includes uncategorized items (for flexibility)

### Logic:
```javascript
// Item is shown if:
- Category contains "raw" OR "material"
- AND does NOT contain "finished" OR "final"
- OR category is empty/uncategorized
```

## Best Practices

### 1. Consistent Naming
Use standard category names:
- "Raw Materials" (recommended)
- "Finished Products" (recommended)

### 2. Categorize All Items
Ensure every item has a category set:
```javascript
// Good
productCategory: "Raw Materials"

// Avoid
productCategory: ""  // Empty
productCategory: null  // Null
```

### 3. Subcategories (Optional)
You can use subcategories:
- "Raw Materials - Metals"
- "Raw Materials - Chemicals"
- "Finished Products - Beverages"
- "Finished Products - Food"

The system will still detect them correctly!

## Database Update Script

If you need to bulk update categories, use this approach:

### Option 1: Via Backend API
```javascript
// Update a product setting
PUT /api/v1/stock/product-settings/:id
{
  "productCategory": "Raw Materials"
}
```

### Option 2: Direct Database Update (Firestore)
```javascript
// In Firebase Console or Admin SDK
const productSettings = db.collection('productSettings');

// Update raw materials
await productSettings
  .where('name', 'in', ['Steel Sheets', 'Aluminum Rods', 'Cotton'])
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      doc.ref.update({ productCategory: 'Raw Materials' });
    });
  });

// Update finished products
await productSettings
  .where('name', 'in', ['Pinaple Juice', 'Orange Juice', 'Mango Juice'])
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      doc.ref.update({ productCategory: 'Finished Products' });
    });
  });
```

## Verification

### Check Inventory Page
1. Go to `http://localhost:5173/stock/inventory`
2. Look at the summary cards:
   - Raw Materials count should be > 0
   - Finished Products count should be > 0
3. Click the "Raw Materials" tab
4. Verify only raw materials are shown
5. Click the "Finished Products" tab
6. Verify only finished products are shown

### Check Production Cycle
1. Go to `http://localhost:5173/stock/production-cycle`
2. Click "Start Cycle"
3. Verify modal shows only raw materials
4. Verify finished products are NOT shown

## Troubleshooting

### Issue: Items not showing in correct tab

**Solution**: Check the category name
```javascript
// Check in browser console
console.log(item.productCategory);
console.log(item.storeCategory);

// Should contain "raw" or "material" for raw materials
// Should contain "finished" or "final" for finished products
```

### Issue: Finished products showing in production cycle

**Solution**: Update category to include "finished"
```javascript
// Change from:
productCategory: "Products"

// To:
productCategory: "Finished Products"
```

### Issue: Raw materials not showing in production cycle

**Solution**: Ensure category contains "raw" or "material"
```javascript
// Change from:
productCategory: "Ingredients"

// To:
productCategory: "Raw Materials"
```

## Example Categories

### Good Category Names

✅ Raw Materials
✅ Raw Material
✅ Materials
✅ Raw Ingredients
✅ Raw Materials - Metals
✅ Raw Materials - Chemicals

✅ Finished Products
✅ Finished Goods
✅ Final Products
✅ Finished Products - Beverages
✅ Finished Products - Food

### Avoid These

❌ "Items" - Too generic
❌ "Stock" - Too generic
❌ "Goods" - Ambiguous
❌ "" - Empty
❌ null - Null

## Summary

1. **Set Categories**: Use "Raw Materials" or "Finished Products"
2. **Check Inventory**: Verify items appear in correct tabs
3. **Test Production**: Ensure only raw materials show in cycle
4. **Be Consistent**: Use standard category names

The system is now smart enough to:
- Automatically categorize based on names
- Filter appropriately in production
- Show clear visual indicators
- Provide easy filtering and navigation
