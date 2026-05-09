# Currency System Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CURRENCY SYSTEM FLOW                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: User Sets Currency                                     │
└─────────────────────────────────────────────────────────────────┘

    User navigates to:
    http://localhost:5173/stock/user-settings
                    ↓
    ┌───────────────────────────────┐
    │  Currency Configuration UI    │
    │  - Select Currency Dropdown   │
    │  - Current: GBP (£)          │
    │  - Save Button               │
    └───────────────────────────────┘
                    ↓
    User selects currency (e.g., GBP)
                    ↓
    User clicks "Save"
                    ↓

┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Currency Saved to Backend                              │
└─────────────────────────────────────────────────────────────────┘

    POST /api/v1/currency/default
    {
      organizationId: "stock-org-1",
      moduleType: "stock",
      currencyId: "GBP"
    }
                    ↓
    ┌───────────────────────────────┐
    │  Firebase/Backend Storage     │
    │  - Organization Settings      │
    │  - Currency: GBP             │
    │  - Symbol: £                 │
    │  - Decimal Places: 2         │
    └───────────────────────────────┘
                    ↓

┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Currency Loaded on App Init                            │
└─────────────────────────────────────────────────────────────────┘

    App.jsx loads
                    ↓
    ┌───────────────────────────────┐
    │  CurrencyProvider             │
    │  - Wraps entire app           │
    │  - Provides currency context  │
    └───────────────────────────────┘
                    ↓
    ┌───────────────────────────────┐
    │  StockProvider                │
    │  - Loads on mount             │
    │  - Calls fetchDefaultCurrency │
    └───────────────────────────────┘
                    ↓
    GET /api/v1/currency/default/stock-org-1/stock
                    ↓
    Returns:
    {
      code: "GBP",
      symbol: "£",
      name: "British Pound",
      decimalPlaces: 2
    }
                    ↓
    ┌───────────────────────────────┐
    │  stockContext.jsx             │
    │  - Sets currencySettings      │
    │  - Provides formatAmount()    │
    └───────────────────────────────┘
                    ↓

┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Currency Available to All Components                   │
└─────────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────┐
    │  useStockCurrency() Hook      │
    │  - currency.code: "GBP"       │
    │  - currency.symbol: "£"       │
    │  - formatAmount(amount)       │
    └───────────────────────────────┘
                    ↓
    ┌───────────────────────────────┐
    │  CurrencyDisplay Component    │
    │  - Receives amount prop       │
    │  - Calls formatAmount()       │
    │  - Displays: £1,234.56       │
    └───────────────────────────────┘
                    ↓

┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: Currency Used Across All Pages                         │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │  Sales Page     │──→ <CurrencyDisplay amount={price} />
    └─────────────────┘    Output: £25.00

    ┌─────────────────┐
    │  Purchases Page │──→ <CurrencyDisplay amount={total} />
    └─────────────────┘    Output: £1,250.00

    ┌─────────────────┐
    │  Inventory Page │──→ <CurrencyDisplay amount={stockValue} />
    └─────────────────┘    Output: £45,678.90

    ┌─────────────────┐
    │  Reports Page   │──→ <CurrencyDisplay amount={revenue} />
    └─────────────────┘    Output: £125,000.00

    ┌─────────────────┐
    │  Expenses Page  │──→ <CurrencyDisplay amount={expense} />
    └─────────────────┘    Output: £3,456.78

    ┌─────────────────┐
    │  Assets Page    │──→ <CurrencyDisplay amount={assetCost} />
    └─────────────────┘    Output: £50,000.00

    ┌─────────────────┐
    │  Production     │──→ <CurrencyDisplay amount={prodCost} />
    └─────────────────┘    Output: £8,900.00
```

## Component Hierarchy

```
App.jsx
  └── CurrencyProvider (provides currency context)
       └── StockProvider (loads & uses currency)
            └── StockCurrencyContext (provides formatAmount)
                 └── All Stock Pages
                      └── CurrencyDisplay Component
                           └── Displays formatted currency
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    DATA FLOW DIAGRAM                          │
└──────────────────────────────────────────────────────────────┘

User Settings Page
       │
       │ (1) User selects currency
       ↓
CurrencyContext.setOrganizationCurrency()
       │
       │ (2) POST to backend
       ↓
Backend API (/api/v1/currency/default)
       │
       │ (3) Save to database
       ↓
