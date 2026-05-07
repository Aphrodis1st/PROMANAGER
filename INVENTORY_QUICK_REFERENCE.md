# Inventory System - Quick Reference Guide

## 🌐 Frontend Routes

### Main Inventory Pages
```
http://localhost:5173/stock/inventory        → Inventory Report & Dashboard
http://localhost:5173/stock/sales            → Sales Management
http://localhost:5173/stock/purchases        → Purchase Management
http://localhost:5173/stock/finished-goods   → Finished Goods (via Production)
```

### Navigation Path
```
Stock Dashboard → Inventory
Stock Dashboard → Sales
Stock Dashboard → Purchases
Production Dashboard → Finished Goods
```

---

## 📊 Inventory Page Features

### URL
`http://localhost:5173/stock/inventory`

### What You'll See
1. **Summary Cards**
   - Total Items
   - Raw Materials Count
   - Finished Products Count
   - Low Stock Items
   - Total Inventory Value

2. **Tabs**
   - All Items
   - Raw Materials
   - Finished Products

3. **Inventory Table**
   - Product Name
   - Category
   - Unit
   - Opening Stock
   - Purchases (+)
   - Production (+)
   - Sales (-)
   - Closing Stock
   - Reorder Level
   - Unit Price
   - Total Value
   - Status

4. **Actions**
   - Refresh Report
   - Update Opening Stocks
   - Filter by Date
   - Filter by Category

---

## 💰 Sales Page Features

### URL
`http://localhost:5173/stock/sales`

### What You'll See
1. **Sales Form**
   - Product Selection
   - **Real-time Inventory Display** (Professional)
     - Opening Stock
     - Purchases
     - Production
     - Sales
     - Available Stock
     - Stock Value
     - Status Indicators
   - Quantity Input
   - Unit Price (auto-filled from product settings)
   - Discount (auto-filled from product settings)
   - Tax
   - Batch Number
   - Expiration Date (auto-calculated)
   - Warranty (auto-filled)
   - Serial Number
   - Payment Account
   - Revenue Account
   - Tax Payable Account

2. **Cart System**
   - Add multiple items
   - Edit cart items
   - Remove cart items
   - View cart total

3. **Sales History Table**
   - All sales transactions
   - Click to view invoice

### Key Features
- ✅ **Stock Validation**: Cannot sell if out of stock
- ✅ **Low Stock Warning**: Alerts when stock is low
- ✅ **Automatic Inventory Reduction**: Stock reduces on sale
- ✅ **Professional Display**: Beautiful inventory information panel

---

## 🛒 Purchases Page Features

### URL
`http://localhost:5173/stock/purchases`

### What You'll See
1. **Left Panel**
   - Selected Invoice Details
   - Invoice Items Table
   - Invoice List
   - Invoice Actions (Approve, Reject, Pay)

2. **Right Panel (Purchase Form)**
   - Supplier Selection
   - Add New Supplier Form
   - Product Selection
   - Quantity, Unit, Price
   - Discount, Tax
   - Batch Number, Expiry
   - Quality Grade, Warranty
   - Serial Number
   - Store Location, Category
   - Inventory Account
   - Payment Type

3. **Invoice Management**
   - Create Invoice
   - Add Items to Invoice
   - Submit Invoice
   - Approve/Reject Invoice
   - Pay Invoice

4. **Purchase History**
   - All purchase transactions
   - Linked to invoices

### Key Features
- ✅ **Automatic Inventory Increase**: Stock increases on purchase
- ✅ **Invoice Workflow**: Pending → Approved → Paid
- ✅ **Supplier Management**: Add and manage suppliers
- ✅ **Payment Processing**: Record payments with journal entries

---

## 🏭 Finished Goods (Production)

### URL
`http://localhost:5173/production/finished-goods`

### What You'll See
1. **Production Plans**
   - Create production plan
   - Set finished product
   - Define BOM (Bill of Materials)

2. **Production Cycles**
   - Start production cycle
   - Consume raw materials
   - Complete production
   - Generate finished goods

3. **Finished Goods List**
   - Product Name
   - Quantity Produced
   - Unit Cost
   - Total Cost
   - Status (Added to Inventory or Not)

4. **Migration to Inventory**
   - Migrate finished goods to inventory
   - Automatic stock increase
   - Journal entry creation

