# Tax Integration in Sales & Purchases - Complete Guide

## Overview
Professional tax management has been fully integrated into your sales and purchase workflows, following international accounting standards.

## 🎯 What's Been Implemented

### 1. Product-Level Tax Configuration
**Location:** Settings → Product Settings

Products can now have:
- **Individual Tax Assignment** - Link to a specific tax (e.g., VAT 18%)
- **Tax Group Assignment** - Link to multiple taxes (e.g., VAT + Excise)
- **Tax Exempt Status** - Mark products that don't require tax
- **Legacy Tax %** - Backward compatible percentage field

### 2. Automatic Tax Calculation
When you select a product in sales/purchases:
- ✅ Taxes are automatically loaded from product configuration
- ✅ Tax amounts are calculated based on quantity and price
- ✅ Multiple taxes are applied if using tax groups
- ✅ Tax-exempt products skip tax calculation

### 3. Professional Tax Components

#### TaxSelector Component
**Location:** `frontend/src/components/stock/TaxSelector.jsx`

Features:
- Dropdown selection of taxes and tax groups
- Real-time tax calculation
- Visual display of applied taxes with chips
- Support for percentage and fixed taxes
- Inclusive/Exclusive pricing support

#### SalesFormWithTax Component
**Location:** `frontend/src/components/stock/SalesFormWithTax.jsx`

Features:
- Multi-item cart with tax calculation
- Product selection with auto-tax loading
- Discount support (percentage or fixed)
- Tax breakdown per item
- Total tax summary
- Account selection for proper accounting

#### PurchaseFormWithTax Component
**Location:** `frontend/src/components/stock/PurchaseFormWithTax.jsx`

Features:
- Supplier selection
- Multi-item invoice with tax calculation
- Batch number and expiration date tracking
- Tax breakdown per item
- Total tax summary
- Inventory and payable account selection

## 📋 How to Use

### Setting Up Product Taxes

1. **Navigate to Product Settings**
   ```
   Stock Dashboard → Settings → Product Settings
   ```

2. **Edit a Product**
   - Scroll to "Tax Configuration" section
   - Choose one of three options:

   **Option A: Tax Exempt**
   - Check "Tax Exempt Product"
   - No taxes will be applied

   **Option B: Single Tax**
   - Select from "Select Tax" dropdown
   - Choose a tax like "Standard VAT (VAT-18) - 18%"
   - Tax will be applied automatically in sales/purchases

   **Option C: Tax Group**
   - Select from "Or Select Tax Group" dropdown
   - Choose a group like "Alcohol Taxes (2 taxes)"
   - Multiple taxes will be applied

3. **Save the Product**

### Creating a Sale with Taxes

#### Method 1: Using Existing Sales Page
The existing SalesPage.jsx will automatically:
- Load product tax configuration
- Calculate taxes based on product settings
- Record tax transactions

#### Method 2: Using New SalesFormWithTax Component

```javascript
import SalesFormWithTax from '../../components/stock/SalesFormWithTax';

// In your component
const [showSalesForm, setShowSalesForm] = useState(false);

<SalesFormWithTax
  open={showSalesForm}
  onClose={() => setShowSalesForm(false)}
  onSave={(saleData) => {
    // saleData includes:
    // - items: array of cart items with taxes
    // - totalPrice: total amount
    // - totalTax: total tax amount
    // - paymentAccountId
    // - revenueAccountId
    addSale(saleData);
  }}
  productSettings={productSettings}
  accountSettings={accountSettings}
/>
```

**Workflow:**
1. Click "Add Sale" or open form
2. Select product → taxes auto-load
3. Enter quantity and price
4. Adjust discount if needed
5. Review tax calculation
6. Click "Add to Cart"
7. Repeat for more items
8. Select payment and revenue accounts
9. Click "Save Sale"

### Creating a Purchase with Taxes

#### Using PurchaseFormWithTax Component

```javascript
import PurchaseFormWithTax from '../../components/stock/PurchaseFormWithTax';

// In your component
const [showPurchaseForm, setShowPurchaseForm] = useState(false);

<PurchaseFormWithTax
  open={showPurchaseForm}
  onClose={() => setShowPurchaseForm(false)}
  onSave={(purchaseData) => {
    // purchaseData includes:
    // - supplierId
    // - items: array of invoice items with taxes
    // - totalAmount: total amount
    // - totalTax: total tax amount
    // - inventoryAccountId
    // - payableAccountId
    addPurchase(purchaseData);
  }}
  productSettings={productSettings}
  accountSettings={accountSettings}
  suppliers={suppliers}
/>
```

**Workflow:**
1. Click "Add Purchase" or open form
2. Select supplier
3. Select product → taxes auto-load
4. Enter quantity and price
5. Add batch number and expiry date if needed
6. Review tax calculation
7. Click "Add to Invoice"
8. Repeat for more items
9. Select inventory and payable accounts
10. Click "Save Purchase Invoice"

## 💡 Tax Calculation Examples

### Example 1: Single VAT (Exclusive)
```
Product: Laptop
Quantity: 1
Unit Price: $1,000
Tax: VAT 18% (Exclusive)

Calculation:
Subtotal: $1,000
VAT (18%): $180
Total: $1,180
```

### Example 2: Multiple Taxes (Tax Group)
```
Product: Whiskey
Quantity: 10 bottles
Unit Price: $50
Tax Group: Alcohol Taxes (VAT 18% + Excise 10%)

Calculation:
Subtotal: $500
VAT (18%): $90
Excise (10%): $50
Total: $640
```

