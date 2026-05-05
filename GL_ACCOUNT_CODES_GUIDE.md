# GL Account Codes for Tax Management

## Overview
Professional General Ledger (GL) account codes integrated into the tax system following international accounting standards.

## 📊 Standard Tax GL Accounts

### VAT Accounts

| GL Code | GL Account Name | Type | Used When | Meaning |
|---------|----------------|------|-----------|---------|
| **2101** | VAT Output (VAT Payable) | Liability | Sales Invoice | VAT you collected from customers and owe to government |
| **1301** | VAT Input (VAT Receivable) | Asset | Purchase Bill | VAT you paid to suppliers and can claim back |
| **2102** | VAT Control Account | Liability | VAT report time | Net VAT to pay after input – output |

### Sales Tax Accounts

| GL Code | GL Account Name | Type | Used When | Meaning |
|---------|----------------|------|-----------|---------|
| **2103** | Sales Tax Payable | Liability | Sales Invoice | Sales tax collected from customers |

### Excise Duty Accounts

| GL Code | GL Account Name | Type | Used When | Meaning |
|---------|----------------|------|-----------|---------|
| **2104** | Excise Duty Payable | Liability | Sales Invoice (Excise goods) | Excise duty collected on alcohol, fuel, tobacco |

### Withholding Tax Accounts

| GL Code | GL Account Name | Type | Used When | Meaning |
|---------|----------------|------|-----------|---------|
| **1302** | Withholding Tax Receivable | Asset | Payment to Supplier | WHT withheld from supplier payments |
| **2105** | Withholding Tax Payable | Liability | Payment from Customer | WHT withheld by customers |

### Customs Duty Accounts

| GL Code | GL Account Name | Type | Used When | Meaning |
|---------|----------------|------|-----------|---------|
| **1303** | Customs Duty Receivable | Asset | Import Purchase | Customs duty paid on imports |

## 🔄 How GL Codes Work

### Sales Transaction Flow
```
Customer Purchase: $1,000 + 18% VAT = $1,180

Journal Entry:
Dr. Cash/Bank Account         $1,180
    Cr. Revenue Account              $1,000
    Cr. 2101 - VAT Output             $180
```

### Purchase Transaction Flow
```
Supplier Purchase: $500 + 18% VAT = $590

Journal Entry:
Dr. Inventory Account         $500
Dr. 1301 - VAT Input          $90
    Cr. Accounts Payable             $590
```

### VAT Control Calculation
```
At Month End:
VAT Output (2101):    $1,800  (Collected from customers)
VAT Input (1301):     -$900   (Paid to suppliers)
─────────────────────────────
VAT Control (2102):   $900    (Net VAT to pay government)
```

## 🎯 Tax Configuration with GL Codes

### Example 1: Standard VAT
```javascript
{
  taxName: "Standard VAT",
  taxCode: "VAT-18",
  taxType: "VAT",
  rate: 18,
  outputGLCode: "2101",  // Sales
  inputGLCode: "1301",   // Purchases
  controlGLCode: "2102"  // Control
}
```

### Example 2: Excise Duty
```javascript
{
  taxName: "Alcohol Excise",
  taxCode: "EXC-10",
  taxType: "Excise",
  rate: 10,
  outputGLCode: "2104",  // Excise Duty Payable
  inputGLCode: "1301",   // VAT Input (if applicable)
  controlGLCode: "2102"  // Control
}
```

### Example 3: Withholding Tax
```javascript
{
  taxName: "WHT on Services",
  taxCode: "WHT-5",
  taxType: "WHT",
  rate: 5,
  outputGLCode: "2105",  // WHT Payable (when withheld by customer)
  inputGLCode: "1302",   // WHT Receivable (when you withhold)
  controlGLCode: "2102"  // Control
}
```

## 📝 Setting Up GL Codes

### Step 1: Initialize Default GL Accounts
```
1. Navigate to: Settings → Tax Settings
2. Click: "Initialize GL Accounts" button
3. System creates default GL accounts:
   - 2101 - VAT Output
   - 1301 - VAT Input
   - 2102 - VAT Control
   - 2103 - Sales Tax Payable
   - 2104 - Excise Duty Payable
   - 1302 - WHT Receivable
   - 2105 - WHT Payable
   - 1303 - Customs Duty Receivable
```

