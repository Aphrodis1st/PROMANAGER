# Professional Inventory & Accounting System
## International Accounting Standards (IAS 2) Compliant

---

## 📊 System Overview

This system implements a **professional inventory management system** that follows **International Accounting Standards (IAS 2 - Inventories)** and integrates seamlessly with production, sales, and purchases.

---

## 🔄 Inventory Flow

### 1. **PURCHASES → INCREASE INVENTORY** ✅
- **Standard**: IAS 2 - Inventory Recognition
- **Action**: When a purchase is made, inventory increases
- **Location**: `backend/src/models/stock/purchase.model.js`
- **Process**:
  ```javascript
  // Purchase increases inventory
  await ProductSettingModel.updateStock(productId, +quantity);
  ```

### 2. **SALES → DECREASE INVENTORY** ✅
- **Standard**: IAS 2 - Inventory Derecognition
- **Action**: When a sale is made, inventory decreases
- **Location**: `backend/src/controllers/stock/sales.controller.js`
- **Process**:
  ```javascript
  // Sale reduces inventory
  await ProductSettingModel.updateStock(productId, -quantity);
  ```
- **Safety**: If insufficient stock, sale is rolled back

### 3. **PRODUCTION → INCREASE FINISHED GOODS** ✅
- **Standard**: IAS 2 - Production Inventory
- **Action**: When production completes, finished goods inventory increases
- **Location**: `backend/src/controllers/production/production.controller.js`
- **Process**:
  ```javascript
  // Production increases finished goods inventory
  await ProductSettingModel.adjustStock(finishedProductId, +producedQty);
  ```

### 4. **PRODUCTION → DECREASE RAW MATERIALS** ✅
- **Standard**: IAS 2 - Material Consumption
- **Action**: When production starts, raw materials inventory decreases
- **Location**: `backend/src/controllers/production/production.controller.js`
- **Process**:
  ```javascript
  // Production consumes raw materials
  await ProductSettingModel.adjustStock(rawMaterialId, -consumedQty);
  ```

---

## 📁 Key Files & Locations

### Backend Controllers
1. **Sales Controller**: `backend/src/controllers/stock/sales.controller.js`
   - Creates sales and reduces inventory
   - Validates stock availability
   - Rolls back on insufficient stock

2. **Purchase Controller**: `backend/src/controllers/stock/purchase.controller.js`
   - Creates purchases and increases inventory
   - Records tax transactions

3. **Production Controller**: `backend/src/controllers/production/production.controller.js`
   - Manages production cycles
   - Consumes raw materials
   - Produces finished goods
   - Migrates finished goods to inventory

4. **Inventory Controller**: `backend/src/controllers/stock/inventory.controller.js`
   - Generates inventory reports
   - Calculates opening/closing stock
   - Tracks purchases, sales, and production

### Backend Models
1. **Sales Model**: `backend/src/models/stock/sales.model.js`
   - Handles sale creation and deletion
   - Reverses inventory on sale deletion

2. **Purchase Model**: `backend/src/models/stock/purchase.model.js`
   - Handles purchase creation and deletion
   - Reverses inventory on purchase deletion

3. **Product Setting Model**: `backend/src/models/stock/productSetting.model.js`
   - Core inventory management
   - `updateStock()` - Adjusts inventory levels
   - `adjustStock()` - Production-specific adjustments

4. **Finished Good Model**: `backend/src/models/production/finishedGood.model.js`
   - Tracks finished goods from production
   - Marks when added to inventory

### Frontend Pages
1. **Inventory Page**: `frontend/src/pages/stock/InventoryPage.jsx`
   - Displays real-time inventory levels
   - Shows opening stock, purchases, production, sales, closing stock
   - Categorizes Raw Materials vs Finished Products
   - Professional dashboard with summary cards

2. **Sales Page**: `frontend/src/pages/stock/SalesPage.jsx`
   - Creates sales with inventory validation
   - Shows available stock before sale
   - Prevents sales when out of stock
   - Multi-item cart system

3. **Purchases Page**: `frontend/src/pages/stock/PurchasesPage.jsx`
   - Creates purchases with invoice management
   - Supplier management
   - Payment processing
   - Inventory account tracking

---

## 🎯 Inventory Categories

### Raw Materials
- **Store Category**: "Raw Materials" or "Raw Material"
- **Purpose**: Materials used in production
- **Flow**: Purchase → Production (consumed) → Finished Goods

### Finished Products
- **Store Category**: "Finished Products" or "Finished Goods"
- **Purpose**: Products ready for sale
- **Flow**: Production → Inventory → Sales

---

## 📈 Inventory Report Structure

### Opening Stock
- Stock at the beginning of the period
- Set manually or carried forward from previous closing

### Purchases
- All purchases made during the period
- Increases inventory

### Production
- Finished goods produced during the period
- Increases finished goods inventory
- Decreases raw materials inventory

### Sales
- All sales made during the period
- Decreases inventory

### Closing Stock
- **Formula**: `Opening + Purchases + Production - Sales - Damaged`
- Stock at the end of the period
- Becomes next period's opening stock

---

## 🔐 Professional Accounting Standards

### IAS 2 - Inventories
1. **Recognition**: Inventory is recognized when control is obtained
2. **Measurement**: Lower of cost and net realizable value
3. **Cost Formula**: FIFO or weighted average
4. **Disclosure**: Accounting policies, carrying amounts, amounts recognized as expense

### IAS 12 - Income Taxes
- Tax transactions recorded for all sales and purchases
- Separate tracking of taxable amounts and tax amounts

