import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Chip, Box, Typography } from '@mui/material';
import axios from 'axios';

import { API_BASE_URL as API_URL } from '../../constants/api.js';

/**
 * TaxSelector Component
 * Professional tax selection with automatic calculation
 * Supports single tax, tax groups, and multiple taxes
 */
export default function TaxSelector({ 
  value = [], 
  onChange, 
  amount = 0, 
  priceType = 'Exclusive',
  disabled = false 
}) {
  const [taxes, setTaxes] = useState([]);
  const [taxGroups, setTaxGroups] = useState([]);
  const [selectedTaxes, setSelectedTaxes] = useState(value || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTaxes();
    fetchTaxGroups();
  }, []);

  useEffect(() => {
    setSelectedTaxes(value || []);
  }, [value]);

  const fetchTaxes = async () => {
    try {
      const token = localStorage.getItem('stockToken');
      const res = await axios.get(`${API_URL}/stock/taxes/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaxes(res.data || []);
    } catch (err) {
      console.error('Error fetching taxes:', err);
    }
  };

  const fetchTaxGroups = async () => {
    try {
      const token = localStorage.getItem('stockToken');
      const res = await axios.get(`${API_URL}/stock/taxes/groups/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaxGroups(res.data?.filter(g => g.isActive) || []);
    } catch (err) {
      console.error('Error fetching tax groups:', err);
    }
  };

  const calculateTaxAmount = (taxConfig, baseAmount) => {
    if (!taxConfig || !taxConfig.isActive) return 0;
    
    if (taxConfig.calculationType === 'Fixed') {
      return Number(taxConfig.fixedAmount) || 0;
    }
    
    const rate = Number(taxConfig.rate) || 0;
    if (taxConfig.priceType === 'Inclusive') {
      return (baseAmount * rate) / (100 + rate);
    }
    
    return (baseAmount * rate) / 100;
  };

  const handleTaxChange = (event) => {
    const value = event.target.value;
    
    if (value === '') {
      setSelectedTaxes([]);
      onChange([]);
      return;
    }

    // Check if it's a tax group
    const group = taxGroups.find(g => g.id === value);
    if (group) {
      // Get all taxes in the group
      const groupTaxes = taxes.filter(t => group.taxIds.includes(t.id));
      const taxesWithAmounts = groupTaxes.map(tax => ({
        taxId: tax.id,
        taxName: tax.taxName,
        taxCode: tax.taxCode,
        taxType: tax.taxType,
        taxRate: tax.calculationType === 'Percentage' ? tax.rate : 0,
        taxableAmount: amount,
        taxAmount: calculateTaxAmount(tax, amount),
        calculationType: tax.calculationType,
        priceType: tax.priceType,
      }));
      
      setSelectedTaxes(taxesWithAmounts);
      onChange(taxesWithAmounts);
      return;
    }

    // Single tax selection
    const tax = taxes.find(t => t.id === value);
    if (tax) {
      const taxWithAmount = {
        taxId: tax.id,
        taxName: tax.taxName,
        taxCode: tax.taxCode,
        taxType: tax.taxType,
        taxRate: tax.calculationType === 'Percentage' ? tax.rate : 0,
        taxableAmount: amount,
        taxAmount: calculateTaxAmount(tax, amount),
        calculationType: tax.calculationType,
        priceType: tax.priceType,
      };
      
      setSelectedTaxes([taxWithAmount]);
      onChange([taxWithAmount]);
    }
  };

  const handleRemoveTax = (taxId) => {
    const updated = selectedTaxes.filter(t => t.taxId !== taxId);
    setSelectedTaxes(updated);
    onChange(updated);
  };

  const totalTaxAmount = selectedTaxes.reduce((sum, t) => sum + (Number(t.taxAmount) || 0), 0);

  return (
    <Box>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel>Select Tax</InputLabel>
        <Select
          value=""
          onChange={handleTaxChange}
          label="Select Tax"
        >
          <MenuItem value="">
            <em>No Tax</em>
          </MenuItem>
          
          {taxGroups.length > 0 && (
            <MenuItem disabled>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Tax Groups
              </Typography>
            </MenuItem>
          )}
          {taxGroups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.groupName} ({group.taxIds?.length || 0} taxes)
            </MenuItem>
          ))}
          
          {taxes.length > 0 && (
            <MenuItem disabled>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Individual Taxes
              </Typography>
            </MenuItem>
          )}
          {taxes.map((tax) => (
            <MenuItem key={tax.id} value={tax.id}>
              {tax.taxName} ({tax.taxCode}) - {tax.calculationType === 'Percentage' ? `${tax.rate}%` : `$${tax.fixedAmount}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedTaxes.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
            Applied Taxes:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedTaxes.map((tax) => (
              <Chip
                key={tax.taxId}
                label={`${tax.taxName}: $${Number(tax.taxAmount).toFixed(2)}`}
                onDelete={() => handleRemoveTax(tax.taxId)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
          <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Total Tax: ${totalTaxAmount.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