### Step 2: Configure Tax with GL Codes
```
1. Click: "Add Tax"
2. Fill in tax details
3. Select GL Codes:
   - Output GL Code: For sales (Liability)
   - Input GL Code: For purchases (Asset)
   - Control GL Code: For net calculation
4. Save
```

### Step 3: Automatic GL Posting
```
When you create a sale/purchase:
- System automatically posts to correct GL accounts
- Tax transactions recorded with GL codes
- Reports show GL account breakdown
```

## 📊 GL Account Reports

### VAT Report with GL Codes
```
Period: January 2024

VAT Output (2101):
  Sales Invoice #001    $180
  Sales Invoice #002    $90
  Total Output:         $270

VAT Input (1301):
  Purchase Bill #001    -$50
  Purchase Bill #002    -$40
  Total Input:          -$90

VAT Control (2102):
  Net VAT Payable:      $180
```

### Tax Summary by GL Code
```
GL Code  Account Name              Debit    Credit   Balance
2101     VAT Output                         $1,800   $1,800 Cr
1301     VAT Input                 $900              $900 Dr
2102     VAT Control                        $900     $900 Cr
2103     Sales Tax Payable                  $200     $200 Cr
2104     Excise Duty Payable                $150     $150 Cr
```

## 🔧 API Integration

### Get GL Accounts
```javascript
GET /api/v1/stock/gl-accounts

Response:
[
  {
    id: "gl_001",
    glCode: "2101",
    glAccountName: "VAT Output (VAT Payable)",
    accountType: "Liability",
    category: "Tax",
    usedWhen: "Sales Invoice",
    meaning: "VAT you collected from customers...",
    balance: 1800.00
  }
]
```

### Initialize Default Accounts
```javascript
POST /api/v1/stock/gl-accounts/initialize-defaults

Response:
{
  message: "Default tax GL accounts initialized",
  created: 8,
  accounts: [...]
}
```

### Update GL Account Balance
```javascript
PUT /api/v1/stock/gl-accounts/:id/balance
Body: {
  amount: 180,
  operation: "add"  // or "subtract"
}
```

## 💼 Accounting Standards Compliance

### IFRS Compliance
✅ Proper asset/liability classification  
✅ Separate input and output tax tracking  
✅ Control account for reconciliation  
✅ Audit trail with GL codes  

### GAAP Compliance
✅ Accrual basis accounting  
✅ Matching principle (tax with revenue/expense)  
✅ Full disclosure in reports  
✅ Consistent GL code usage  

## 🎨 UI Features

### Tax Settings Page
- GL Code display in tax table
- GL Code selection dropdowns
- Explanation tooltips
- Initialize button for defaults

### Tax Reports Page
- GL Code column in reports
- Filter by GL Code
- GL Account breakdown
- Export with GL codes

## 📈 Best Practices

1. **Initialize GL Accounts First**
   - Run initialization before creating taxes
   - Ensures consistent GL codes

2. **Use Standard Codes**
   - Follow the default numbering
   - 1xxx for Assets
   - 2xxx for Liabilities

3. **Separate Input/Output**
   - Always use different codes for sales vs purchases
   - Enables proper VAT reconciliation

4. **Regular Reconciliation**
   - Match GL balances with tax reports
   - Verify control account = output - input

5. **Audit Trail**
   - Every tax transaction links to GL code
   - Complete traceability

## 🔍 Troubleshooting

### GL Accounts Not Showing
- Click "Initialize GL Accounts" button
- Check API connection
- Verify authentication

### Wrong GL Code in Report
- Check tax configuration
- Verify GL code assignment
- Re-save tax if needed

### Balance Mismatch
- Run tax report
- Compare with GL account balances
- Check for unposted transactions

## 📚 Additional Resources

**Related Documentation:**
- TAX_MANAGEMENT_SYSTEM.md
- TAX_INTEGRATION_GUIDE.md
- Chart of Accounts setup

**Accounting References:**
- IFRS standards for tax accounting
- GAAP guidelines for sales tax
- Local tax authority requirements

---

**Status:** ✅ Fully Implemented  
**Version:** 1.0  
**Compliance:** IFRS, GAAP  
**Last Updated:** 2024