### Journal Entries
All inventory movements create proper journal entries:

#### Purchase Entry
```
Dr. Inventory Account          XXX
Dr. Tax Receivable (if applicable)  XXX
    Cr. Accounts Payable           XXX
```

#### Sale Entry
```
Dr. Accounts Receivable        XXX
    Cr. Revenue Account            XXX
    Cr. Tax Payable (if applicable) XXX

Dr. Cost of Goods Sold         XXX
    Cr. Inventory Account          XXX
```

#### Production Entry
```
Dr. Finished Goods Inventory   XXX
    Cr. Raw Materials Inventory    XXX
    Cr. Labor Cost                 XXX
    Cr. Overhead Cost              XXX
```

---

## 🚀 API Endpoints

### Inventory
- `GET /api/stock/inventory/report?date=YYYY-MM-DD` - Get inventory report
- `POST /api/stock/inventory/update-opening-stocks` - Update opening stocks

### Sales
- `POST /api/stock/sales` - Create sale (reduces inventory)
- `GET /api/stock/sales` - Get all sales
- `GET /api/stock/sales/:id` - Get sale by ID
- `DELETE /api/stock/sales/:id` - Delete sale (reverses inventory)

### Purchases
- `POST /api/stock/purchases` - Create purchase (increases inventory)
- `GET /api/stock/purchases` - Get all purchases
- `GET /api/stock/purchases/:id` - Get purchase by ID
- `DELETE /api/stock/purchases/:id` - Delete purchase (reverses inventory)

### Production
- `POST /api/production/cycles/start` - Start production (consumes raw materials)
- `POST /api/production/cycles/complete` - Complete production (creates finished goods)
- `POST /api/production/migrate-to-inventory` - Migrate finished goods to inventory

---

## ✅ Validation & Safety

### Stock Validation
- Sales cannot proceed if insufficient stock
- Production cannot start if insufficient raw materials
- Real-time stock checks before any transaction

### Transaction Rollback
- If inventory update fails, transaction is rolled back
- Ensures data consistency
- Prevents negative inventory

### Audit Trail
- All inventory movements are logged
- Timestamps on all transactions
- Full traceability from purchase to sale

---

## 📊 Dashboard Features

### Summary Cards
- Total Items
- Raw Materials Count
- Finished Products Count
- Low Stock Items
- Total Inventory Value

### Filters
- Date range selection
- Category filtering (All, Raw Materials, Finished Products)
- Specific category filtering

### Professional Display
- Color-coded categories
- Status indicators (In Stock, Low Stock, Out of Stock)
- Real-time calculations
- Export capabilities

---

## 🔧 Configuration

### Product Settings
Each product must have:
- `storeCategory`: "Raw Materials" or "Finished Products"
- `productCategory`: Specific category name
- `openingStock`: Initial stock quantity
- `currentStock`: Current stock quantity (auto-calculated)
- `reorderLevel`: Minimum stock level before alert
- `defaultBuyingPrice`: Cost per unit
- `defaultSellingPrice`: Selling price per unit

### Inventory Accounts
- Raw Materials Inventory Account
- Finished Goods Inventory Account
- Cost of Goods Sold Account
- Revenue Account

---

## 📝 Best Practices

1. **Regular Stock Takes**: Update opening stocks at period end
2. **Category Management**: Properly categorize all products
3. **Reorder Levels**: Set appropriate reorder levels
4. **Price Updates**: Keep buying/selling prices current
5. **Audit Reviews**: Regular review of inventory movements
6. **Reconciliation**: Monthly inventory reconciliation
7. **Documentation**: Maintain proper documentation for all transactions

---

## 🎓 Training Notes

### For Stock Managers
- Monitor low stock alerts daily
- Update opening stocks monthly
- Review inventory reports weekly
- Verify physical stock quarterly

### For Sales Team
- Check stock availability before confirming orders
- Use the inventory display in sales form
- Report discrepancies immediately

### For Production Team
- Verify raw material availability before starting production
- Record actual quantities consumed
- Report finished goods immediately upon completion

### For Accountants
- Review journal entries monthly
- Reconcile inventory accounts
- Verify cost calculations
- Prepare inventory valuation reports

---

## 🔗 Integration Points

### With Sales System
- Real-time stock validation
- Automatic inventory reduction
- Revenue recognition
- Tax calculation

### With Purchase System
- Automatic inventory increase
- Supplier invoice management
- Payment tracking
- Tax recording

### With Production System
- Raw material consumption
- Finished goods creation
- Cost allocation
- Work-in-progress tracking

### With Accounting System
- Automatic journal entries
- Chart of accounts integration
- Financial reporting
- Tax compliance

---

## 📞 Support & Maintenance

### Monitoring
- Daily: Stock levels, low stock alerts
- Weekly: Inventory movements, discrepancies
- Monthly: Inventory valuation, reconciliation
- Quarterly: Physical stock verification

### Troubleshooting
- Check logs for inventory update errors
- Verify product settings are correct
- Ensure proper category assignment
- Review transaction timestamps

---

## 🎯 Success Metrics

1. **Inventory Accuracy**: >99% match with physical stock
2. **Stock Availability**: <1% stockouts
3. **Turnover Rate**: Optimal inventory turnover
4. **Cost Control**: Accurate cost tracking
5. **Compliance**: 100% IAS 2 compliance

---

**System Status**: ✅ Fully Operational & IAS 2 Compliant

**Last Updated**: 2024
**Version**: 1.0.0
**Compliance**: IAS 2, IAS 12, IFRS Standards
