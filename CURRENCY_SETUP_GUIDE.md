# Currency Setup Guide for Stock Management System

## Overview
The currency system has been integrated into the User Settings page at `/stock/user-settings`. This allows you to configure the default currency for all stock transactions, purchases, sales, expenses, and financial reports.

## Setup Steps

### Step 1: Start the Backend Server
Make sure your backend server is running:

```bash
cd backend
npm run dev
```

The server should start on `http://localhost:3001`

### Step 2: Initialize Currencies

**Option A: Using the UI (Recommended)**
1. Navigate to `http://localhost:5173/stock/user-settings`
2. Look for the "Currency Configuration" section
3. If no currencies are available, click the "Initialize Currencies" button
4. Wait for the success message
5. The page will reload automatically with all available currencies

**Option B: Using the Batch Script**
1. Double-click `initialize-currencies-simple.bat` in the project root
2. Wait for the script to complete
3. Refresh the user settings page

**Option C: Using curl (Manual)**
```bash
curl -X POST http://localhost:3001/api/v1/currency/initialize -H "Content-Type: application/json"
```

### Step 3: Select Your Currency
1. After initialization, you'll see a dropdown with 10 currencies:
   - USD - US Dollar ($)
   - EUR - Euro (€)
   - GBP - British Pound (£)
   - JPY - Japanese Yen (¥)
   - CNY - Chinese Yuan (¥)
   - INR - Indian Rupee (₹)
   - AED - UAE Dirham (د.إ)
   - SAR - Saudi Riyal (ر.س)
   - CAD - Canadian Dollar (C$)
   - AUD - Australian Dollar (A$)

2. Select your preferred currency from the dropdown
3. Click the "Save" button
4. You'll see a success message confirming the currency has been set

### Step 4: Verify Currency Settings
- The current currency will be displayed in a green box below the selector
- This currency will now be used across all stock management features

## Features

### Currency Configuration Section
- **Professional UI**: Clean card-based design with icon and description
- **Currency Selector**: Dropdown showing currency code, name, and symbol
- **Save Functionality**: Persists currency selection to the database
- **Current Currency Display**: Shows the active currency in a highlighted box
- **Status Messages**: Success/error alerts with auto-dismiss
- **Loading States**: Disabled controls during save operations

### Integration Points
The selected currency will be automatically used in:
- Product pricing
- Purchase orders
- Sales invoices
- Expense tracking
- Financial reports (Income Statement, Balance Sheet, Cash Flow)
- Inventory valuation
- Supplier and customer transactions

## Troubleshooting

### No Currencies in Dropdown
**Problem**: The dropdown shows "-- Select Currency --" with no options

**Solutions**:
1. Check if backend server is running on port 3001
2. Click "Initialize Currencies" button in the UI
3. Check browser console for API errors
4. Verify Firebase is properly configured

### Backend Not Starting
**Problem**: Backend server fails to start

**Solutions**:
1. Check if port 3001 is already in use
2. Verify Firebase credentials in `.env.development`
3. Run `npm install` in the backend directory
4. Check for any error messages in the console

### Currency Not Saving
**Problem**: Currency selection doesn't persist

**Solutions**:
1. Check browser console for API errors
2. Verify Firebase connection is active
3. Check if organization ID is set in localStorage
4. Try refreshing the page and selecting again

## API Endpoints

The currency system uses these endpoints:

- `POST /api/v1/currency/initialize` - Initialize default currencies
- `GET /api/v1/currency/active` - Get all active currencies
- `POST /api/v1/currency/default` - Set default currency for organization
- `GET /api/v1/currency/default/:orgId/:moduleType` - Get default currency

## Technical Details

### Storage
- Currencies are stored in Firebase Firestore collection: `currencies`
- Currency settings are stored in: `currency_settings`
- Organization ID: Retrieved from localStorage key `stockOrganizationId`
- Module Type: `stock`

### Context Provider
The currency system uses React Context (`CurrencyContext`) to:
- Fetch and cache available currencies
- Manage default currency state
- Provide currency formatting utilities
- Handle API communication

### Components
- **UserSettingsPage**: Main settings page with currency configuration
- **CurrencyContext**: Global currency state management
- **CurrencyDisplay**: Component for displaying formatted currency values

## Next Steps

After setting up your currency:
1. Create products with prices in your selected currency
2. Generate purchase orders and sales invoices
3. Track expenses and revenue
4. View financial reports with consistent currency formatting

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify backend server logs
3. Ensure Firebase is properly configured
4. Check that all dependencies are installed

---

**Last Updated**: 2024
**Version**: 1.0
