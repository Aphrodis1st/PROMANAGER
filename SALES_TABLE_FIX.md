# Sales Table Display Fix

## Problem
The sales table was showing empty columns (displaying "-" for all fields) because:
1. Sales data is stored with an `items` array structure (multi-item sales)
2. The table was trying to display flat fields directly from the sale object
3. The actual product details were nested inside the `items` array

## Example of Sales Data Structure
```javascript
{
  id: "sale123",
  totalPrice: 2283002,
  items: [
    {
      productId: "prod1",
      productName: "Product A",
      quantity: 10,
      unitPrice: 1000,
      totalPrice: 10000,
      // ... other fields
    },
    {
      productId: "prod2",
      productName: "Product B",
      quantity: 5,
      unitPrice: 2000,
      totalPrice: 10000,
      // ... other fields
    }
  ]
}
```

## Solution Implemented

### 1. Data Flattening
Created a `flattenedSales` array that converts multi-item sales into individual rows:

```javascript
const flattenedSales = sales.flatMap(sale => {
  if (sale.items && Array.isArray(sale.items) && sale.items.length > 0) {
    // Multi-item sale - create a row for each item
    return sale.items.map((item, index) => ({
      ...item,
      id: `${sale.id}-${index}`,
      saleId: sale.id,
      productName: item.productName || '-',
      quantity: item.quantity || 0,
      // ... all other fields
    }));
  } else {
    // Single item sale (legacy format)
    return [{
      ...sale,
      productName: sale.productName || '-',
      // ... all other fields
    }];
  }
});
```

### 2. Enhanced Form Data
Updated the form to capture and save all necessary fields:
- `productId` - For stock tracking
- `productName` - For display
- `storeLocation` - From product settings
- `productCategory` - From product settings
- `unit` - From product settings
- All other product details

### 3. Proper Field Mapping
When a product is selected, the form now automatically populates:
```javascript
if (name === 'productId') {
  const selected = productSettings.find((ps) => ps.id === value);
  if (selected) {
    updatedForm = {
      ...updatedForm,
      productName: selected.name,
      storeLocation: selected.mainOrSub || selected.storeLocation,
      productCategory: selected.productCategory || selected.storeCategory,
      qualityGrade: selected.quality,
      tax: selected.tax || 0,
      unit: selected.unit || 'Kg',
    };
  }
}
```

### 4. Complete Item Data on Save
When saving sales, all fields are now included:
```javascript
const itemsForSave = cartItems.map((i) => ({
  productId: i.productId,           // ✅ For stock tracking
  productName: i.productName,       // ✅ For display
  description: i.description,
  quantity: i.quantity,
  unit: i.unit,
  unitPrice: i.unitPrice,
  discount: i.discount,
  tax: i.tax,
  totalPrice: i.totalPrice,
  batchNumber: i.batchNumber,
  expirationDate: i.expirationDate,
  qualityGrade: i.qualityGrade,
  warranty: i.warranty,
  serialNumber: i.serialNumber,
  storeLocation: i.storeLocation,   // ✅ For display
  productCategory: i.productCategory, // ✅ For display
}));
```

## Result

### Before Fix:
```
Item/Service | Desc | Q | Unit | Price | Total
-------------|------|---|------|-------|-------
-            | -    | - | -    | 0.00  | 2,283,002.00
-            | -    | - | -    | 0.00  | 4,000.00
```

### After Fix:
```
Item/Service  | Desc        | Q  | Unit | Price    | Total
--------------|-------------|----|----- |----------|-------------
Product A     | Description | 10 | Kg   | 1,000.00 | 10,000.00
Product B     | Description | 5  | Pcs  | 2,000.00 | 10,000.00
```

## Benefits

1. **Complete Data Display**: All fields now show proper values
2. **Multi-Item Support**: Each item in a sale gets its own row
3. **Stock Tracking**: ProductId is preserved for inventory updates
4. **Better UX**: Users can see all sale details at a glance
5. **Backward Compatible**: Handles both old single-item and new multi-item sales

## Files Modified

1. **SalesPage.jsx**
   - Added data flattening logic
   - Enhanced form state with all fields
   - Updated product selection to populate all fields
   - Improved item saving with complete data

## Testing Checklist

- [x] Create a new sale with multiple items
- [x] Verify all fields display correctly in the table
- [x] Check that stock is properly deducted
- [x] Verify clicking a row navigates to invoice
- [x] Test with legacy single-item sales
- [x] Confirm all fields are saved to database

## Notes

- Each item in a multi-item sale appears as a separate row
- Clicking any row from the same sale navigates to the same invoice
- The flattening happens only for display - the database still stores items as an array
- This approach maintains data integrity while improving UX
