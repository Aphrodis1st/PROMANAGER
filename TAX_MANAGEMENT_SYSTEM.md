# Professional Tax Management System

## Overview
A comprehensive tax management system built to professional accounting standards, supporting multiple tax types, tax groups, and detailed tax reporting for your stock/inventory management system.

## Features Implemented

### 1. Tax Configuration (Settings)
Located at: `/stock/tax-settings`

#### Supported Tax Types
- **VAT (Value Added Tax)** - Standard consumption tax on goods/services
- **Sales Tax** - Alternative to VAT in some regions
- **Excise Duty** - Special tax on alcohol, fuel, tobacco, etc.
- **Withholding Tax (WHT)** - Tax retained when paying suppliers/consultants
- **Customs Duty** - Tax on imported items
- **Zero-Rated Tax** - 0% tax but still reported for compliance
- **Tax Exempt** - No tax applied

#### Tax Configuration Fields
- **Tax Name** - Descriptive name (e.g., "Standard VAT")
- **Tax Code** - Short code for reporting (e.g., "VAT-18")
- **Tax Type** - Category from the list above
- **Calculation Type** - Percentage or Fixed Amount
- **Rate** - Tax percentage (e.g., 18%)
- **Fixed Amount** - Fixed tax per item (e.g., $2 per unit)
- **Price Type** - Inclusive or Exclusive
  - **Exclusive**: Tax added on top of price
  - **Inclusive**: Tax included in the price
- **Applies To** - All, Product, Service, or Category
- **Category Filter** - Specific categories if applicable
- **GL Account Code** - General Ledger account for accounting integration
- **Status** - Active/Inactive
- **Description** - Additional notes

### 2. Tax Groups
Combine multiple taxes that apply together (e.g., VAT + Excise on alcohol)

#### Tax Group Fields
- **Group Name** - Descriptive name
- **Group Code** - Short identifier
- **Tax IDs** - Select multiple taxes to group
- **Description** - Purpose of the group
- **Status** - Active/Inactive

### 3. Tax Reports
Located at: `/stock/tax-reports`

#### Report Types

**A. Tax Transactions Report**
- Complete list of all tax transactions
- Filters: Date range, Tax type
- Shows:
  - Transaction date
  - Transaction type (Sale/Purchase)
  - Invoice number
  - Tax name and type
  - Taxable amount
  - Tax rate
  - Tax amount collected/paid

**B. Tax Summary Report**
- Aggregated view by tax type
- Shows:
  - Tax type
  - Number of transactions
  - Total taxable amount
  - Total tax collected/paid
- Perfect for VAT returns, WHT reports, etc.

#### Export & Print
- Export to CSV for Excel/accounting software
- Print-friendly format for filing

### 4. Product Tax Configuration
Products can now have:
- **Tax ID** - Link to specific tax configuration
- **Tax Group ID** - Link to tax group
- **Tax Exempt** - Mark product as tax-exempt
- **Legacy Tax %** - Backward compatible percentage field

## Backend Implementation

### Models Created
1. **tax.model.js** - Tax configuration management
2. **taxGroup.model.js** - Tax group management
3. **taxTransaction.model.js** - Tax transaction tracking

### Controllers Created
1. **tax.controller.js** - CRUD operations for taxes, groups, and reports

### Routes Created
1. **tax.routes.js** - API endpoints:
   - `POST /api/v1/stock/taxes` - Create tax
   - `GET /api/v1/stock/taxes` - Get all taxes
   - `GET /api/v1/stock/taxes/active` - Get active taxes
   - `GET /api/v1/stock/taxes/:id` - Get tax by ID
   - `PUT /api/v1/stock/taxes/:id` - Update tax
   - `DELETE /api/v1/stock/taxes/:id` - Delete tax
   - `POST /api/v1/stock/taxes/groups` - Create tax group
   - `GET /api/v1/stock/taxes/groups/all` - Get all tax groups
   - `PUT /api/v1/stock/taxes/groups/:id` - Update tax group
   - `DELETE /api/v1/stock/taxes/groups/:id` - Delete tax group
   - `GET /api/v1/stock/taxes/transactions/all` - Get tax transactions
   - `GET /api/v1/stock/taxes/reports/by-type` - Get report by tax type
   - `GET /api/v1/stock/taxes/reports/summary` - Get tax summary

### Automatic Tax Recording
Tax transactions are automatically recorded when:
- Creating sales
- Creating purchases
- Creating customer invoices
- Creating supplier invoices

## Frontend Implementation

### Pages Created
1. **TaxSettingsPage.jsx** - Tax configuration interface
2. **TaxReportsPage.jsx** - Tax reporting interface

### Navigation Updates
- Added "Tax Settings" to Settings menu
- Added "Tax Reports" to Reports menu