### Example 3: Tax Inclusive
```
Product: Service
Quantity: 1
Unit Price: $118 (inclusive)
Tax: VAT 18% (Inclusive)

Calculation:
Total: $118
VAT (18%): $18.31
Net Amount: $99.69
```

### Example 4: With Discount
```
Product: Phone
Quantity: 1
Unit Price: $500
Discount: 10%
Tax: VAT 18%

Calculation:
Subtotal: $500
Discount (10%): -$50
Taxable Amount: $450
VAT (18%): $81
Total: $531
```

## 🔄 Tax Transaction Recording

### Automatic Recording
When you create a sale or purchase, the system automatically:

1. **Calculates all taxes** based on product configuration
2. **Records tax transactions** in the taxTransactions collection
3. **Links to the sale/purchase** for audit trail
4. **Stores tax details**:
   - Tax ID, name, code, type
   - Taxable amount
   - Tax rate
   - Tax amount
   - Customer/Supplier ID
   - Invoice number

### Tax Transaction Data Structure
```javascript
{
  transactionType: "Sale" or "Purchase",
  transactionId: "sale_123",
  transactionDate: "2024-01-15",
  taxId: "tax_vat_18",
  taxName: "Standard VAT",
  taxCode: "VAT-18",
  taxType: "VAT",
  taxableAmount: 1000,
  taxAmount: 180,
  taxRate: 18,
  customerId: "cust_123",
  invoiceNumber: "INV-001",
  description: "Sale - INV-001"
}
```

## 📊 Viewing Tax Reports

After creating sales/purchases with taxes:

1. **Navigate to Tax Reports**
   ```
   Stock Dashboard → Reports → Tax Reports
   ```

2. **View Tax Transactions**
   - See all tax transactions
   - Filter by date range
   - Filter by tax type
   - View detailed breakdown

3. **View Tax Summary**
   - Aggregated data by tax type
   - Total taxable amounts
   - Total tax collected/paid
   - Transaction counts

4. **Export Reports**
   - Click "Export" for CSV
   - Click "Print" for printing
   - Use for tax filing

## 🎨 UI Features

### Tax Selector
- Clean dropdown interface
- Grouped display (Tax Groups vs Individual Taxes)
- Visual chips showing applied taxes
- Real-time calculation display
- Easy removal of taxes

### Sales/Purchase Forms
- Professional Material-UI design
- Multi-item cart/invoice
- Real-time totals
- Tax breakdown per item
- Grand total with tax summary
- Edit and delete items
- Account selection for proper posting

## 🔧 Integration Points

### Product Settings
```javascript
// Product with tax configuration
{
  name: "Laptop",
  defaultSellingPrice: 1000,
  taxId: "tax_vat_18",  // Single tax
  taxGroupId: null,
  taxExempt: false
}

// Product with tax group
{
  name: "Whiskey",
  defaultSellingPrice: 50,
  taxId: null,
  taxGroupId: "group_alcohol",  // Multiple taxes
  taxExempt: false
}

// Tax exempt product
{
  name: "Medical Supplies",
  defaultSellingPrice: 100,
  taxId: null,
  taxGroupId: null,
  taxExempt: true  // No tax
}
```

### Sales Data Structure
```javascript
{
  items: [
    {
      productId: "prod_123",
      productName: "Laptop",
      quantity: 1,
      unitPrice: 1000,
      discount: 0,
      taxes: [
        {
          taxId: "tax_vat_18",
          taxName: "Standard VAT",
          taxCode: "VAT-18",
          taxType: "VAT",
          taxRate: 18,
          taxableAmount: 1000,
          taxAmount: 180
        }
      ],
      totalPrice: 1180
    }
  ],
  totalPrice: 1180,
  totalTax: 180,
  paymentAccountId: "acc_cash",
  revenueAccountId: "acc_revenue"
}
```

## ✅ Best Practices

1. **Set up taxes first** before creating products
2. **Configure products** with appropriate taxes
3. **Use tax groups** for products with multiple taxes
4. **Mark exempt products** correctly
5. **Review tax calculations** before saving
6. **Check tax reports** regularly
7. **Export reports** for tax filing
8. **Keep tax configurations** active for audit trail

## 🐛 Troubleshooting

### Taxes not appearing in form
- Check if product has tax configured
- Verify tax is active in Tax Settings
- Check if product is marked as tax exempt

### Wrong tax amount
- Verify tax rate in Tax Settings
- Check if price type is Inclusive/Exclusive
- Confirm discount is applied correctly

### Tax not recorded
- Check backend console for errors
- Verify tax transaction model is imported
- Ensure sale/purchase was saved successfully

## 📝 Migration Notes

### For Existing Products
1. Products with legacy `tax` field will continue to work
2. Gradually migrate to new tax system:
   - Create taxes in Tax Settings
   - Assign taxes to products
   - Remove legacy tax percentage

### For Existing Sales/Purchases
- Old records remain unchanged
- New records use professional tax system
- Both systems work side-by-side

## 🚀 Future Enhancements

- Tax exemption certificates
- Tax rate history tracking
- Automated tax filing
- Multi-currency tax support
- Advanced tax rules engine
- Tax reconciliation tools

---

**Status:** ✅ Fully Integrated  
**Version:** 1.0  
**Last Updated:** 2024  
**Module:** Stock Management - Tax Integration
