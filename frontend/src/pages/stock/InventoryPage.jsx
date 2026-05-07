import React, { useState, useEffect, useMemo } from 'react';
import { useStock } from '../../context/stockContext';
import { usePurchase } from '../../context/PurchaseContext';
import { useSales } from '../../context/SalesContext';
import { inventoryService } from '../../services/stock.service';
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [inventoryData, setInventoryData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [updatingStocks, setUpdatingStocks] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchInventoryReport();
  }, [selectedDate]);

  const fetchInventoryReport = async () => {
    setLoadingReport(true);
    try {
      const data = await inventoryService.getReport(selectedDate);
      console.log('📊 Inventory report fetched:', data);
      
      // Process the data to add categoryType
      const processedData = data.map(item => ({
        ...item,
        categoryType: getCategoryType(item.storeCategory),
        productionQty: item.productionQty || 0
      }));
      
      console.log('📈 Processed inventory data:', {
        total: processedData.length,
        raw: processedData.filter(d => d.categoryType === 'raw').length,
        finished: processedData.filter(d => d.categoryType === 'finished').length,
        other: processedData.filter(d => d.categoryType === 'other').length
      });
      
      setInventoryData(processedData);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      // Fallback to local calculation
      calculateInventoryLocally();
    } finally {
      setLoadingReport(false);
    }
  };

  const calculateInventoryLocally = () => {
    console.log('📊 Calculating inventory from productSettings:', productSettings.length);
    console.log('📦 Sample productSettings data:', productSettings.slice(0, 2));
    
    const data = productSettings.map(product => {
      const openingStock = Number(product.openingStock) || 0;
      
      const purchasedQty = purchases
        .filter(p => p.productId === product.id && new Date(p.createdAt) <= new Date(selectedDate))
        .reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
      
      // Calculate production quantity (for finished products)
      // This would come from production cycles or finished goods records
      // For now, we'll calculate it as: currentStock - openingStock - purchases + sales
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
      
      const currentStock = Number(product.currentStock) || 0;
      const closingStock = openingStock + purchasedQty - soldQty;
      
      // Calculate production: if closing stock doesn't match calculation, the difference is production
      const calculatedStock = openingStock + purchasedQty - soldQty;
      const productionQty = currentStock - calculatedStock;
      
      // Use productCategory for display, storeCategory for type detection
      const displayCategory = getDisplayCategory(product);
      const categoryType = getCategoryType(product.storeCategory);
      
      console.log(`📝 Product: "${product.name}"`);  
      console.log(`   - productCategory (display): "${product.productCategory}"`);  
      console.log(`   - storeCategory (for filtering): "${product.storeCategory}"`);  
      console.log(`   - Display as: "${displayCategory}"`);  
      console.log(`   - Detected type: ${categoryType}`);
      console.log(`   - Production: ${productionQty}`);
      console.log(`   ---`);
      
      return {
        id: product.id,
        name: product.name,
        category: displayCategory,
        categoryType,
        storeCategory: product.storeCategory,
        unit: product.unit,
        openingStock,
        purchasedQty,
        productionQty: productionQty > 0 ? productionQty : 0,
        soldQty,
        closingStock: currentStock,
        reorderLevel: product.reorderLevel || 0,
        status: currentStock <= (product.reorderLevel || 0) ? 'Low Stock' : 'In Stock'
      };
    });
    
    const rawCount = data.filter(d => d.categoryType === 'raw').length;
    const finishedCount = data.filter(d => d.categoryType === 'finished').length;
    const otherCount = data.filter(d => d.categoryType === 'other').length;
    
    console.log('📈 Inventory data summary:', {
      total: data.length,
      raw: rawCount,
      finished: finishedCount,
      other: otherCount
    });
    
    console.log('🔍 Raw materials:', data.filter(d => d.categoryType === 'raw').map(d => `${d.name} (store: ${d.storeCategory})`));
    console.log('🔍 Finished products:', data.filter(d => d.categoryType === 'finished').map(d => `${d.name} (store: ${d.storeCategory})`));
    console.log('🔍 Other items:', data.filter(d => d.categoryType === 'other').map(d => `${d.name} (store: ${d.storeCategory})`));
    
    setInventoryData(data);
  };

  // Helper function to determine category type based on STORE CATEGORY only
  const getCategoryType = (storeCategory) => {
    if (!storeCategory) return 'other';
    const cat = String(storeCategory).toLowerCase().trim();
    
    // Check for exact matches first
    if (cat === 'raw materials' || cat === 'raw material') return 'raw';
    if (cat === 'finished products' || cat === 'finished product' || cat === 'finished goods') return 'finished';
    
    // Check for partial matches
    if (cat.includes('raw') && cat.includes('material')) return 'raw';
    if (cat.includes('finished') && cat.includes('product')) return 'finished';
    if (cat.includes('finished') || cat.includes('final')) return 'finished';
    if (cat.includes('raw') || cat.includes('material')) return 'raw';
    
    return 'other';
  };

  // Get display category (productCategory for display, storeCategory for filtering)
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

    return {
      total: inventoryData.length,
      rawMaterials: rawMaterials.length,
      finishedProducts: finishedProducts.length,
      lowStock: lowStock.length,
      totalValue: inventoryData.reduce((sum, item) => sum + (item.closingStock * (item.costPrice || 0)), 0)
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
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No items found in this category
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.category} 
                          size="small"
                          color={item.categoryType === 'raw' ? 'warning' : item.categoryType === 'finished' ? 'success' : 'default'}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell align="right">{item.openingStock}</TableCell>
                      <TableCell align="right" sx={{ color: 'green' }}>+{item.purchasedQty}</TableCell>
                      <TableCell align="right" sx={{ color: '#0d9488', fontWeight: 600 }}>+{item.productionQty || 0}</TableCell>
                      <TableCell align="right" sx={{ color: 'red' }}>-{item.soldQty}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{item.closingStock}</TableCell>
                      <TableCell align="right">{item.reorderLevel}</TableCell>
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
            📌 Inventory Categories:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Raw Materials" color="warning" size="small" icon={<CategoryIcon />} />
            <Chip label="Finished Products" color="success" size="small" icon={<CategoryIcon />} />
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#0369a1' }}>
            Note: Today's closing stock becomes tomorrow's opening stock (Professional Accounting Standard)
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
