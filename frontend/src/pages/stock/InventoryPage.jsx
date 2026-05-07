import React, { useState, useEffect, useMemo } from 'react';
import { useStock } from '../../context/stockContext';
import { usePurchase } from '../../context/PurchaseContext';
import { useSales } from '../../context/SalesContext';
import { inventoryService } from '../../services/stock.service';
import { useOrganizationCurrency } from '../../hooks/useCurrencyFormat';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Button, 
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Refresh as RefreshIcon, Inventory as InventoryIcon, Category as CategoryIcon } from '@mui/icons-material';

export default function InventoryPage() {
  const { productSettings, loading } = useStock();
  const { purchases } = usePurchase();
  const { sales } = useSales();
  const { formatAmount } = useOrganizationCurrency();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [inventoryData, setInventoryData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [updatingStocks, setUpdatingStocks] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  const [valuationMethod, setValuationMethod] = useState('FIFO');

  useEffect(() => {
    fetchInventoryReport();
  }, [selectedDate, valuationMethod]);

  const fetchInventoryReport = async () => {
    setLoadingReport(true);
    try {
      const data = await inventoryService.getReport(selectedDate, valuationMethod);
      
      const processedData = data.map(item => ({
        ...item,
        categoryType: getCategoryType(item.storeCategory),
        productionQty: item.productionQty || 0
      }));
      
      setInventoryData(processedData);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      calculateInventoryLocally();
    } finally {
      setLoadingReport(false);
    }
  };

  const calculateInventoryLocally = () => {
    const data = productSettings.map(product => {
      const openingStock = Number(product.openingStock) || 0;
      const currentStock = Number(product.currentStock) || 0;
      
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
      
      const productionQty = Math.max(0, currentStock - openingStock - purchasedQty + soldQty);
      
      const unitPrice = Number(product.defaultBuyingPrice) || 0;
      const openingValue = openingStock * unitPrice;
      const closingValue = currentStock * unitPrice;
      
      const displayCategory = getDisplayCategory(product);
      const categoryType = getCategoryType(product.storeCategory);
      
      return {
        id: product.id,
        name: product.name,
        category: displayCategory,
        categoryType,
        storeCategory: product.storeCategory,
        unit: product.unit,
        openingStock,
        purchasedQty,
        productionQty,
        soldQty,
        closingStock: currentStock,
        reorderLevel: product.reorderLevel || 0,
        unitPrice,
        openingValue,
        closingValue,
        status: currentStock <= (product.reorderLevel || 0) ? 'Low Stock' : 'In Stock'
      };
    });
    
    setInventoryData(data);
  };

  const getCategoryType = (storeCategory) => {
    if (!storeCategory) return 'other';
    const cat = String(storeCategory).toLowerCase().trim();
    
    if (cat === 'raw materials' || cat === 'raw material') return 'raw';
    if (cat === 'finished products' || cat === 'finished product' || cat === 'finished goods') return 'finished';
    
    if (cat.includes('raw') && cat.includes('material')) return 'raw';
    if (cat.includes('finished') && cat.includes('product')) return 'finished';
    if (cat.includes('finished') || cat.includes('final')) return 'finished';
    if (cat.includes('raw') || cat.includes('material')) return 'raw';
    
    return 'other';
  };

  const getDisplayCategory = (product) => {
    return product.productCategory || product.storeCategory || 'Uncategorized';
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(inventoryData.map(item => item.category))];
    return cats.sort();
  }, [inventoryData]);

  // Filter data by category
  const filteredData = useMemo(() => {
    let filtered = inventoryData;

    // Filter by tab (category type)
    if (activeTab === 1) {
      filtered = filtered.filter(item => item.categoryType === 'raw');
    } else if (activeTab === 2) {
      filtered = filtered.filter(item => item.categoryType === 'finished');
    }

    // Filter by specific category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    return filtered;
  }, [inventoryData, activeTab, categoryFilter]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const rawMaterials = inventoryData.filter(item => item.categoryType === 'raw');
    const finishedProducts = inventoryData.filter(item => item.categoryType === 'finished');
    const lowStock = inventoryData.filter(item => item.status === 'Low Stock');
    const totalInventoryValue = inventoryData.reduce((sum, item) => sum + (item.closingValue || 0), 0);

    return {
      total: inventoryData.length,
      rawMaterials: rawMaterials.length,
      finishedProducts: finishedProducts.length,
      lowStock: lowStock.length,
      totalValue: totalInventoryValue
    };
  }, [inventoryData]);

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InventoryIcon /> Stock Inventory Report
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage and track your raw materials and finished products
            </Typography>
          </Box>
          
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

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, bgcolor: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <Typography variant="body2" color="text.secondary">Total Items</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#0369a1' }}>{summaryStats.total}</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: '#fef3c7', border: '1px solid #fde68a' }}>
            <Typography variant="body2" color="text.secondary">Raw Materials</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#d97706' }}>{summaryStats.rawMaterials}</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: '#d1fae5', border: '1px solid #a7f3d0' }}>
            <Typography variant="body2" color="text.secondary">Finished Products</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#059669' }}>{summaryStats.finishedProducts}</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: '#fee2e2', border: '1px solid #fecaca' }}>
            <Typography variant="body2" color="text.secondary">Low Stock Items</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#dc2626' }}>{summaryStats.lowStock}</Typography>
          </Paper>
          <Paper sx={{ p: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <Typography variant="body2" color="text.secondary">Total Inventory Value</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#16a34a' }}>{formatAmount(summaryStats.totalValue)}</Typography>
          </Paper>
        </Box>

        {/* Tabs for category types */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="All Items" icon={<InventoryIcon />} iconPosition="start" />
            <Tab 
              label={`Raw Materials (${summaryStats.rawMaterials})`} 
              icon={<CategoryIcon />} 
              iconPosition="start" 
            />
            <Tab 
              label={`Finished Products (${summaryStats.finishedProducts})`} 
              icon={<CategoryIcon />} 
              iconPosition="start" 
            />
          </Tabs>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            type="date"
            label="Select Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ width: 250 }}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Valuation Method</InputLabel>
            <Select
              value={valuationMethod}
              onChange={(e) => setValuationMethod(e.target.value)}
              label="Valuation Method"
            >
              <MenuItem value="FIFO">FIFO (First In First Out)</MenuItem>
              <MenuItem value="LIFO">LIFO (Last In First Out)</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Filter by Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

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
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Production</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Sales</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Closing Stock</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Reorder Level</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Unit Price</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Total Value</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No items found in this category
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.category} 
                          size="small"
                          color={item.categoryType === 'raw' ? 'warning' : item.categoryType === 'finished' ? 'success' : 'default'}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell align="right">{item.openingStock.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ color: 'green', fontWeight: 500 }}>+{item.purchasedQty.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ color: '#0d9488', fontWeight: 600 }}>+{(item.productionQty || 0).toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ color: 'red', fontWeight: 500 }}>-{item.soldQty.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>{item.closingStock.toLocaleString()}</TableCell>
                      <TableCell align="right">{item.reorderLevel.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500 }}>{formatAmount(item.unitPrice)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: '#16a34a' }}>{formatAmount(item.closingValue)}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          color={item.status === 'Low Stock' ? 'error' : 'success'}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f9ff', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0369a1', mb: 1 }}>
            📌 Inventory Valuation: {valuationMethod}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Raw Materials" color="warning" size="small" icon={<CategoryIcon />} />
            <Chip label="Finished Products" color="success" size="small" icon={<CategoryIcon />} />
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#0369a1' }}>
            {valuationMethod === 'FIFO' 
              ? 'FIFO: Oldest inventory costs are used first (IAS 2 compliant)'
              : 'LIFO: Newest inventory costs are used first (IAS 2 compliant)'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
