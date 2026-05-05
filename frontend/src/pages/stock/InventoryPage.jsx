import React, { useState, useEffect } from 'react';
import { useStock } from '../../context/stockContext';
import { usePurchase } from '../../context/PurchaseContext';
import { useSales } from '../../context/SalesContext';
import { inventoryService } from '../../services/stock.service';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, CircularProgress } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

export default function InventoryPage() {
  const { productSettings, loading } = useStock();
  const { purchases } = usePurchase();
  const { sales } = useSales();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [inventoryData, setInventoryData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [updatingStocks, setUpdatingStocks] = useState(false);

  useEffect(() => {
    fetchInventoryReport();
  }, [selectedDate]);

  const fetchInventoryReport = async () => {
    setLoadingReport(true);
    try {
      const data = await inventoryService.getReport(selectedDate);
      setInventoryData(data);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      // Fallback to local calculation
      calculateInventoryLocally();
    } finally {
      setLoadingReport(false);
    }
  };

  const calculateInventoryLocally = () => {
    const data = productSettings.map(product => {
      const openingStock = Number(product.openingStock) || 0;
      
      const purchasedQty = purchases
        .filter(p => p.productId === product.id && new Date(p.createdAt) <= new Date(selectedDate))
        .reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
      
      const soldQty = sales
        .filter(s => {
          if (s.items && Array.isArray(s.items)) {
            return s.items.some(item => item.productId === product.id) && new Date(s.createdAt) <= new Date(selectedDate);
          }
          return s.productId === product.id && new Date(s.createdAt) <= new Date(selectedDate);
        })
        .reduce((sum, s) => {
          if (s.items && Array.isArray(s.items)) {
            const item = s.items.find(i => i.productId === product.id);
            return sum + (Number(item?.quantity) || 0);
          }
          return sum + (Number(s.quantity) || 0);
        }, 0);
      
      const closingStock = openingStock + purchasedQty - soldQty;
      
      return {
        id: product.id,
        name: product.name,
        category: product.productCategory || product.storeCategory,
        unit: product.unit,
        openingStock,
        purchasedQty,
        soldQty,
        closingStock,
        reorderLevel: product.reorderLevel || 0,
        status: closingStock <= (product.reorderLevel || 0) ? 'Low Stock' : 'In Stock'
      };
    });
    
    setInventoryData(data);
  };

  const handleUpdateOpeningStocks = async () => {
    if (!window.confirm('This will update opening stocks for all products based on current closing stock. Continue?')) {
      return;
    }
    
    setUpdatingStocks(true);
    try {
      await inventoryService.updateOpeningStocks();
      alert('Opening stocks updated successfully!');
      fetchInventoryReport();
    } catch (error) {
      console.error('Error updating opening stocks:', error);
      alert('Failed to update opening stocks');
    } finally {
      setUpdatingStocks(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Stock Inventory Report
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchInventoryReport}
              disabled={loadingReport}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateOpeningStocks}
              disabled={updatingStocks}
              sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' } }}
            >
              {updatingStocks ? 'Updating...' : 'Update Opening Stocks'}
            </Button>
          </Box>
        </Box>
        
        <TextField
          type="date"
          label="Select Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ mb: 3, width: 250 }}
          InputLabelProps={{ shrink: true }}
        />

        {loadingReport ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#0d9488' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Product Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Unit</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Opening Stock</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Purchases</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Sales</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Closing Stock</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Reorder Level</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryData.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell align="right">{item.openingStock}</TableCell>
                    <TableCell align="right" sx={{ color: 'green' }}>+{item.purchasedQty}</TableCell>
                    <TableCell align="right" sx={{ color: 'red' }}>-{item.soldQty}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{item.closingStock}</TableCell>
                    <TableCell align="right">{item.reorderLevel}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: item.status === 'Low Stock' ? 'error.main' : 'success.main',
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }}
                      >
                        {item.status}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f9ff', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0369a1' }}>
            📌 Note: Today's closing stock becomes tomorrow's opening stock (Professional Accounting Standard)
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
