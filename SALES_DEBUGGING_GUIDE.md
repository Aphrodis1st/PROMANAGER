# Sales Page Testing & Debugging Guide

## Current Implementation Status

### ✅ What's Been Fixed:
1. **Data Flattening**: Sales with multiple items are now flattened for table display
2. **Field Mapping**: All fields (productName, description, quantity, unit, etc.) are properly mapped
3. **Form Enhancement**: Product selection auto-populates all fields
4. **Logging**: Comprehensive logging added throughout the flow

### 🔍 How to Debug Empty Columns

#### Step 1: Check Browser Console
Open the browser console (F12) and look for these logs when viewing the sales page:

```
Processing sale: {...}
Item 0: {...}
Flattened items: [...]
Final flattened sales: [...]
```

#### Step 2: Check What's Being Saved
When creating a new sale, check console for:

```
Cart items before save: [...]
Items for save: [...]
Sale data to save: {...}
📥 Adding sale with data: {...}
✅ Sale saved: {...}
✅ Normalized sale: {...}
```

#### Step 3: Verify Backend Logs
Check backend console for:

```
📥 Creating sale with data: {...}
💾 Sale data to save: {...}
✅ Sale created: {...}
💾 [SalesModel] Creating sale with data: {...}
✅ [SalesModel] Sale saved with ID: xxx
```

## Expected Data Structure

### When Creating a Sale:
```javascript
{
  items: [
    {
      productId: "prod123",
      productName: "Product A",
      description: "Description here",
      quantity: 10,
      unit: "Kg",
      unitPrice: 1000,
      discount: 0,
      tax: 18,
      totalPrice: 11800,
      batchNumber: "BATCH001",
      expirationDate: "2024-12-31",
      qualityGrade: "High",
      warranty: "1 year",
      serialNumber: "SN001",
      storeLocation: "Main Store",
      productCategory: "Food"
    }
  ],
  totalPrice: 11800,
  date: "2024-01-15T10:30:00.000Z",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

### When Displaying in Table:
```javascript
{
  id: "sale123-0",
  saleId: "sale123",
  productId: "prod123",
  productName: "Product A",
  description: "Description here",
  quantity: 10,
  unit: "Kg",
  unitPrice: 1000,
  discount: 0,
  totalPrice: 11800,
  batchNumber: "BATCH001",
  expirationDate: "2024-12-31",
  qualityGrade: "High",
  warranty: "1 year",
  serialNumber: "SN001",
  storeLocation: "Main Store",
  productCategory: "Food"
}
```

## Common Issues & Solutions

### Issue 1: All Columns Show "-"
**Cause**: Data is not being flattened properly or items array is empty

**Solution**:
1. Check console: `console.log('Processing sale:', sale)`
2. Verify `sale.items` exists and is an array
3. Check if items have the required fields

**Fix**:
```javascript
// In SalesPage.jsx, verify this code exists:
const flattenedSales = sales.flatMap(sale => {
  if (sale.items && Array.isArray(sale.items) && sale.items.length > 0) {
    return sale.items.map((item, index) => ({
      ...item,
      id: `${sale.id}-${index}`,
      saleId: sale.id,
      productName: item.productName || '-',
      // ... all other fields
    }));
  }
  return [];
});
```

### Issue 2: Some Fields Are Empty
**Cause**: Fields not being saved when creating sale

**Solution**:
1. Check `addToCart` function - verify all fields are included
2. Check `handleSubmit` - verify itemsForSave includes all fields
3. Check product selection - verify auto-population works

**Fix**:
```javascript
// In addToCart function:
const item = {
  productId: form.productId,
  productName: form.productName || 'N/A',
  description: form.description || '',
  unit: form.unit || 'Kg',
  quantity,
  unitPrice,
  discount,
  tax,
  totalPrice,
  batchNumber: form.batchNumber,
  expirationDate: form.expirationDate,
  qualityGrade: form.qualityGrade,
  warranty: form.warranty,
  serialNumber: form.serialNumber,
  storeLocation: form.storeLocation,  // ✅ Must be included
  productCategory: form.productCategory,  // ✅ Must be included
  // ... other fields
};
```

### Issue 3: Product Selection Doesn't Auto-Populate
**Cause**: handleChange not updating all fields

**Solution**:
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

## Testing Checklist

### Before Creating a Sale:
- [ ] At least one product exists in Product Settings
- [ ] Product has a name, unit, and category
- [ ] Account settings are configured (payment & revenue accounts)

### Creating a Sale:
1. [ ] Click "Add" button on Sales page
2. [ ] Select a product from dropdown
3. [ ] Verify fields auto-populate (name, unit, category, etc.)
4. [ ] Enter quantity and unit price
5. [ ] Click "Add to Cart"
6. [ ] Verify cart shows item with all details
7. [ ] Select payment and revenue accounts
8. [ ] Click "Save Sale"
9. [ ] Check console for logs
10. [ ] Verify no errors in console

### After Creating a Sale:
- [ ] Table shows new row with all fields populated
- [ ] Product name is visible (not "-")
- [ ] Quantity, unit, price are correct
- [ ] Store location and category are visible
- [ ] Total price is calculated correctly
- [ ] Stock is reduced in inventory

## Quick Fix Commands

### If Sales Table is Empty:
```javascript
// In browser console:
console.log('Sales data:', sales);
console.log('Flattened sales:', flattenedSales);
```

### If Fields Are Missing:
```javascript
// Check what's in the database:
// Go to Firebase Console > Firestore > sales collection
// Verify the items array has all fields
```

### Force Refresh Sales Data:
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

## Expected Console Output (Success)

### When Creating Sale:
```
Cart items before save: [{productId: "xxx", productName: "Product A", ...}]
Items for save: [{productId: "xxx", productName: "Product A", ...}]
Sale data to save: {items: [...], totalPrice: 11800, ...}
📥 Adding sale with data: {items: [...], totalPrice: 11800}
✅ Sale saved: {id: "sale123", items: [...], totalPrice: 11800}
✅ Normalized sale: {id: "sale123", items: [...], totalPrice: 11800}
```

### When Viewing Sales:
```
Processing sale: {id: "sale123", items: [...], totalPrice: 11800}
Item 0: {productId: "xxx", productName: "Product A", quantity: 10, ...}
Flattened items: [{id: "sale123-0", productName: "Product A", ...}]
Final flattened sales: [{id: "sale123-0", productName: "Product A", ...}]
```

## Next Steps

1. **Test with Real Data**: Create a new sale with all fields filled
2. **Check Console**: Verify all logs show correct data
3. **Verify Table**: Ensure all columns display properly
4. **Test Stock**: Verify inventory decreases correctly
5. **Report Issues**: If still seeing "-", share console logs

## Support

If issues persist:
1. Share browser console logs
2. Share backend console logs
3. Share screenshot of the table
4. Share a sample sale from Firestore