### Key Features
- ✅ **Raw Material Consumption**: Reduces raw material inventory
- ✅ **Finished Goods Creation**: Increases finished goods inventory
- ✅ **Cost Tracking**: Material, Labor, Overhead costs
- ✅ **Professional Accounting**: Proper journal entries

---

## 🔄 Inventory Flow Example

### Scenario: Manufacturing a Product

1. **Purchase Raw Materials**
   ```
   Navigate to: http://localhost:5173/stock/purchases
   → Create purchase invoice
   → Add raw materials
   → Submit and approve invoice
   → Pay invoice
   Result: Raw materials inventory INCREASES ✅
   ```

2. **Check Inventory**
   ```
   Navigate to: http://localhost:5173/stock/inventory
   → Select "Raw Materials" tab
   → See increased stock
   Result: Raw materials visible in inventory ✅
   ```

3. **Start Production**
   ```
   Navigate to: http://localhost:5173/production
   → Create production plan
   → Start production cycle
   → Select raw materials to consume
   Result: Raw materials inventory DECREASES ✅
   ```

4. **Complete Production**
   ```
   → Complete production cycle
   → Enter produced quantity
   → Enter costs (labor, overhead)
   Result: Finished goods created ✅
   ```

5. **Migrate to Inventory**
   ```
   → Migrate finished goods to inventory
   Result: Finished goods inventory INCREASES ✅
   ```

6. **Check Inventory Again**
   ```
   Navigate to: http://localhost:5173/stock/inventory
   → Select "Finished Products" tab
   → See finished goods
   Result: Finished products visible in inventory ✅
   ```

7. **Make a Sale**
   ```
   Navigate to: http://localhost:5173/stock/sales
   → Select finished product
   → See available stock in real-time
   → Add to cart
   → Complete sale
   Result: Finished goods inventory DECREASES ✅
   ```

8. **Final Inventory Check**
   ```
   Navigate to: http://localhost:5173/stock/inventory
   → View complete inventory report
   → See: Opening + Purchases + Production - Sales = Closing
   Result: Complete inventory tracking ✅
   ```

---

## 📱 Mobile Access

All pages are responsive and work on mobile devices:
- Tablets: Full functionality
- Phones: Optimized layout with scrolling

---

## 🎨 Visual Indicators

### Stock Status Colors
- 🟢 **Green**: In Stock (above reorder level)
- 🟠 **Orange**: Low Stock (at or below reorder level)
- 🔴 **Red**: Out of Stock (zero stock)

### Category Colors
- 🟡 **Yellow/Orange**: Raw Materials
- 🟢 **Green**: Finished Products
- ⚪ **Gray**: Other/Uncategorized

### Transaction Colors
- 🟢 **Green (+)**: Increases (Purchases, Production)
- 🔴 **Red (-)**: Decreases (Sales, Consumption)
- 🔵 **Blue**: Current Stock

---

## ⚡ Quick Actions

### Daily Tasks
1. Check low stock alerts: `Inventory → Low Stock Items card`
2. Process sales: `Sales → Add Sale`
3. Record purchases: `Purchases → Add Purchase`

### Weekly Tasks
1. Review inventory report: `Inventory → Select date range`
2. Check production status: `Production → Cycles`
3. Reconcile accounts: `Reports → Inventory Reports`

### Monthly Tasks
1. Update opening stocks: `Inventory → Update Opening Stocks button`
2. Generate reports: `Reports → Inventory Valuation`
3. Physical stock verification: Compare system vs physical

---

## 🆘 Troubleshooting

### "Out of Stock" Error
- Check: `Inventory → Search for product`
- Solution: Create purchase or check production

### "Insufficient Stock" Error
- Check: Available stock in sales form
- Solution: Reduce quantity or purchase more

### Product Not Showing
- Check: Product Settings → Status = "Active"
- Check: Product Settings → Category is set
- Solution: Update product settings

### Inventory Not Updating
- Check: Browser console for errors
- Check: Backend logs
- Solution: Refresh page or restart server

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review `INVENTORY_ACCOUNTING_SYSTEM.md` for detailed documentation
3. Check backend logs: `backend/logs/`
4. Contact system administrator

---

**Quick Start**: 
1. Go to `http://localhost:5173/stock/inventory`
2. Click "Refresh" to load current inventory
3. Explore tabs: All Items, Raw Materials, Finished Products
4. Navigate to Sales or Purchases to make transactions

**Remember**: Every sale reduces inventory, every purchase increases inventory! 🎯