### Access Control
- Tax Settings: ADMIN, ACCOUNTANT, MANAGER (Finance department)
- Tax Reports: ADMIN, ACCOUNTANT, MANAGER (Finance department)

## Usage Guide

### Setting Up Taxes

1. **Navigate to Tax Settings**
   - Go to Settings → Tax Settings

2. **Create a Tax**
   - Click "Add Tax"
   - Fill in tax details:
     - Name: "Standard VAT"
     - Code: "VAT-18"
     - Type: VAT
     - Calculation: Percentage
     - Rate: 18%
     - Price Type: Exclusive
     - Applies To: All
   - Click Save

3. **Create Tax Groups (Optional)**
   - Switch to "Tax Groups" tab
   - Click "Add Tax Group"
   - Name: "Alcohol Tax"
   - Select taxes: VAT + Excise
   - Click Save

### Applying Taxes to Products

1. **Edit Product Settings**
   - Go to Settings → Product Settings
   - Edit a product
   - In the "Pricing & Defaults" section:
     - Select Tax ID or Tax Group ID
     - Or mark as Tax Exempt
   - Save

### Generating Tax Reports

1. **Navigate to Tax Reports**
   - Go to Reports → Tax Reports

2. **Filter Reports**
   - Select date range
   - Select tax type (or All)
   - Click "Apply Filters"

3. **View Transactions**
   - See all tax transactions in detail
   - View summary cards for quick insights

4. **View Summary**
   - Switch to "Tax Summary" tab
   - See aggregated data by tax type
   - Perfect for filing tax returns

5. **Export/Print**
   - Click "Export" for CSV download
   - Click "Print" for printing

## Tax Calculation Examples

### Example 1: Exclusive VAT (18%)
- Product Price: $100
- VAT (18%): $18
- **Total: $118**

### Example 2: Inclusive VAT (18%)
- Total Price: $118
- VAT (18%): $18.31
- **Net Price: $99.69**

### Example 3: Fixed Tax
- Product Price: $100
- Fixed Tax: $5
- **Total: $105**

### Example 4: Multiple Taxes (Tax Group)
- Product Price: $100
- VAT (18%): $18
- Excise (10%): $10
- **Total: $128**

## Compliance Features

### VAT Compliance
- Track all VAT collected on sales
- Track all VAT paid on purchases
- Generate VAT return reports
- Support for zero-rated and exempt items

### WHT Compliance
- Record withholding tax on supplier payments
- Track WHT by supplier
- Generate WHT certificates

### Customs Duty
- Track import duties
- Link to purchase invoices
- Report on customs payments

## Database Collections

### taxes
Stores tax configurations
```javascript
{
  id, taxName, taxCode, taxType, calculationType,
  rate, fixedAmount, priceType, appliesTo,
  categoryFilter, isActive, isCompoundTax,
  taxGroupId, description, glAccountCode,
  reportingCategory, createdAt, updatedAt
}
```

### taxGroups
Stores tax group configurations
```javascript
{
  id, groupName, groupCode, taxIds,
  description, isActive, createdAt, updatedAt
}
```

### taxTransactions
Stores all tax transactions for reporting
```javascript
{
  id, transactionType, transactionId, transactionDate,
  taxId, taxName, taxCode, taxType,
  taxableAmount, taxAmount, taxRate,
  customerId, supplierId, invoiceNumber,
  description, createdAt, updatedAt
}
```

## Integration Points

### Sales Module
- Automatically calculates taxes based on product configuration
- Records tax transactions
- Updates tax reports

### Purchase Module
- Calculates input tax
- Records tax transactions
- Tracks tax paid to suppliers

### Invoice Module
- Displays tax breakdown
- Supports multiple taxes per line item
- Tax-inclusive and exclusive pricing

### Accounting Module
- Posts tax to GL accounts
- Integrates with chart of accounts
- Tax liability tracking

## Best Practices

1. **Set up taxes before creating products**
2. **Use tax codes consistently** (e.g., VAT-18, WHT-5)
3. **Review tax reports monthly** for accuracy
4. **Keep tax configurations active** even if rate changes (create new tax instead)
5. **Use tax groups** for products with multiple taxes
6. **Mark exempt products correctly** for compliance
7. **Export reports regularly** for backup and filing

## Future Enhancements

- Tax rate history tracking
- Automated tax filing integration
- Multi-currency tax support
- Tax exemption certificates
- Advanced tax rules engine
- Tax audit trail
- Tax reconciliation tools

## Support

For issues or questions:
1. Check this documentation
2. Review tax configuration in settings
3. Verify product tax assignments
4. Check tax transaction records
5. Contact system administrator

---

**Version:** 1.0  
**Last Updated:** 2024  
**Module:** Stock Management - Tax System
