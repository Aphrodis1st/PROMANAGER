# Professional Tracking Fields Implementation

## Overview
Implement professional tracking for Unit, Batch Number, Expiration Date, Serial Number, Quality Grade, and Warranty across Product Settings → Purchases → Sales → Inventory.

## Implementation Plan

### Phase 1: Product Settings (✅ COMPLETED)
**Location**: `http://localhost:5173/stock/product-settings`

#### Added Fields:
1. **Track Batch Number** (Checkbox)
   - Enable/disable batch tracking
   - Required when purchasing/selling if enabled

2. **Track Serial Number** (Checkbox)
   - Enable/disable serial number tracking
   - Ideal for electronics, equipment

3. **Track Expiry Date** (Checkbox)
   - Enable/disable expiration tracking
   - Essential for food, medicine, perishables

4. **Track Warranty** (Checkbox)
   - Enable/disable warranty tracking
   - For products with guarantees

5. **Default Warranty Period** (Number + Unit)
   - Default warranty duration
   - Units: Days, Months, Years
   - Auto-fills when purchasing

6. **Unit** (Dropdown - Enhanced)
   - Professional units: Piece, Kg, Gram, Liter, Pack, Box, Meter, Bottle, Case, Carton, Dozen
   - Fixed typos (Botle → Bottle, Cas → Case, stal → removed)

#### Database Schema:
```javascript
{
  // Existing fields...
  trackBatchNumber: Boolean,
  trackSerialNumber: Boolean,
  trackExpiryDate: Boolean,
  trackWarranty: Boolean,
  defaultWarrantyPeriod: String,
  defaultWarrantyUnit: String, // "Days", "Months", "Years"
}
```

### Phase 2: Purchases Page (IN PROGRESS)
**Location**: `http://localhost:5173/stock/purchases`

#### Required Changes:

1. **Dynamic Field Requirements**
   - When product selected, check tracking settings
   - Make fields required based on product configuration
   - Show/hide fields dynamically

2. **Field Validation**
```javascript
const validatePurchaseItem = (item, product) => {
  const errors = [];
  
  if (product.trackBatchNumber && !item.batchNumber) {
    errors.push('Batch Number is required for this product');
  }
  
  if (product.trackSerialNumber && !item.serialNumber) {
    errors.push('Serial Number is required for this product');
  }
  
  if (product.trackExpiryDate && !item.expirationDate) {
    errors.push('Expiration Date is required for this product');
  }
  
  if (product.trackWarranty && !item.warranty) {
    errors.push('Warranty information is required for this product');
  }
  
  return errors;
};
```

3. **Auto-Fill Warranty**
```javascript
if (name === 'productId') {
  const selected = productSettings.find((ps) => ps.id === value);
  if (selected) {
    updatedForm = {
      ...updatedForm,
      productName: selected.name,
      unit: selected.unit, // ✅ Use product's unit
      qualityGrade: selected.quality,
      tax: selected.tax || 0,
      // Auto-fill warranty if tracking enabled
      warranty: selected.trackWarranty && selected.defaultWarrantyPeriod
        ? `${selected.defaultWarrantyPeriod} ${selected.defaultWarrantyUnit}`
        : '',
    };
  }
}
```

4. **Visual Indicators**
```jsx
{/* Show required badge for tracked fields */}
<label className='block text-sm font-medium mb-1'>
  Batch Number
  {selectedProduct?.trackBatchNumber && (
    <span className='text-red-500 ml-1'>*</span>
  )}
</label>
```

### Phase 3: Sales Page (IN PROGRESS)
**Location**: `http://localhost:5173/stock/sales`

#### Required Changes:

1. **Inherit from Product Settings**
   - Use product's unit (not hardcoded "Kg")
   - Pre-fill quality grade
   - Show tracking requirements

2. **Field Requirements**
```javascript
const validateSaleItem = (item, product) => {
  const errors = [];
  
  // Same validation as purchases
  if (product.trackBatchNumber && !item.batchNumber) {
    errors.push('Batch Number is required');
  }
  
  // ... other validations
  
  return errors;
};
```

3. **Batch/Serial Selection**
```jsx
{/* If batch tracking enabled, show available batches */}
{selectedProduct?.trackBatchNumber && (
  <FormControl fullWidth>
    <InputLabel>Batch Number *</InputLabel>
    <Select
      name='batchNumber'
      value={form.batchNumber}
      onChange={handleChange}
      required
    >
      <option value=''>Select Batch</option>
      {availableBatches.map((batch) => (
        <option key={batch.number} value={batch.number}>
          {batch.number} (Qty: {batch.quantity}, Expiry: {batch.expiry})
        </option>
      ))}
    </Select>
  </FormControl>
)}
```

### Phase 4: Inventory Page (IN PROGRESS)
**Location**: `http://localhost:5173/stock/inventory`

#### Required Changes:

1. **Batch-Level Tracking**
```javascript
const inventoryByBatch = products.flatMap(product => {
  if (!product.trackBatchNumber) {
    // Regular inventory tracking
    return [{
      productId: product.id,
      productName: product.name,
      openingStock,
      purchases,
      sales,
      closingStock
    }];
  } else {
    // Batch-level tracking
    return batches.map(batch => ({
      productId: product.id,
      productName: product.name,
      batchNumber: batch.number,
      expiryDate: batch.expiry,
      openingStock: batch.openingStock,
      purchases: batch.purchases,
      sales: batch.sales,
      closingStock: batch.closingStock
    }));
  }
});
```

