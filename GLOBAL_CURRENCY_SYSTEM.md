# Global Currency Settings System

## Overview
A professional, enterprise-grade currency management system that allows each organization (Hospital, Stock, Pharmacy, HR) to select and use their preferred currency across all transactions and displays.

## Features
✅ Multi-currency support with 10+ pre-configured currencies
✅ Organization-specific currency settings
✅ Module-specific currency configuration (Hospital, Stock, Pharmacy, HR)
✅ Automatic currency formatting with proper decimal places
✅ Centralized currency management via Super Admin
✅ Easy integration across all modules
✅ Professional currency display components

## Architecture

### Backend Components

#### 1. Currency Model (`backend/src/models/currency.model.js`)
- Manages currency CRUD operations
- Stores currency code, name, symbol, and decimal places
- Handles organization-specific currency settings
- Supports active/inactive status

#### 2. Currency Controller (`backend/src/controllers/currency.controller.js`)
- `POST /api/v1/currency` - Create new currency
- `GET /api/v1/currency` - Get all currencies
- `GET /api/v1/currency/active` - Get active currencies only
- `GET /api/v1/currency/:id` - Get currency by ID
- `PUT /api/v1/currency/:id` - Update currency
- `DELETE /api/v1/currency/:id` - Delete currency
- `POST /api/v1/currency/default` - Set organization default currency
- `GET /api/v1/currency/default/:organizationId/:moduleType` - Get organization default
- `POST /api/v1/currency/initialize` - Initialize default currencies

#### 3. Updated Organization Models
All organization models now include `currencyId` field:
- `Hospital.model.js`
- `Stock.model.js`
- `Pharmacy.model.js`
- `HROrganization.model.js`

### Frontend Components

#### 1. Currency Context (`frontend/src/context/CurrencyContext.jsx`)
Global state management for currencies:
```javascript
const { 
  currencies,              // All available currencies
  defaultCurrency,         // Current organization's currency
  formatCurrency,          // Format amount with currency
  setOrganizationCurrency, // Set organization currency
  fetchDefaultCurrency     // Fetch organization currency
} = useCurrency();
```

#### 2. Currency Settings Component (`frontend/src/components/CurrencySettings.jsx`)
Reusable component for currency selection:
```jsx
<CurrencySettings 
  organizationId={hospital.id}
  moduleType="hospital"
  onSave={() => console.log('Currency saved')}
/>
```

#### 3. Currency Display Component (`frontend/src/components/CurrencyDisplay.jsx`)
Display formatted currency values:
```jsx
<CurrencyDisplay amount={1500.50} />
// Output: $1,500.50 (based on organization currency)
```

#### 4. Currency Hook (`frontend/src/hooks/useCurrencyFormat.js`)
Easy currency formatting in any component:
```javascript
const { currency, formatAmount } = useOrganizationCurrency(organizationId, 'hospital');
const formatted = formatAmount(1500.50); // Returns: $1,500.50
```

#### 5. Super Admin Currency Management (`frontend/src/pages/superAdmin/CurrencyManagement.jsx`)
Full currency management interface for Super Admin:
- View all currencies
- Add new currencies
- Activate/deactivate currencies
- Initialize default currencies

## Pre-configured Currencies

The system comes with 10 major world currencies:

| Code | Name | Symbol | Decimals |
|------|------|--------|----------|
| USD | US Dollar | $ | 2 |
| EUR | Euro | € | 2 |
| GBP | British Pound | £ | 2 |
| JPY | Japanese Yen | ¥ | 0 |
| CNY | Chinese Yuan | ¥ | 2 |
| INR | Indian Rupee | ₹ | 2 |
| AED | UAE Dirham | د.إ | 2 |
| SAR | Saudi Riyal | ر.س | 2 |
| CAD | Canadian Dollar | C$ | 2 |
| AUD | Australian Dollar | A$ | 2 |

## Setup Instructions

### 1. Initialize Default Currencies
```bash
# Via API call
POST http://localhost:3001/api/v1/currency/initialize
```

Or use the Super Admin interface:
1. Login as Super Admin
2. Navigate to Currency Management
3. Click "Initialize Default Currencies"

### 2. Set Organization Currency

#### For Hospital:
```javascript
await setOrganizationCurrency(hospitalId, 'hospital', currencyId);
```

#### For Stock:
```javascript
await setOrganizationCurrency(stockId, 'stock', currencyId);
```

#### For Pharmacy:
```javascript
await setOrganizationCurrency(pharmacyId, 'pharmacy', currencyId);
```

#### For HR:
```javascript
await setOrganizationCurrency(organizationId, 'hr', currencyId);
```

## Integration Examples

### Hospital Module Integration

```jsx
import { useOrganizationCurrency } from '../../hooks/useCurrencyFormat';

const HospitalBilling = () => {
  const { hospital } = useHospitalAuth();
  const { formatAmount } = useOrganizationCurrency(hospital?.id, 'hospital');
  
  return (
    <div>
      <h3>Total Bill: {formatAmount(1500.50)}</h3>
    </div>
  );
};
```