Firebase/Database
       │
       │ (4) Return saved currency
       ↓
CurrencyContext.defaultCurrency
       │
       │ (5) Update context state
       ↓
stockContext.fetchDefaultCurrency()
       │
       │ (6) Load on app init
       ↓
stockContext.currencySettings
       │
       │ (7) Provide to components
       ↓
useStockCurrency() hook
       │
       │ (8) Access in components
       ↓
CurrencyDisplay component
       │
       │ (9) Format & display
       ↓
User sees: £1,234.56
```

## State Management

```
┌──────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                           │
└──────────────────────────────────────────────────────────────┘

Global State (CurrencyContext):
  ├── currencies: Array<Currency>
  ├── defaultCurrency: Currency | null
  ├── loading: boolean
  └── Methods:
       ├── fetchCurrencies()
       ├── fetchDefaultCurrency(orgId, moduleType)
       ├── setOrganizationCurrency(orgId, moduleType, currencyId)
       └── formatCurrency(amount, currency)

Stock State (stockContext):
  ├── currencySettings: {
  │    code: string,
  │    symbol: string,
  │    name: string,
  │    decimalPlaces: number
  │   }
  └── Methods:
       └── formatAmount(amount, showSymbol)

Component State (CurrencyDisplay):
  └── Props:
       ├── amount: number
       ├── showSymbol: boolean
       └── className: string
```

## API Endpoints

```
┌──────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                              │
└──────────────────────────────────────────────────────────────┘

GET /api/v1/currency/active
  └── Returns: Array of active currencies

GET /api/v1/currency/default/:organizationId/:moduleType
  └── Returns: Default currency for organization

POST /api/v1/currency/default
  └── Body: { organizationId, moduleType, currencyId }
  └── Returns: Saved currency settings

POST /api/v1/currency/initialize
  └── Initializes default currencies in system
  └── Returns: Array of initialized currencies
```

## Currency Object Structure

```javascript
Currency {
  id: string,              // "GBP"
  code: string,            // "GBP"
  symbol: string,          // "£"
  name: string,            // "British Pound"
  decimalPlaces: number,   // 2
  isActive: boolean,       // true
  position: string,        // "before" | "after"
  thousandsSeparator: string, // ","
  decimalSeparator: string    // "."
}
```

## Usage Flow in Components

```
Component Lifecycle:
  1. Component mounts
  2. useStockCurrency() hook called
  3. Hook returns { currency, formatAmount }
  4. Component uses CurrencyDisplay or formatAmount
  5. Amount is formatted with currency settings
  6. User sees formatted currency

Example:
  Component: SalesPage
       ↓
  Hook: const { formatAmount } = useStockCurrency()
       ↓
  Render: <CurrencyDisplay amount={1234.56} />
       ↓
  Display: £1,234.56
```

## Error Handling

```
┌──────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                             │
└──────────────────────────────────────────────────────────────┘

Scenario 1: No currency set
  └── Fallback to USD ($)

Scenario 2: Invalid amount
  └── Display "-"

Scenario 3: API error
  └── Log error, use cached currency

Scenario 4: Null/undefined amount
  └── Display "-"

Scenario 5: Network error
  └── Retry with exponential backoff
```

## Performance Optimization

```
┌──────────────────────────────────────────────────────────────┐
│                    PERFORMANCE                                │
└──────────────────────────────────────────────────────────────┘

1. Currency loaded once on app init
2. Cached in context (no repeated API calls)
3. formatAmount() is memoized
4. CurrencyDisplay is lightweight
5. No re-renders on currency change (unless needed)
```

## Summary

```
┌──────────────────────────────────────────────────────────────┐
│                    SUMMARY                                    │
└──────────────────────────────────────────────────────────────┘

✅ User sets currency in User Settings
✅ Currency saved to backend/database
✅ Currency loaded on app initialization
✅ Currency available via useStockCurrency() hook
✅ CurrencyDisplay component formats all amounts
✅ Currency applied across all stock features
✅ Consistent formatting throughout system
✅ Real-time updates when currency changes
```

---

**Visual Legend:**
- `→` : Data flow direction
- `↓` : Sequential step
- `└──` : Hierarchy/relationship
- `┌──┐` : Container/boundary
- `│` : Connection/continuation

**Last Updated**: January 2025
