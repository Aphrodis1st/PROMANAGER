import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  Analytics as AnalyticsIcon,
  AccountBalanceWallet as WalletIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  GetApp as GetAppIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useStock } from "../../context/stockContext";
import ChartOfAccountsTable from "../../components/stock/ChartOfAccountsTable";
import ChartOfAccountsForm from "../../components/stock/ChartOfAccountsForm";

export default function ChartOfAccountsPage() {
  const {
    accountSettings,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
  } = useStock();

  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const accounts = accountSettings || [];
    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter(
      (acc) => acc.status === "Active"
    ).length;
    const inactiveAccounts = accounts.filter(
      (acc) => acc.status === "Inactive"
    ).length;

    const accountTypes = accounts.reduce((acc, account) => {
      acc[account.accountType] = (acc[account.accountType] || 0) + 1;
      return acc;
    }, {});

    const categories = accounts.reduce((acc, account) => {
      acc[account.category] = (acc[account.category] || 0) + 1;
      return acc;
    }, {});

    const statements = accounts.reduce((acc, account) => {
      acc[account.statement] = (acc[account.statement] || 0) + 1;
      return acc;
    }, {});

    const activationRate =
      totalAccounts > 0 ? (activeAccounts / totalAccounts) * 100 : 0;

    return {
      totalAccounts,
      activeAccounts,
      inactiveAccounts,
      accountTypes,
      categories,
      statements,
      activationRate,
      topAccountType: Object.keys(accountTypes).reduce(
        (a, b) => (accountTypes[a] > accountTypes[b] ? a : b),
        "None"
      ),
      topCategory: Object.keys(categories).reduce(
        (a, b) => (categories[a] > categories[b] ? a : b),
        "None"
      ),
      topStatement: Object.keys(statements).reduce(
        (a, b) => (statements[a] > statements[b] ? a : b),
        "None"
      ),
    };
  }, [accountSettings]);

  const filteredAccounts = useMemo(() => {
    return (accountSettings || []).filter((acc) => {
      if (filterType && acc.accountType !== filterType) return false;
      if (filterStatus && acc.status !== filterStatus) return false;
      return true;
    });
  }, [accountSettings, filterType, filterStatus]);

  useEffect(() => {
    console.log("ChartOfAccountsPage loaded");
    console.log("accountSettings:", accountSettings);
  }, [accountSettings]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (selected) {
        await updateAccount(selected.id, data);
        setNotification({
          open: true,
          message: "Account updated successfully",
          type: "success",
        });
      } else {
        await addAccount(data);
        setNotification({
          open: true,
          message: "Account added successfully",
          type: "success",
        });
      }
      setShowForm(false);
      setSelected(null);
    } catch (err) {
      console.error("Error saving account:", err);
      setNotification({
        open: true,
        message: "Error saving account",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDialog = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleCloseDialog = () => {
    setShowForm(false);
    setSelected(null);
  };

  const handleExport = () => {
    const csv = [
      ["Code", "Name", "Type", "Category", "Sub Category", "Statement", "Status"],
      ...filteredAccounts.map((acc) => [
        acc.code,
        acc.name,
        acc.accountType,
        acc.category,
        acc.subCategory,
        acc.statement,
        acc.status,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chart-of-accounts-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    a.click();
    setNotification({
      open: true,
      message: "Accounts exported successfully",
      type: "success",
    });
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1e293b",
                mb: 1,
                background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Chart of Accounts Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your accounting structure and financial accounts
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh Data">
              <IconButton
                sx={{
                  bgcolor: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#f1f5f9" },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Accounts">
              <IconButton
                onClick={handleExport}
                sx={{
                  bgcolor: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#f1f5f9" },
                }}
              >
                <GetAppIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{
                bgcolor: "#0d9488",
                "&:hover": { bgcolor: "#14b8a6" },
                borderRadius: 2,
                px: 3,
                py: 1.5,
                boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
              }}
            >
              Add Account
            </Button>
          </Stack>
        </Stack>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: "white" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              select
              label="Filter by Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Asset">Asset</MenuItem>
              <MenuItem value="Liability">Liability</MenuItem>
              <MenuItem value="Equity">Equity</MenuItem>
              <MenuItem value="Revenue">Revenue</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </TextField>
            <TextField
              select
              label="Filter by Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
            {(filterType || filterStatus) && (
              <Button
                size="small"
                onClick={() => {
                  setFilterType("");
                  setFilterStatus("");
                }}
                startIcon={<CloseIcon />}
              >
                Clear Filters
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Accounts
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {metrics.totalAccounts}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <AccountBalanceIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(240, 147, 251, 0.3)",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Active Accounts
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {metrics.activeAccounts}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(79, 172, 254, 0.3)",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Account Types
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {Object.keys(metrics.accountTypes).length}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                color: "white",
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(250, 112, 154, 0.3)",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Statements
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {Object.keys(metrics.statements).length}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <ReceiptIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Insights Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Account Activation Rate
                  </Typography>
                  <Chip
                    label={`${metrics.activationRate.toFixed(1)}%`}
                    color={
                      metrics.activationRate >= 90
                        ? "success"
                        : metrics.activationRate >= 70
                        ? "warning"
                        : "error"
                    }
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={metrics.activationRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#e2e8f0",
                    "& .MuiLinearProgress-bar": {
                      bgcolor:
                        metrics.activationRate >= 90
                          ? "#10b981"
                          : metrics.activationRate >= 70
                          ? "#f59e0b"
                          : "#ef4444",
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {metrics.activeAccounts} of {metrics.totalAccounts} accounts are
                  active
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Account Distribution
                </Typography>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <BusinessIcon sx={{ color: "#0d9488", fontSize: 20 }} />
                      <Typography variant="body2">Top Account Type:</Typography>
                    </Stack>
                    <Chip
                      label={metrics.topAccountType}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CategoryIcon sx={{ color: "#0d9488", fontSize: 20 }} />
                      <Typography variant="body2">Top Category:</Typography>
                    </Stack>
                    <Chip
                      label={metrics.topCategory}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ReceiptIcon sx={{ color: "#0d9488", fontSize: 20 }} />
                      <Typography variant="body2">Top Statement:</Typography>
                    </Stack>
                    <Chip
                      label={metrics.topStatement}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Account Types Breakdown */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            mb: 4,
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Account Types Breakdown
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(metrics.accountTypes).map(([type, count]) => (
                <Grid item xs={6} sm={4} md={2.4} key={type}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8fafc",
                      borderRadius: 2,
                      textAlign: "center",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#0d9488" }}>
                      {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {type}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content - Accounts Table */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <ChartOfAccountsTable
          data={filteredAccounts}
          loading={loading}
          onAdd={handleOpenDialog}
          onEdit={(item) => {
            setSelected(item);
            setShowForm(true);
          }}
          onDelete={(id) => deleteAccount(id)}
        />
      </Paper>

      {/* Form Dialog */}
      <Dialog
        open={showForm}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#0d9488",
            color: "white",
            fontWeight: 600,
            fontSize: "1.25rem",
            py: 2,
          }}
        >
          {selected ? "Edit Account" : "Add Account"}
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            bgcolor: "white",
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <ChartOfAccountsForm
            initialData={selected}
            saving={saving}
            onCancel={handleCloseDialog}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.type}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack alignItems="center" spacing={2}>
              <LinearProgress sx={{ width: 200 }} />
              <Typography>Loading chart of accounts...</Typography>
            </Stack>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
