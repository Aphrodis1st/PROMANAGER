# Selling Price System - Complete Implementation

## Overview
The system now properly manages selling prices from multiple sources and uses them consistently across Inventory, Sales, and Finished Goods pages.

## 🔄 Selling Price Flow

### 1. **Product Settings (Manual Entry)**
- Location: `http://localhost:5173/stock/product-settings`
- Field: `defaultSellingPrice`
- Used for: Products purchased or manually added with opening stock
- Priority: Base selling price

### 2. **Finished Goods Migration (Production)**
- Location: `http://localhost:5173/stock/finished-goods`
- Process: When migrating completed production to inventory
- User sets selling price during migration
- Updates: `ProductSettings.defaultSellingPrice` for that product
- Priority: Overrides base selling price

### 3. **Inventory Report**
- Location: `http://localhost:5173/stock/inventory`
- Backend: `/backend/src/controllers/stock/inventory.controller.js`
- Returns both:
  - `unitPrice`: Average cost (FIFO/LIFO)
  - `sellingPrice`: From ProductSettings.defaultSellingPrice
- Display: Shows both Unit Cost and Selling Price columns

### 4. **Sales Form**
- Location: `http://localhost:5173/stock/sales`
- Price Selection Logic:
  ```javascript
  // Priority order:
  1. inventoryData.sellingPrice (includes finished goods prices)
  2. productSettings.defaultSellingPrice (fallback)
  3. 0 (if nothing set)
  ```
- Shows price source badge: "From Inventory" or "From Settings"

## 📊 Data Structure

### Inventory Data Response
```json
{
  "id": "product123",
  "name": "Product Name",
  "unitPrice": 1500.00,      // Cost (FIFO/LIFO)
  "sellingPrice": 2500.00,   // Selling price
  "currentStock": 100,
  "category": "Finished Products"
}
```

### Product Settings
```json
{
  "id": "product123",
  "name": "Product Name",
  "defaultBuyingPrice": 1500.00,   // Cost
  "defaultSellingPrice": 2500.00,  // Selling price
  "storeCategory": "Finished Products"
}
```

## 🎯 Use Cases

### Case 1: Purchased Raw Material
1. Purchase created → Stock increases
2. Cost recorded in inventory ledger (FIFO/LIFO)
3. Selling price from ProductSettings.defaultSellingPrice
4. Sales form uses this selling price

### Case 2: Opening Stock Product
1. Product created with opening stock
2. defaultBuyingPrice set (cost)
3. defaultSellingPrice set (selling price)
4. Both used in inventory and sales

### Case 3: Finished Goods from Production
1. Production cycle completed
2. Migrate to inventory with selling price (e.g., £2500)
3. Updates ProductSettings.defaultSellingPrice = £2500
4. Inventory shows:
   - Unit Cost: £1500 (from production costs)
   - Selling Price: £2500 (user-set during migration)
5. Sales form automatically uses £2500

## 🔍 Key Features

### Inventory Page
- ✅ Shows Unit Cost (average cost from FIFO/LIFO)
- ✅ Shows Selling Price (from product settings)
- ✅ Selling Price column highlighted in green
- ✅ Supports both raw materials and finished products

### Sales Page
- ✅ Auto-fills selling price from inventory data
- ✅ Shows price source badge
- ✅ Displays in inventory info panel
- ✅ User can override if needed

### Finished Goods Page
- ✅ User sets selling price during migration
- ✅ Updates product settings automatically
- ✅ Creates journal entry with profit margin
- ✅ Marks as migrated to prevent duplicates

## 💡 Professional Features

1. **Price Transparency**
   - Clear distinction between cost and selling price
   - Visual indicators of price source
   - Profit margin visibility

2. **Flexibility**
   - User can override prices in sales form
   - Different prices for different product types
   - Supports both manual and production-based pricing

3. **Consistency**
   - Single source of truth (ProductSettings)
   - Inventory data includes latest prices
   - Sales form always uses correct price

4. **Traceability**
   - Price source clearly indicated
   - Finished goods migration tracked
   - Journal entries record pricing decisions

## 🚀 Testing Checklist

- [ ] Create product with opening stock and selling price
- [ ] Verify inventory shows both cost and selling price
- [ ] Create sale and verify correct price is used
- [ ] Complete production cycle
- [ ] Migrate to inventory with custom selling price
- [ ] Verify inventory shows new selling price
- [ ] Create sale of finished good
- [ ] Verify sale uses migrated selling price (£2500)
- [ ] Check inventory info panel shows "From Inventory"

## 📝 Notes

- Selling prices are always stored in `ProductSettings.defaultSellingPrice`
- Inventory report includes this price in `sellingPrice` field
- Sales form prioritizes inventory data over direct product settings
- This ensures finished goods prices are always used correctly
- System supports FIFO/LIFO for cost tracking while maintaining separate selling prices