### Stock Module Integration

```jsx
import { useOrganizationCurrency } from '../../hooks/useCurrencyFormat';

const StockSales = () => {
  const { stock } = useStockAuth();
  const { formatAmount } = useOrganizationCurrency(stock?.id, 'stock');
  
  return (
    <div>
      <h3>Total Sales: {formatAmount(25000)}</h3>
    </div>
  );
};
```

### Pharmacy Module Integration

```jsx
import { useOrganizationCurrency } from '../../hooks/useCurrencyFormat';

const PharmacyOrders = () => {
  const { pharmacy } = usePharmacyAuth();
  const { formatAmount } = useOrganizationCurrency(pharmacy?.id, 'pharmacy');
  
  return (
    <div>
      <h3>Order Total: {formatAmount(350.75)}</h3>
    </div>
  );
};
```

### HR/Payroll Module Integration

```jsx
import { useOrganizationCurrency } from '../../hooks/useCurrencyFormat';

const PayrollDashboard = () => {
  const { organization } = useHRAuth();
  const { formatAmount } = useOrganizationCurrency(organization?.id, 'hr');
  
  return (
    <div>
      <h3>Total Payroll: {formatAmount(150000)}</h3>
    </div>
  );
};
```

## Adding Currency Settings to Organization Setup

### Hospital Setup Page
```jsx
import CurrencySettings from '../../components/CurrencySettings';

const HospitalSettings = () => {
  const { hospital } = useHospitalAuth();
  
  return (
    <div>
      <h2>Hospital Settings</h2>
      <CurrencySettings 
        organizationId={hospital.id}
        moduleType="hospital"
        onSave={() => alert('Currency updated!')}
      />
    </div>
  );
};
```

## Database Structure

### Firestore Collections

#### `currencies` Collection
```javascript
{
  code: "USD",
  name: "US Dollar",
  symbol: "$",
  decimalPlaces: 2,
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `currency_settings` Collection
Document ID: `{organizationId}_{moduleType}`
```javascript
{
  organizationId: "hospital123",
  moduleType: "hospital",
  currencyId: "currency456",
  updatedAt: Timestamp
}
```

#### Updated Organization Documents
```javascript
// hospitals, stocks, pharmacies, hr_organizations
{
  name: "Organization Name",
  currencyId: "currency456",  // NEW FIELD
  // ... other fields
}
```

## API Endpoints

### Currency Management
- `POST /api/v1/currency/initialize` - Initialize default currencies
- `POST /api/v1/currency` - Create currency
- `GET /api/v1/currency` - Get all currencies
- `GET /api/v1/currency/active` - Get active currencies
- `GET /api/v1/currency/:id` - Get currency by ID
- `PUT /api/v1/currency/:id` - Update currency
- `DELETE /api/v1/currency/:id` - Delete currency

### Organization Currency Settings
- `POST /api/v1/currency/default` - Set organization default currency
  ```json
  {
    "organizationId": "hospital123",
    "moduleType": "hospital",
    "currencyId": "currency456"
  }
  ```
- `GET /api/v1/currency/default/:organizationId/:moduleType` - Get organization currency

## Best Practices

1. **Always initialize currencies first** before setting up organizations
2. **Set currency during organization creation** for better UX
3. **Use the currency hook** for consistent formatting across the app
4. **Don't hardcode currency symbols** - always use the currency system
5. **Test with different currencies** to ensure proper decimal handling
6. **Cache currency data** to reduce API calls

## Testing

### Test Currency Initialization
```bash
curl -X POST http://localhost:3001/api/v1/currency/initialize
```

### Test Setting Organization Currency
```bash
curl -X POST http://localhost:3001/api/v1/currency/default \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "hospital123",
    "moduleType": "hospital",
    "currencyId": "currency456"
  }'
```

### Test Getting Organization Currency
```bash
curl http://localhost:3001/api/v1/currency/default/hospital123/hospital
```

## Troubleshooting

### Currency not displaying
1. Check if currencies are initialized
2. Verify organization has currencyId set
3. Ensure CurrencyProvider wraps your app
4. Check browser console for errors

### Wrong currency showing
1. Verify correct organizationId is passed
2. Check moduleType matches ('hospital', 'stock', 'pharmacy', 'hr')
3. Confirm currency_settings document exists

### Formatting issues
1. Check currency decimalPlaces setting
2. Verify amount is a valid number
3. Test with different amounts (including 0)

## Future Enhancements

- [ ] Multi-currency support (display in multiple currencies)
- [ ] Currency conversion rates
- [ ] Historical currency data
- [ ] Currency exchange rate API integration
- [ ] Bulk currency operations
- [ ] Currency audit logs
- [ ] Custom currency symbols per organization

## Support

For issues or questions:
1. Check this documentation
2. Review the code examples
3. Test with the provided API endpoints
4. Contact system administrator

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅
