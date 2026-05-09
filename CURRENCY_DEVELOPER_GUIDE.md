# Currency Usage Guide for Developers

## Quick Start

### 1. Display Currency in Any Component

```jsx
import CurrencyDisplay from '../../components/stock/CurrencyDisplay';

// In your component
<CurrencyDisplay amount={1234.56} />
// Output: £1,234.56 (if GBP is selected)

// Without symbol
<CurrencyDisplay amount={1234.56} showSymbol={false} />
// Output: 1,234.56
```

### 2. Access Currency Settings

```jsx
import { useStockCurrency } from '../../context/stockContext';

function MyComponent() {
  const { currency, formatAmount } = useStockCurrency();
  
  // Get currency info
  console.log(currency.code);    // "GBP"
  console.log(currency.symbol);  // "£"
  console.log(currency.name);    // "British Pound"
  
  // Format amount manually
  const formatted = formatAmount(1234.56);
  // Returns: "£1,234.56"
  
  return <div>{formatted}</div>;
}
```

### 3. Use in Tables

```jsx
const fields = [
  { name: 'productName', label: 'Product' },
  { name: 'unitPrice', label: 'Price', type: 'currency' },
  { name: 'totalPrice', label: 'Total', type: 'currency' }
];

// In table cell
<td>
  <CurrencyDisplay amount={row.unitPrice} />
</td>
```

### 4. Use in Forms

```jsx
import { useStockCurrency } from '../../context/stockContext';

function PriceForm() {
  const { currency } = useStockCurrency();
  const [price, setPrice] = useState(0);
  
  return (
    <div>
      <label>Price ({currency.symbol})</label>
      <input 
        type="number" 
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        step={`0.${'0'.repeat(currency.decimalPlaces - 1)}1`}
      />
      <div>Preview: <CurrencyDisplay amount={price} /></div>
    </div>
  );
}
```

### 5. Use in Calculations

```jsx
import { useStockCurrency } from '../../context/stockContext';

function calculateTotal(items) {
  const { currency } = useStockCurrency();
  
  const total = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  
  // Round to currency decimal places
  return Number(total.toFixed(currency.decimalPlaces));
}
```

## Common Patterns

### Pattern 1: Display Price with Label
```jsx
<div className="price-display">
  <span className="label">Total:</span>
  <span className="amount">
    <CurrencyDisplay amount={totalAmount} />
  </span>
</div>
```

### Pattern 2: Conditional Currency Display
```jsx
{amount > 0 ? (
  <CurrencyDisplay amount={amount} />
) : (
  <span className="text-gray-400">-</span>
)}
```

### Pattern 3: Currency in Card/Summary
```jsx
<Card>
  <CardContent>
    <Typography variant="h6">Revenue</Typography>
    <Typography variant="h4">
      <CurrencyDisplay amount={revenue} />
    </Typography>
  </CardContent>
</Card>
```

### Pattern 4: Currency in List Items
```jsx
{items.map(item => (
  <div key={item.id} className="flex justify-between">
    <span>{item.name}</span>
    <CurrencyDisplay amount={item.price} />
  </div>
))}
```

### Pattern 5: Currency with Color Coding
```jsx
<span className={amount >= 0 ? 'text-green-600' : 'text-red-600'}>
  <CurrencyDisplay amount={amount} />
</span>
```

## Best Practices

### ✅ DO
- Always use `<CurrencyDisplay>` for monetary values
- Use `formatAmount()` when you need a string
- Store amounts as numbers in state/database
- Use proper decimal places for calculations
- Handle null/undefined amounts gracefully

### ❌ DON'T
- Don't hardcode currency symbols (£, $, etc.)
- Don't format currency manually with string concatenation
- Don't assume 2 decimal places (some currencies have 0 or 3)
- Don't mix currency types in calculations
- Don't forget to handle edge cases (0, negative, null)

## Advanced Usage

### Custom Formatting
```jsx
import { useStockCurrency } from '../../context/stockContext';

function CustomCurrencyDisplay({ amount, prefix, suffix }) {
  const { formatAmount } = useStockCurrency();
  
  return (
    <span>
      {prefix} {formatAmount(amount)} {suffix}
    </span>
  );
}

// Usage
<CustomCurrencyDisplay 
  amount={1234.56} 
  prefix="Total:" 
  suffix="(incl. tax)"
/>
// Output: Total: £1,234.56 (incl. tax)
```

### Currency in API Calls
```jsx
// When sending to backend
const data = {
  amount: Number(amount), // Always send as number
  currency: currency.code // Send currency code if needed
};

// When receiving from backend
const displayAmount = (
  <CurrencyDisplay amount={response.data.amount} />
);
```

### Currency in Reports
```jsx
function FinancialReport() {
  const { formatAmount } = useStockCurrency();
  
  const reportData = {
    revenue: 50000,
    expenses: 30000,
    profit: 20000
  };
  
  return (
    <div>
      <h2>Financial Summary</h2>
      <table>
        <tr>
          <td>Revenue:</td>
          <td><CurrencyDisplay amount={reportData.revenue} /></td>
        </tr>
        <tr>
          <td>Expenses:</td>
          <td><CurrencyDisplay amount={reportData.expenses} /></td>
        </tr>
        <tr>
          <td>Profit:</td>
          <td className="font-bold">
            <CurrencyDisplay amount={reportData.profit} />
          </td>
        </tr>
      </table>
    </div>
  );
}
```

## Troubleshooting

### Issue: Currency not displaying
**Solution**: Check that CurrencyProvider wraps your component in App.jsx

### Issue: Wrong currency showing
**Solution**: Verify currency is set in User Settings page

### Issue: Decimal places incorrect
**Solution**: Use currency.decimalPlaces from useStockCurrency()

### Issue: Currency not updating
**Solution**: Ensure component is using useStockCurrency() hook

## Testing

### Test Currency Display
```jsx
import { render } from '@testing-library/react';
import CurrencyDisplay from './CurrencyDisplay';

test('displays currency correctly', () => {
  const { getByText } = render(
    <CurrencyDisplay amount={1234.56} />
  );
  expect(getByText(/1234.56/)).toBeInTheDocument();
});
```

## Examples by Page Type

### Sales Page
```jsx
// Product price
<CurrencyDisplay amount={product.sellingPrice} />

// Cart total
<CurrencyDisplay amount={cartTotal} />

// Discount amount
<CurrencyDisplay amount={discountAmount} />
```

### Purchase Page
```jsx
// Unit cost
<CurrencyDisplay amount={item.unitCost} />

// Invoice total
<CurrencyDisplay amount={invoiceTotal} />

// Payment amount
<CurrencyDisplay amount={paymentAmount} />
```

### Inventory Page
```jsx
// Stock value
<CurrencyDisplay amount={stockValue} />

// Average cost
<CurrencyDisplay amount={averageCost} />

// Total inventory value
<CurrencyDisplay amount={totalInventoryValue} />
```

### Reports Page
```jsx
// Revenue
<CurrencyDisplay amount={totalRevenue} />

// Profit margin
<CurrencyDisplay amount={profitMargin} />

// Net income
<CurrencyDisplay amount={netIncome} />
```

## Summary

**Key Points:**
1. Always use `<CurrencyDisplay>` component for amounts
2. Access currency settings with `useStockCurrency()` hook
3. Store amounts as numbers, display with currency
4. Currency is set in User Settings page
5. Currency applies automatically across all pages

**Remember:**
- Currency is organization-wide
- Changes apply immediately
- All monetary values should use currency display
- Backend handles currency storage
- Frontend handles currency formatting

---

**For Questions**: Check CURRENCY_INTEGRATION_COMPLETE.md
**Last Updated**: January 2025
