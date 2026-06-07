# Currency Settings Integration for Stock Management

## Overview
Currency settings configured at `/stock/user-settings` are now applied across ALL stock management pages automatically.

## How It Works

### 1. Currency Configuration (User Settings Page)
- Navigate to: `http://localhost:3000/stock/user-settings`
- Select your preferred currency (e.g., RWF - RWANDAN FRANC)
- Click "Save Currency Settings"
- Currency is saved to:
  - Backend: Firestore database
  - Frontend: Local storage (`stock.currencySettings.v1`)

### 2. Currency Provider (Global State)
**File**: `src/context/CurrencyContext.tsx`
- Wraps all dashboard pages via `DashboardProviders`
- Provides currency data to all child components
- Auto-loads default currency for the organization

### 3. Currency Formatting Utilities

#### Main Utility
**File**: `src/lib/stockCurrency.ts`
```typescript
formatStockCurrency(amount) // Returns: "RWF 1,234.56"
```

#### React Hook
**File**: `src/hooks/useStockCurrency.ts`
```typescript
const { currency, format } = useStockCurrency();
format(1234.56); // Returns formatted currency
```

### 4. Pages Using Currency Formatting

All these pages automatically use the configured currency:

#### Dashboard
- **File**: `src/views/stock/StockDashboardOverview.jsx`
- Formats: Inventory value, purchase amounts, sales amounts

#### Inventory Management
- **File**: `src/views/stock/InventoryPage.jsx`
- Formats: Unit cost, selling price, total value, inventory value

#### Purchases
- Formats: Purchase amounts, total costs

#### Sales
- Formats: Sale amounts, revenue

#### Expenses
- Formats: Expense amounts

#### Reports
- Formats: All financial values

#### Production
- Formats: Production costs, material costs

## Implementation Pattern

### For Existing Pages
Replace hardcoded currency symbols:
```javascript
// OLD
`₹${amount.toFixed(2)}`
`$${amount}`

// NEW
import { formatStockCurrency } from '@/lib/stockCurrency';
formatStockCurrency(amount)
```

### For New Pages
Use the hook:
```javascript
import { useStockCurrency } from '@/hooks/useStockCurrency';

function MyComponent() {
  const { format } = useStockCurrency();
  
  return <div>{format(1234.56)}</div>;
}
```

## Data Flow

```
User Settings Page
    ↓
Save Currency (Backend API)
    ↓
Store in Firestore + LocalStorage
    ↓
CurrencyContext loads on app start
    ↓
All pages access via:
  - formatStockCurrency()
  - useStockCurrency()
  - useOrganizationCurrency()
```

## Files Modified

1. **src/views/stock/StockDashboardOverview.jsx**
   - Added currency formatting for inventory value and activity amounts

2. **src/hooks/useStockCurrency.ts** (NEW)
   - Custom hook for easy currency access

3. **src/lib/stockCurrency.ts**
   - Enhanced formatting with proper number handling

4. **src/components/layout/DashboardProviders.tsx**
   - Already includes CurrencyProvider wrapper

## Testing

1. Go to: `http://localhost:3000/stock/user-settings`
2. Select currency: "RWF - RWANDAN FRANC (RWF)"
3. Click "Save Currency Settings"
4. Navigate to: `http://localhost:3000/stock` (dashboard)
5. Verify all amounts show "RWF" symbol
6. Check other pages (inventory, purchases, sales)
7. All should display amounts in RWF format

## Currency Storage

### LocalStorage Key
```
stock.currencySettings.v1
```

### Data Structure
```json
{
  "code": "RWF",
  "symbol": "RWF",
  "name": "RWANDAN FRANC",
  "decimalPlaces": 2
}
```

## Supported Currency Operations

- **Format with symbol**: `formatStockCurrency(1234.56)` → "RWF 1,234.56"
- **Format without symbol**: `formatStockCurrency(1234.56, false)` → "1,234.56"
- **Decimal places**: Respects currency decimal settings
- **Null handling**: Returns "-" for null/undefined values

## Benefits

✅ Single source of truth for currency
✅ Consistent formatting across all pages
✅ Easy to change currency organization-wide
✅ Supports multiple currencies
✅ Persists across sessions
✅ Works offline (localStorage fallback)

## Future Enhancements

- Multi-currency support per transaction
- Currency conversion rates
- Historical currency tracking
- Per-user currency preferences
