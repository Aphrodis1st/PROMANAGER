import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStockAuth } from "../../context/StockAuthContext";
import { Box, Grid, Card, CardContent, Typography, Button, Paper, LinearProgress, Chip, IconButton, Tooltip } from "@mui/material";
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
} from "@mui/icons-material";
import axios from "axios";

const StockDashboardOverview = () => {
  const navigate = useNavigate();
  const { user, hasRole, inDepartment } = useStockAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
    recentPurchases: 0,
    recentSales: 0,
    pendingOrders: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [productsRes, purchasesRes, salesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/v1/stock/product", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/v1/stock/purchases", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/v1/stock/sales", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const products = productsRes.data || [];
      const purchases = purchasesRes.data || [];
      const sales = salesRes.data || [];

      const lowStock = products.filter(p => p.quantity <= (p.reorderLevel || 10));
      const outOfStock = products.filter(p => p.quantity === 0);
      const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
      const categories = [...new Set(products.map(p => p.category))].length;

      setStats({
        totalProducts: products.length,
        totalValue,
        lowStock: lowStock.length,
        outOfStock: outOfStock.length,
        recentPurchases: purchases.length,
        recentSales: sales.length,
        pendingOrders: purchases.filter(p => p.status === "pending").length,
        categories
      });

      const activity = [
        ...purchases.slice(0, 3).map(p => ({ type: "purchase", ...p })),
        ...sales.slice(0, 3).map(s => ({ type: "sale", ...s }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      setRecentActivity(activity);

      const newAlerts = [
        ...outOfStock.map(p => ({ severity: "critical", message: `${p.name} is out of stock` })),
        ...lowStock.slice(0, 3).map(p => ({ severity: "warning", message: `${p.name} is low on stock (${p.quantity} left)` }))
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
  ].filter(card => card.visible);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)", p: 4, borderRadius: 2, color: "white", mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Stock Management Dashboard</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Comprehensive inventory and stock control system</Typography>
          {user?.email && (
            <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: "block" }}>
              Logged in as: {user.email} | Role: {user.role || "N/A"} | Department: {user.department || "N/A"}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchDashboardData} sx={{ color: "white", bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {hasRole(["ADMIN", "MANAGER", "ACCOUNTANT"]) && (
            <Button variant="contained" sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }} onClick={() => navigate("/stock/reports-dashboard")}>📊 View Reports</Button>
          )}
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {alerts.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "#fff3e0", border: "1px solid #ffb74d" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <NotificationsIcon sx={{ color: "#f57c00" }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#e65100" }}>Alerts</Typography>
          </Box>
          {alerts.slice(0, 5).map((alert, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Chip label={alert.severity} size="small" color={alert.severity === "critical" ? "error" : "warning"} />
              <Typography variant="body2">{alert.message}</Typography>
            </Box>
          ))}
        </Paper>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: stat.color, color: "white", cursor: "pointer", transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                    <Typography variant="body2">{stat.title}</Typography>
                  </Box>
                  <Box sx={{ opacity: 0.7, fontSize: 40 }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Quick Actions</Typography>
              {quickActions.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {quickActions.map((action, index) => (
                    <Button key={index} variant="outlined" fullWidth onClick={() => navigate(action.path)} startIcon={action.icon} sx={{ justifyContent: "flex-start", borderColor: action.color, color: action.color, "&:hover": { borderColor: action.color, bgcolor: `${action.color}10` } }}>
                      {action.label}
                    </Button>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No quick actions available for your role</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Recent Activity</Typography>
              {recentActivity.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {recentActivity.map((activity, idx) => (
                    <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                      {activity.type === "purchase" ? <PurchaseIcon sx={{ color: "#4caf50" }} /> : <SalesIcon sx={{ color: "#ff9800" }} />}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{activity.type === "purchase" ? "Purchase" : "Sale"}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(activity.createdAt).toLocaleDateString()}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{activity.totalAmount || 0}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No recent activity to display</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockDashboardOverview;
