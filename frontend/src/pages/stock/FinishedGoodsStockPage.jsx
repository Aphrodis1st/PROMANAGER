import React, { useState, useMemo } from "react";
import { useProduction } from "../../context/ProductionContext";
import { useStockCurrency } from "../../context/stockContext";
import { productionService } from "../../services/productionService";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import SellingPriceDialog from "../../components/SellingPriceDialog";
import CurrencyDisplay from "../../components/stock/CurrencyDisplay";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  CircularProgress,
  TablePagination,
  Button,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Paper,
  LinearProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

export default function FinishedGoodsStockPage() {
  const { cycles, loading } = useProduction();
  const { formatAmount } = useStockCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [migrating, setMigrating] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);

  // Filter only completed cycles
  const completedCycles = useMemo(() => {
    let filtered = (cycles || []).filter((c) => c.status === "completed");

    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter((c) => {
        const date = c.completedAt || c.updatedAt;
        if (!date) return false;
        const timestamp = date._seconds || date.seconds || date;
        const dateObj = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(date);
        return dateObj >= new Date(startDate);
      });
    }

    if (endDate) {
      filtered = filtered.filter((c) => {
        const date = c.completedAt || c.updatedAt;
        if (!date) return false;
        const timestamp = date._seconds || date.seconds || date;
        const dateObj = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(date);
        return dateObj <= new Date(endDate);
      });
    }

    return filtered;
  }, [cycles, searchTerm, startDate, endDate]);

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalItems = completedCycles.length;
    const totalQuantity = completedCycles.reduce((sum, c) => sum + Number(c.quantityCompleted || 0), 0);
    const totalValue = completedCycles.reduce((sum, c) => sum + Number(c.totalCost || 0), 0);
    const migratedItems = completedCycles.filter(c => c.addedToInventory).length;
    const pendingMigration = totalItems - migratedItems;
    const avgUnitCost = totalQuantity > 0 ? totalValue / totalQuantity : 0;
    
    const uniqueProducts = [...new Set(completedCycles.map(c => c.productName))].length;

    return {
      totalItems,
      totalQuantity,
      totalValue,
      migratedItems,
      pendingMigration,
      avgUnitCost,
      uniqueProducts,
    };
  }, [completedCycles]);

  const paginatedData = completedCycles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (cycle) => {
    const total = Number(cycle.totalCost || 0);
    const qty = Number(cycle.quantityCompleted || 0);
    const unit = qty > 0 ? total / qty : 0;
    
    setSelectedCycle({
      ...cycle,
      unitCost: unit,
      totalCost: total,
      quantityCompleted: qty,
      batchNo: cycle.batchNo?.replace(/[^0-9]/g, '') || cycle.name?.replace(/[^0-9]/g, '') || cycle.id.slice(-6),
    });
    setDialogOpen(true);
  };

  const handleConfirmMigration = async (sellingPrice) => {
    if (!selectedCycle) return;

    setMigrating(prev => ({ ...prev, [selectedCycle.id]: true }));
    setDialogOpen(false);
    
    try {
      await productionService.migrateToInventory(selectedCycle.id, sellingPrice);
      alert(`✅ Successfully migrated ${selectedCycle.productName} to inventory with selling price $${sellingPrice.toFixed(2)}!`);
      window.location.reload();
    } catch (error) {
      console.error('Error migrating to inventory:', error);
      alert(`❌ Failed to migrate: ${error.response?.data?.error || error.message}`);
    } finally {
      setMigrating(prev => ({ ...prev, [selectedCycle.id]: false }));
      setSelectedCycle(null);
    }
  };

  const handleExportCSV = () => {
    if (!completedCycles.length) return alert("No data to export.");

    const headers = [
      "Batch Number",
      "Product Name",
      "Quantity Produced",
      "Material Cost",
      "Labor Cost",
      "Overhead Cost",
      "Total Cost",
      "Unit Cost",
      "Date Completed",
      "Status",
    ];

    const rows = completedCycles.map((c) => {
      const total = Number(c.totalCost || 0);
      const qty = Number(c.quantityCompleted || 0);
      const unit = qty > 0 ? (total / qty).toFixed(2) : 0;
      return [
        c.batchNo?.replace(/[^0-9]/g, '') || c.name?.replace(/[^0-9]/g, '') || c.id.slice(-6),
        c.productName,
        qty,
        c.materialCost,
        c.laborCost,
        c.overheadCost,
        total,
        unit,
        (() => {
          const date = c.completedAt || c.updatedAt;
          if (!date) return "-";
          const timestamp = date._seconds || date.seconds || date;
          return typeof timestamp === 'number' 
            ? new Date(timestamp * 1000).toLocaleString()
            : new Date(date).toLocaleString();
        })(),
        c.addedToInventory ? "Migrated" : "Pending",
      ];
    });

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `FinishedGoods_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportPDF = () => {
    if (!completedCycles.length) return alert("No data to export.");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Finished Goods Dashboard Report", 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 24);

    const tableData = completedCycles.map((c) => {
      const total = Number(c.totalCost || 0);
      const qty = Number(c.quantityCompleted || 0);
      const unit = qty > 0 ? (total / qty).toFixed(2) : 0;
      return [
        c.batchNo?.replace(/[^0-9]/g, '') || c.name?.replace(/[^0-9]/g, '') || c.id.slice(-6),
        c.productName,
        qty.toLocaleString(),
        `$${c.materialCost}`,
        `$${c.laborCost}`,
        `$${c.overheadCost}`,
        `$${total}`,
        `$${unit}`,
        c.addedToInventory ? "✓" : "✗",
      ];
    });

    doc.autoTable({
      startY: 30,
      head: [
        [
          "Batch No",
          "Product",
          "Qty",
          "Material",
          "Labor",
          "Overhead",
          "Total",
          "Unit Cost",
          "Migrated",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [13, 148, 136] },
    });

    doc.save(`FinishedGoods_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2, color: "text.secondary" }}>
            Loading finished goods data...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ 
        background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)", 
        p: 4, 
        borderRadius: 2, 
        color: "white", 
        mb: 3,
        boxShadow: "0 4px 20px rgba(13, 148, 136, 0.3)"
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InventoryIcon sx={{ fontSize: 40 }} />
              Finished Goods Dashboard
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Professional inventory management and production tracking system
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={() => window.location.reload()} 
                sx={{ 
                  color: "white", 
                  bgcolor: "rgba(255,255,255,0.2)", 
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } 
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Dashboard Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: "#f0f9ff", 
            border: "2px solid #bae6fd",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)", boxShadow: 4 }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Total Batches
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: "#0369a1", mt: 1 }}>
                    {dashboardStats.totalItems}
                  </Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 50, color: "#0369a1", opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: "#fef3c7", 
            border: "2px solid #fde68a",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)", boxShadow: 4 }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Total Quantity
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: "#d97706", mt: 1 }}>
                    {dashboardStats.totalQuantity.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 50, color: "#d97706", opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: "#d1fae5", 
            border: "2px solid #a7f3d0",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)", boxShadow: 4 }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Total Value
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: "#059669", mt: 1 }}>
                    {formatAmount(dashboardStats.totalValue)}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 50, color: "#059669", opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: "#fce7f3", 
            border: "2px solid #fbcfe8",
            transition: "transform 0.2s",
            "&:hover": { transform: "translateY(-4px)", boxShadow: 4 }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Unique Products
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: "#be185d", mt: 1 }}>
                    {dashboardStats.uniqueProducts}
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 50, color: "#be185d", opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
              Migrated to Inventory
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#16a34a" }}>
                {dashboardStats.migratedItems}
              </Typography>
              <Chip 
                label={`${((dashboardStats.migratedItems / dashboardStats.totalItems) * 100 || 0).toFixed(0)}%`}
                color="success"
                size="small"
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(dashboardStats.migratedItems / dashboardStats.totalItems) * 100 || 0}
              sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: "#dcfce7" }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: "#fef2f2", border: "1px solid #fecaca" }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
              Pending Migration
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#dc2626" }}>
                {dashboardStats.pendingMigration}
              </Typography>
              <Chip 
                label={`${((dashboardStats.pendingMigration / dashboardStats.totalItems) * 100 || 0).toFixed(0)}%`}
                color="error"
                size="small"
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(dashboardStats.pendingMigration / dashboardStats.totalItems) * 100 || 0}
              sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: "#fee2e2" }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: "#eff6ff", border: "1px solid #dbeafe" }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
              Average Unit Cost
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#2563eb" }}>
              {formatAmount(dashboardStats.avgUnitCost)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Per unit across all batches
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Data Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        {/* Filters and Actions */}
        <Box sx={{ p: 3, bgcolor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                placeholder="Search product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                type="date"
                label="From Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                type="date"
                label="To Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<ExportIcon />}
                  onClick={handleExportCSV}
                  sx={{ borderColor: "#0d9488", color: "#0d9488" }}
                >
                  Export CSV
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ExportIcon />}
                  onClick={handleExportPDF}
                  sx={{ bgcolor: "#0d9488", "&:hover": { bgcolor: "#0f766e" } }}
                >
                  Export PDF
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 600 }}>
          {completedCycles.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
              <Box sx={{ textAlign: 'center' }}>
                <InventoryIcon sx={{ fontSize: 80, color: "text.secondary", opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No finished goods found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Complete production cycles will appear here
                </Typography>
              </Box>
            </Box>
          ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Batch No
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Product Name
                  </TableCell>
                  <TableCell align="right" sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Quantity
                  </TableCell>
                  <TableCell align="right" sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Material Cost
                  </TableCell>
                  <TableCell align="right" sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Labor Cost
                  </TableCell>
                  <TableCell align="right" sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Overhead
                  </TableCell>
                  <TableCell align="right" sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Total Cost
                  </TableCell>
                  <TableCell align="right" sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Unit Cost
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Date
                  </TableCell>
                  <TableCell align="center" sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ bgcolor: "#0d9488", color: "white", fontWeight: 600, py: 2 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((cycle, index) => {
                  const actualIndex = page * rowsPerPage + index;
                  const isEven = actualIndex % 2 === 0;
                  const total = Number(cycle.totalCost || 0);
                  const qty = Number(cycle.quantityCompleted || 0);
                  const unit = qty > 0 ? total / qty : 0;

                  return (
                    <TableRow
                      key={cycle.id}
                      hover
                      sx={{
                        bgcolor: isEven ? "#ffffff" : "#f9fafb",
                        "&:hover": { bgcolor: "#e0f2f1" },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, color: "#0d9488" }}>
                        {cycle.batchNo?.replace(/[^0-9]/g, '') || cycle.name?.replace(/[^0-9]/g, '') || cycle.id.slice(-6)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {cycle.productName}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {qty.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <CurrencyDisplay amount={cycle.materialCost} />
                      </TableCell>
                      <TableCell align="right">
                        <CurrencyDisplay amount={cycle.laborCost} />
                      </TableCell>
                      <TableCell align="right">
                        <CurrencyDisplay amount={cycle.overheadCost} />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: "#059669" }}>
                        <CurrencyDisplay amount={total} />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        <CurrencyDisplay amount={unit} />
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const date = cycle.completedAt || cycle.updatedAt;
                          if (!date) return "-";
                          if (date._seconds || date.seconds) {
                            const timestamp = date._seconds || date.seconds;
                            return new Date(timestamp * 1000).toLocaleDateString();
                          }
                          return new Date(date).toLocaleDateString();
                        })()}
                      </TableCell>
                      <TableCell align="center">
                        {cycle.addedToInventory ? (
                          <Chip 
                            label="Migrated" 
                            color="success" 
                            size="small" 
                            icon={<CheckCircleIcon />}
                            sx={{ fontWeight: 600 }}
                          />
                        ) : (
                          <Chip 
                            label="Pending" 
                            color="warning" 
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {cycle.addedToInventory ? (
                          <Tooltip title="Already in inventory">
                            <CheckCircleIcon sx={{ color: "#059669", fontSize: 28 }} />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Migrate to inventory">
                            <IconButton
                              onClick={() => handleOpenDialog(cycle)}
                              disabled={migrating[cycle.id]}
                              sx={{
                                color: "#0d9488",
                                "&:hover": { bgcolor: "#e0f2f1" },
                              }}
                            >
                              {migrating[cycle.id] ? (
                                <CircularProgress size={24} />
                              ) : (
                                <InventoryIcon sx={{ fontSize: 28 }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {completedCycles.length > 0 && (
          <TablePagination
            component="div"
            count={completedCycles.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            sx={{
              borderTop: "1px solid #e5e7eb",
              bgcolor: "#f9fafb",
            }}
          />
        )}
      </Paper>

      {/* Selling Price Dialog */}
      {selectedCycle && (
        <SellingPriceDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedCycle(null);
          }}
          onConfirm={handleConfirmMigration}
          finishedGood={selectedCycle}
        />
      )}
    </Box>
  );
}