2. **Expiry Alerts**
```jsx
{item.expiryDate && (
  <TableCell>
    <span className={
      isExpiringSoon(item.expiryDate) 
        ? 'text-orange-600 font-bold' 
        : isExpired(item.expiryDate)
        ? 'text-red-600 font-bold'
        : 'text-gray-600'
    }>
      {item.expiryDate}
      {isExpiringSoon(item.expiryDate) && ' ⚠️'}
      {isExpired(item.expiryDate) && ' ❌'}
    </span>
  </TableCell>
)}
```

3. **Serial Number Tracking**
```jsx
{product.trackSerialNumber && (
  <div className='mt-4'>
    <h4 className='font-semibold'>Serial Numbers in Stock:</h4>
    <ul className='text-sm'>
      {serialNumbers.map(sn => (
        <li key={sn.number}>
          {sn.number} - {sn.status} - Purchased: {sn.purchaseDate}
        </li>
      ))}
    </ul>
  </div>
)}
```

## Data Flow

### 1. Product Settings → Purchases
```
User creates product with tracking enabled
    ↓
User creates purchase
    ↓
System checks product.trackBatchNumber
    ↓
If true, Batch Number field becomes required
    ↓
User enters batch number
    ↓
Batch stored with purchase
```

### 2. Purchases → Sales
```
User creates sale
    ↓
System checks product.trackBatchNumber
    ↓
If true, show available batches
    ↓
User selects batch
    ↓
Stock reduced from specific batch
```

### 3. Sales → Inventory
```
Inventory report generated
    ↓
System checks product.trackBatchNumber
    ↓
If true, show batch-level inventory
    ↓
Display: Product → Batch → Quantity → Expiry
```

## Professional Features

### 1. FIFO (First In, First Out)
```javascript
const selectBatchForSale = (product, quantity) => {
  // Get batches sorted by purchase date
  const batches = getBatchesByProduct(product.id)
    .sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
  
  let remaining = quantity;
  const selectedBatches = [];
  
  for (const batch of batches) {
    if (remaining <= 0) break;
    
    const takeQty = Math.min(batch.availableQty, remaining);
    selectedBatches.push({
      batchNumber: batch.number,
      quantity: takeQty
    });
    
    remaining -= takeQty;
  }
  
  return selectedBatches;
};
```

### 2. Expiry Management
```javascript
const getExpiringProducts = (days = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);
  
  return batches.filter(batch => {
    const expiryDate = new Date(batch.expiryDate);
    return expiryDate <= cutoffDate && expiryDate > new Date();
  });
};
```

### 3. Warranty Tracking
```javascript
const getWarrantyStatus = (purchase) => {
  if (!purchase.warranty) return null;
  
  const [duration, unit] = purchase.warranty.split(' ');
  const purchaseDate = new Date(purchase.date);
  const expiryDate = new Date(purchaseDate);
  
  switch(unit) {
    case 'Days':
      expiryDate.setDate(expiryDate.getDate() + parseInt(duration));
      break;
    case 'Months':
      expiryDate.setMonth(expiryDate.getMonth() + parseInt(duration));
      break;
    case 'Years':
      expiryDate.setFullYear(expiryDate.getFullYear() + parseInt(duration));
      break;
  }
  
  const now = new Date();
  const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  return {
    expiryDate,
    daysRemaining,
    isExpired: daysRemaining < 0,
    isExpiringSoon: daysRemaining > 0 && daysRemaining <= 30
  };
};
```

## UI/UX Enhancements

### 1. Required Field Indicators
```jsx
<label className='flex items-center gap-2'>
  Batch Number
  {isRequired && (
    <>
      <span className='text-red-500'>*</span>
      <span className='text-xs text-gray-500'>(Required for this product)</span>
    </>
  )}
</label>
```

### 2. Field Visibility
```jsx
{/* Only show if tracking enabled */}
{selectedProduct?.trackBatchNumber && (
  <div className='col-span-1'>
    <label>Batch Number *</label>
    <input
      name='batchNumber'
      value={form.batchNumber}
      onChange={handleChange}
      required
      className='border w-full p-2 rounded-lg'
    />
  </div>
)}
```

### 3. Validation Messages
```jsx
{errors.batchNumber && (
  <p className='text-red-500 text-xs mt-1'>
    {errors.batchNumber}
  </p>
)}
```

## Implementation Status

- [x] Product Settings - Tracking configuration
- [x] Backend Model - Save tracking settings
- [ ] Purchases - Dynamic field requirements
- [ ] Sales - Batch/Serial selection
- [ ] Inventory - Batch-level tracking
- [ ] Reports - Expiry alerts
- [ ] Warranty - Status tracking

## Next Steps

1. Update Purchases form to respect tracking settings
2. Update Sales form to use product unit and tracking
3. Implement batch selection in Sales
4. Add batch-level inventory tracking
5. Create expiry alert system
6. Implement warranty status tracking

## Testing Checklist

- [ ] Create product with batch tracking
- [ ] Purchase with batch number (required)
- [ ] Sell from specific batch
- [ ] View batch-level inventory
- [ ] Check expiry alerts
- [ ] Verify warranty tracking
- [ ] Test FIFO logic
- [ ] Validate serial number uniqueness
