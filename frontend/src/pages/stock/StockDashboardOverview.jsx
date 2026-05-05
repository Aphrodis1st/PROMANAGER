import React from "react";
import { useNavigate } from "react-router-dom";
import { useStockAuth } from "../../context/StockAuthContext";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import {
  Inventory as InventoryIcon,
  ShoppingCart as PurchaseIcon,
  TrendingUp as SalesIcon,
  Assessment as ReportsIcon,
} from "@mui/icons-material";

const StockDashboardOverview = () => {
  const navigate = useNavigate();
  const { user } = useStockAuth();

  const stats = [
    { title: "Total Products", value: "1,234", icon: <InventoryIcon />, color: "#2196f3" },
    { title: "Total Inventory Value", value: "₹5.2M", icon: <InventoryIcon />, color: "#4caf50" },
    { title: "Low Stock Items", value: "156", icon: <InventoryIcon />, color: "#ff9800" },
    { title: "Out of Stock", value: "23", icon: <InventoryIcon />, color: "#f44336" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
          p: 4,
          borderRadius: 2,
          color: "white",
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Stock Management Dashboard
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Comprehensive inventory and stock control system
          </Typography>
          {user?.email && (
            <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: "block" }}>
              Logged in as: {user.email}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
          }}
          onClick={() => navigate("/stock/reports-dashboard")}
        >
          📊 View Reports
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: stat.color, color: "white" }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2">{stat.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/stock/inventory")}
                  startIcon={<InventoryIcon />}
                >
                  Manage Inventory
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/stock/purchases")}
                  startIcon={<PurchaseIcon />}
                >
                  New Purchase
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/stock/sales")}
                  startIcon={<SalesIcon />}
                >
                  New Sale
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No recent activity to display
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockDashboardOverview;
