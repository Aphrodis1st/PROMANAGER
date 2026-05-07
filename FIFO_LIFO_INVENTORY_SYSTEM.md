# FIFO/LIFO Inventory Valuation System

## Overview
This system implements **FIFO (First In First Out)** and **LIFO (Last In First Out)** inventory valuation methods compliant with **IAS 2 - Inventories** accounting standards.

## Features

### 1. Inventory Ledger Tracking
- **Opening Stock**: Records initial inventory with unit costs
- **Purchases**: Tracks each purchase batch with date, quantity, and unit cost
- **Production**: Records finished goods added to inventory
- **Sales**: Consumes inventory using FIFO or LIFO method

### 2. Valuation Methods

#### FIFO (First In First Out)
- Oldest inventory costs are consumed first
- Reflects current market prices in inventory valuation
- Most commonly used method globally
- IAS 2 compliant

#### LIFO (Last In First Out)
- Newest inventory costs are consumed first
- Better matches current costs with revenues
- IAS 2 compliant (though less preferred internationally)

### 3. Cost of Goods Sold (COGS) Calculation
When a sale is made:
1. System identifies available inventory batches
2. Consumes from oldest (FIFO) or newest (LIFO) batches
3. Calculates actual COGS based on consumed batch costs
4. Updates remaining quantities in each batch

## Implementation

### Backend Files Created/Modified

1. **inventoryLedger.model.js** - New model to track inventory batches
   - Records all inventory transactions
   - Tracks remaining quantity per batch
   - Ordered by transaction date

2. **inventoryValuation.service.js** - New service for FIFO/LIFO calculations
   - `consumeStockFIFO()` - Consumes oldest batches first
   - `consumeStockLIFO()` - Consumes newest batches first
   - `getInventoryValueFIFO()` - Calculates current inventory value
   - `getInventoryValueLIFO()` - Calculates current inventory value

3. **sales.controller.js** - Updated to use valuation methods
   - Accepts `valuationMethod` parameter (FIFO/LIFO)
   - Calculates COGS using selected method
   - Returns cost details with sale response

4. **purchase.model.js** - Updated to record in ledger
   - Creates ledger entry for each purchase
   - Records unit cost and quantity

5. **productSetting.model.js** - Updated to record opening stock
   - Creates ledger entry for opening stock
   - Records initial unit cost

6. **finishedGood.model.js** - Updated to record production
   - Creates ledger entry when added to inventory
   - Records production unit cost

7. **inventory.controller.js** - Updated to support valuation methods
   - Accepts `valuationMethod` query parameter
   - Calculates inventory values using FIFO/LIFO
   - Returns valuation method in response

### Frontend Files Modified

1. **InventoryPage.jsx** - Added valuation method selector
   - Dropdown to select FIFO or LIFO
   - Displays valuation method in use
   - Shows accurate inventory values

2. **stock.service.js** - Updated API calls
   - Passes valuation method to backend
   - Supports both FIFO and LIFO requests

## Database Schema

### inventoryLedger Collection
```javascript
{
  id: string,
  productId: string,
  transactionType: 'OPENING' | 'PURCHASE' | 'PRODUCTION' | 'SALE',
  transactionId: string,
  transactionDate: ISO date string,
  quantity: number,
  unitCost: number,
  totalCost: number,
  remainingQuantity: number,
  batchNumber: string (optional),
  expiryDate: ISO date string (optional),
  createdAt: timestamp
}
```

## Usage

### 1. Initialize Existing Inventory
Run the initialization script to populate the ledger with existing data:
```bash
cd backend
initialize-inventory-ledger.bat
```

### 2. Making Sales with FIFO/LIFO
The system automatically uses the selected valuation method when creating sales.

**Frontend**: Select valuation method in Inventory page dropdown

**API Request**:
```javascript
POST /api/v1/stock/sales
{
  "items": [...],
  "valuationMethod": "FIFO" // or "LIFO"
}
```

**Response**:
```javascript
{
  "sale": {...},
  "costDetails": [
    {
      "productId": "...",
      "quantity": 10,
      "costOfGoodsSold": 1500,
      "averageCost": 150
    }
  ],
  "valuationMethod": "FIFO"
}
```

### 3. Viewing Inventory with Valuation
**API Request**:
```
GET /api/v1/stock/inventory/report?date=2024-01-15&valuationMethod=FIFO
```

**Response**:
```javascript
[
  {
    "id": "...",
    "name": "Product A",
    "openingStock": 100,
    "purchasedQty": 50,
    "productionQty": 20,
    "soldQty": 30,
    "closingStock": 140,
    "unitPrice": 125.50,  // Average cost using FIFO
    "closingValue": 17570,
    "valuationMethod": "FIFO"
  }
]
```

## Accounting Standards Compliance

### IAS 2 - Inventories
✅ **Cost Formula**: Implements both FIFO and weighted average (through FIFO/LIFO)
✅ **Measurement**: Inventory valued at lower of cost and net realizable value
✅ **Cost Recognition**: Costs assigned to inventory items on systematic basis
✅ **Disclosure**: Valuation method disclosed in reports

## Benefits

1. **Accurate COGS**: Real cost tracking instead of estimates
2. **Batch Tracking**: Know exactly which batches were sold
3. **Compliance**: Meets IAS 2 accounting standards
4. **Flexibility**: Choose FIFO or LIFO per transaction
5. **Audit Trail**: Complete history of inventory movements
6. **Better Decisions**: Accurate inventory valuation for financial reporting

## Example Scenario

### Initial State
- Opening Stock: 100 units @ $10 = $1,000
- Purchase 1: 50 units @ $12 = $600
- Purchase 2: 30 units @ $15 = $450

### Sale: 120 units

#### Using FIFO:
1. Consume 100 units @ $10 = $1,000
2. Consume 20 units @ $12 = $240
3. **Total COGS**: $1,240
4. **Average Cost**: $10.33/unit
5. **Remaining**: 30 units @ $12 + 30 units @ $15

#### Using LIFO:
1. Consume 30 units @ $15 = $450
2. Consume 50 units @ $12 = $600
3. Consume 40 units @ $10 = $400
4. **Total COGS**: $1,450
5. **Average Cost**: $12.08/unit
6. **Remaining**: 60 units @ $10

## Notes

- FIFO generally results in lower COGS during inflation
- LIFO generally results in higher COGS during inflation
- System prevents negative inventory
- All transactions are reversible
- Batch tracking supports expiry date management
- Compatible with existing inventory system

## Support

For issues or questions, refer to:
- `INVENTORY_MASTER_README.md`
- `INVENTORY_ACCOUNTING_SYSTEM.md`
- Backend logs for transaction details
