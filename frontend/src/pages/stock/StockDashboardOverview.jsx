import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStockAuth } from "../../context/StockAuthContext";
import { getWorkspaceOrganization } from "../../config/serviceContext.js";
import { useStock } from "../../context/stockContext";
import { usePurchase } from "../../context/PurchaseContext";
import { useSales } from "../../context/SalesContext";
import { useCustomer } from "../../context/CustomerContext";
import { useExpenses } from "../../context/ExpenseContext";
import { useFixedAssets } from "../../context/FixedAssetContext";
import { useProduction } from "../../context/ProductionContext";
import { Box, Grid, Card, CardContent, Typography, Button, Paper, LinearProgress, Chip, IconButton, Tooltip, Avatar, Divider } from "@mui/material";
import {
  Inventory as InventoryIcon,
  ShoppingCart as PurchaseIcon,
  TrendingUp as SalesIcon,
  Assessment as ReportsIcon,
  Warning as WarningIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
  TrendingDown,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ArrowForward as ArrowForwardIcon,
  ShowChart as ChartIcon,
} from "@mui/icons-material";

const StockDashboardOverview = () => {
  const navigate = useNavigate();
  const { user, hasRole, inDepartment } = useStockAuth();
  const { productSettings, loading: stockLoading } = useStock();
  const { purchases } = usePurchase();
  const { sales } = useSales();
  const { customers } = useCustomer();
  const { expenses } = useExpenses();
  const { assets } = useFixedAssets();
  const { cycles: productionCycles } = useProduction();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
    recentPurchases: 0,
    recentSales: 0,
    pendingOrders: 0,
    categories: 0,
    totalCustomers: 0,
    totalExpenses: 0,
    totalTransfers: 0,
    totalAdjustments: 0,
    totalReturns: 0,
    totalFixedAssets: 0,
    totalProduction: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!stockLoading) {
      fetchDashboardData();
    }
  }, [productSettings, purchases, sales, customers, expenses, assets, productionCycles, stockLoading]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const products = productSettings || [];
      const purchasesList = purchases || [];
      const salesList = sales || [];
      const customersList = customers || [];
      const expensesList = expenses || [];
      const assetsList = assets || [];
      const productionList = productionCycles || [];

      const lowStock = products.filter(p => (p.currentStock || 0) <= (p.reorderLevel || 10));
      const outOfStock = products.filter(p => (p.currentStock || 0) === 0);
      const totalValue = products.reduce((sum, p) => sum + ((p.currentStock || 0) * (p.defaultBuyingPrice || 0)), 0);
      const categories = [...new Set(products.map(p => p.productCategory || p.storeCategory))].filter(Boolean).length;

      setStats({
        totalProducts: products.length,
        totalValue,
        lowStock: lowStock.length,
        outOfStock: outOfStock.length,
        recentPurchases: purchasesList.length,
        recentSales: salesList.length,
        pendingOrders: purchasesList.filter(p => p.status === "pending").length,
        categories,
        totalCustomers: customersList.length,
        totalExpenses: expensesList.length,
        totalTransfers: 0,
        totalAdjustments: 0,
        totalReturns: 0,
        totalFixedAssets: assetsList.length,
        totalProduction: productionList.length
      });

      const activity = [
        ...purchasesList.slice(0, 2).map(p => ({ type: "purchase", ...p })),
        ...salesList.slice(0, 2).map(s => ({ type: "sale", ...s })),
        ...expensesList.slice(0, 1).map(e => ({ type: "expense", ...e }))
      ].sort((a, b) => new Date(b.createdAt || b.date || b.expenseDate) - new Date(a.createdAt || a.date || a.expenseDate)).slice(0, 5);
      setRecentActivity(activity);

      const newAlerts = [
        ...outOfStock.map(p => ({ severity: "critical", message: `${p.name} is out of stock` })),
        ...lowStock.slice(0, 3).map(p => ({ severity: "warning", message: `${p.name} is low on stock (${p.currentStock || 0} left)` }))
      ];
      setAlerts(newAlerts);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  };

  const getQuickActions = () => {
    const actions = [];
    if (hasRole(["ADMIN", "MANAGER", "STOREKEEPER", "ACCOUNTANT"]) || inDepartment(["Warehouse", "Finance"])) {
      actions.push({ label: "Manage Inventory", path: "/stock/inventory", icon: <InventoryIcon />, color: "#2196f3" });
    }
    if (hasRole(["ADMIN", "PURCHASER", "MANAGER", "ACCOUNTANT"]) || inDepartment(["Purchasing", "Finance"])) {
      actions.push({ label: "New Purchase", path: "/stock/purchases", icon: <PurchaseIcon />, color: "#4caf50" });
    }
    if (hasRole(["ADMIN", "SALES", "MANAGER", "ACCOUNTANT"]) || inDepartment(["Sales", "Finance"])) {
      actions.push({ label: "New Sale", path: "/stock/sales", icon: <SalesIcon />, color: "#ff9800" });
    }
    if (hasRole(["ADMIN", "MANAGER", "ACCOUNTANT"])) {
      actions.push({ label: "View Reports", path: "/stock/reports-dashboard", icon: <ReportsIcon />, color: "#9c27b0" });
    }
    if (hasRole(["ADMIN", "MANAGER"])) {
      actions.push({ label: "Settings & Currency", path: "/stock/user-settings", icon: <SettingsIcon />, color: "#607d8b" });
    }
    return actions;
  };

  const quickActions = getQuickActions();

  const statCards = [
    { title: "Total Products", value: stats.totalProducts, icon: <InventoryIcon />, color: "#2196f3", visible: true },
    { title: "Inventory Value", value: `₹${(stats.totalValue / 1000).toFixed(1)}K`, icon: <MoneyIcon />, color: "#4caf50", visible: hasRole(["ADMIN", "MANAGER", "ACCOUNTANT"]) },
    { title: "Low Stock Items", value: stats.lowStock, icon: <WarningIcon />, color: "#ff9800", visible: true },
    { title: "Out of Stock", value: stats.outOfStock, icon: <TrendingDown />, color: "#f44336", visible: true },
    { title: "Recent Purchases", value: stats.recentPurchases, icon: <PurchaseIcon />, color: "#00bcd4", visible: hasRole(["ADMIN", "MANAGER", "PURCHASER", "ACCOUNTANT"]) },
    { title: "Recent Sales", value: stats.recentSales, icon: <SalesIcon />, color: "#8bc34a", visible: hasRole(["ADMIN", "MANAGER", "SALES", "ACCOUNTANT"]) },
    { title: "Pending Orders", value: stats.pendingOrders, icon: <ShippingIcon />, color: "#673ab7", visible: hasRole(["ADMIN", "MANAGER", "PURCHASER"]) },
    { title: "Categories", value: stats.categories, icon: <CategoryIcon />, color: "#607d8b", visible: true },
    { title: "Total Customers", value: stats.totalCustomers, icon: <CategoryIcon />, color: "#e91e63", visible: hasRole(["ADMIN", "MANAGER", "SALES", "ACCOUNTANT"]) },
    { title: "Total Expenses", value: stats.totalExpenses, icon: <MoneyIcon />, color: "#9c27b0", visible: hasRole(["ADMIN", "MANAGER", "ACCOUNTANT"]) },
    { title: "Stock Transfers", value: stats.totalTransfers, icon: <ShippingIcon />, color: "#00bcd4", visible: hasRole(["ADMIN", "MANAGER", "STOCK_KEEPER"]) },
    { title: "Adjustments", value: stats.totalAdjustments, icon: <SettingsIcon />, color: "#ff5722", visible: hasRole(["ADMIN", "MANAGER", "ACCOUNTANT"]) },
    { title: "Returns", value: stats.totalReturns, icon: <TrendingDown />, color: "#795548", visible: hasRole(["ADMIN", "MANAGER", "SALES"]) },
    { title: "Fixed Assets", value: stats.totalFixedAssets, icon: <CategoryIcon />, color: "#607d8b", visible: hasRole(["ADMIN", "MANAGER", "ACCOUNTANT"]) },
    { title: "Production Cycles", value: stats.totalProduction, icon: <CategoryIcon />, color: "#3f51b5", visible: hasRole(["ADMIN", "MANAGER", "PRODUCTION_MANAGER"]) },
  ].filter(card => card.visible);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', p: 3 }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)", p: 4, borderRadius: 3, color: "white", mb: 3, boxShadow: '0 4px 20px rgba(13, 148, 136, 0.3)' }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, letterSpacing: '-0.5px' }}>
              {getWorkspaceOrganization('stock', user)?.name || 'Stock Management Dashboard'}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95, mb: 1 }}>
              {getWorkspaceOrganization('stock', user)?.name
                ? 'Inventory and stock control for your organization'
                : 'Comprehensive inventory and stock control system'}
            </Typography>
            {user?.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                <Chip label={user.email} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }} />
                <Chip label={`Role: ${user.role || "N/A"}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }} />
                <Chip label={`Dept: ${user.department || "N/A"}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }} />
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: 'center' }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={fetchDashboardData} sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.35)" }, width: 48, height: 48 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {hasRole(["ADMIN", "MANAGER"]) && (
              <Tooltip title="Settings">
                <IconButton onClick={() => navigate("/stock/user-settings")} sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.35)" }, width: 48, height: 48 }}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            )}
            {hasRole(["ADMIN", "MANAGER", "ACCOUNTANT"]) && (
              <Button variant="contained" startIcon={<ChartIcon />} sx={{ bgcolor: "rgba(255,255,255,0.25)", color: 'white', fontWeight: 600, "&:hover": { bgcolor: "rgba(255,255,255,0.35)" }, px: 3, py: 1.2, borderRadius: 2 }} onClick={() => navigate("/stock/reports-dashboard")}>View Reports</Button>
            )}
          </Box>
        </Box>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#fef3c7", border: "2px solid #fbbf24", borderRadius: 2, boxShadow: '0 2px 8px rgba(251, 191, 36, 0.15)' }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Avatar sx={{ bgcolor: '#f59e0b', width: 36, height: 36 }}>
              <NotificationsIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#92400e" }}>System Alerts</Typography>
            <Chip label={`${alerts.length} Active`} size="small" sx={{ bgcolor: '#fbbf24', color: '#78350f', fontWeight: 600 }} />
          </Box>
          <Divider sx={{ mb: 2, borderColor: '#fbbf24' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {alerts.slice(0, 5).map((alert, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, bgcolor: "white", borderRadius: 1.5, border: '1px solid #fde68a' }}>
                <Chip label={alert.severity.toUpperCase()} size="small" color={alert.severity === "critical" ? "error" : "warning"} sx={{ fontWeight: 600, minWidth: 80 }} />
                <Typography variant="body2" sx={{ flex: 1, color: '#78350f', fontWeight: 500 }}>{alert.message}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={0} sx={{ height: '100%', borderRadius: 3, border: '1px solid #e2e8f0', transition: "all 0.3s ease", cursor: "pointer", "&:hover": { transform: "translateY(-8px)", boxShadow: '0 12px 24px rgba(0,0,0,0.12)', borderColor: stat.color } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, width: 56, height: 56 }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 28 } })}
                  </Avatar>
                  <Chip label="Live" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 600, fontSize: '0.7rem' }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color, mb: 0.5, letterSpacing: '-1px' }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>{stat.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions & Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ height: "100%", borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: '#0d9488', width: 40, height: 40 }}>
                    <ArrowForwardIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'grey.800' }}>Quick Actions</Typography>
                </Box>
                <Chip label={quickActions.length} size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 600 }} />
              </Box>
              <Divider sx={{ mb: 3 }} />
              {quickActions.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {quickActions.map((action, index) => (
                    <Button 
                      key={index} 
                      variant="outlined" 
                      fullWidth 
                      onClick={() => navigate(action.path)} 
                      startIcon={action.icon}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ 
                        justifyContent: "space-between", 
                        borderColor: '#e2e8f0',
                        color: action.color,
                        py: 1.5,
                        px: 2.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textAlign: 'left',
                        "&:hover": { 
                          borderColor: action.color, 
                          bgcolor: `${action.color}08`,
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s'
                        } 
                      }}
                    >
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No quick actions available for your role</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ height: "100%", borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: '#0d9488', width: 40, height: 40 }}>
                    <ChartIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'grey.800' }}>Recent Activity</Typography>
                </Box>
                <Chip label={recentActivity.length} size="small" sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 600 }} />
              </Box>
              <Divider sx={{ mb: 3 }} />
              {recentActivity.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {recentActivity.map((activity, idx) => (
                    <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2, border: '1px solid #e2e8f0', transition: 'all 0.2s', "&:hover": { bgcolor: '#f1f5f9', transform: 'translateX(4px)' } }}>
                      <Avatar sx={{ bgcolor: activity.type === "purchase" ? "#dcfce7" : "#fed7aa", color: activity.type === "purchase" ? "#166534" : "#9a3412", width: 44, height: 44 }}>
                        {activity.type === "purchase" ? <PurchaseIcon sx={{ fontSize: 22 }} /> : <SalesIcon sx={{ fontSize: 22 }} />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'grey.800', mb: 0.5 }}>
                          {activity.type === "purchase" ? "Purchase Order" : activity.type === "sale" ? "Sales Transaction" : activity.type === "expense" ? "Expense" : "Stock Transfer"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{new Date(activity.createdAt || activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: activity.type === "purchase" ? "#166534" : activity.type === "sale" ? "#9a3412" : "#7c3aed" }}>₹{(activity.totalAmount || activity.quantity || 0).toLocaleString()}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No recent activity to display</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockDashboardOverview;
