import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography, Alert } from "@mui/material";
import { AttachMoney as MoneyIcon, People as PeopleIcon } from "@mui/icons-material";
import { useStockAuth } from "../../context/StockAuthContext.jsx";
import { useStock } from "../../context/stockContext.jsx";
import CurrencySettings from "../../components/CurrencySettings";
import UserSettingsPage from "./UserSettingsPage";

export default function StockSettingsPage() {
  const { user } = useStockAuth();
  const { fetchCurrencySettings } = useStock();
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState("");

  const handleCurrencySave = async () => {
    setMessage('Currency settings updated successfully');
    // Refresh currency settings in context
    const stockId = user?.stockId || localStorage.getItem('stockId') || 'default';
    await fetchCurrencySettings(stockId);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="p-6">
      <Typography variant="h5" sx={{ fontWeight: 600, color: 'grey.800', mb: 3 }}>
        Stock Management Settings
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="User Management" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Currency Settings" icon={<MoneyIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {activeTab === 0 && <UserSettingsPage />}

      {activeTab === 1 && (
        <div className="max-w-2xl">
          {message && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Currency Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the currency to be used for all stock transactions, purchases, sales, expenses, and financial reports. This currency will be applied across the entire stock management system.
            </Typography>
            <CurrencySettings 
              organizationId={user?.stockId || localStorage.getItem('stockId') || 'default'}
              moduleType="stock"
              onSave={handleCurrencySave}
            />
          </div>
        </div>
      )}
    </div>
  );
}
