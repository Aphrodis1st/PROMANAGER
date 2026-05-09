// ========================================
// ✅ FinishedGoodsPage.jsx (Enhanced)
// ========================================
import React, { useMemo, useState } from "react";
import { useProduction } from "../../context/ProductionContext";
import { productionService } from "../../services/productionService";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import SellingPriceDialog from "../../components/SellingPriceDialog";
import {
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
} from "@mui/material";
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export default function FinishedGoodsPage() {
  const { cycles, loading } = useProduction();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [migrating, setMigrating] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);

  // ✅ Filter only completed cycles
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

  // ==========================================
  // 📦 MIGRATE TO INVENTORY
  // ==========================================
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

  // ==========================================
  // 🧾 EXPORT HANDLERS
  // ==========================================
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
      ];
    });

    const csvContent =
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `FinishedGoods_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportPDF = () => {
    if (!completedCycles.length) return alert("No data to export.");

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Finished Goods Summary", 14, 16);

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
        (() => {
          const date = c.completedAt || c.updatedAt;
          if (!date) return "-";
          const timestamp = date._seconds || date.seconds || date;
          return typeof timestamp === 'number'
            ? new Date(timestamp * 1000).toLocaleDateString()
            : new Date(date).toLocaleDateString();
        })(),
      ];
    });

    doc.autoTable({
      startY: 25,
      head: [
        [
          "Batch No",
          "Product Name",
          "Qty",
          "Material Cost",
          "Labor Cost",
          "Overhead Cost",
          "Total Cost",
          "Unit Cost",
          "Date Completed",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [23, 162, 184] },
    });

    doc.save(`FinishedGoods_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // ==========================================
  // 🧠 UI RENDER
  // ==========================================
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <CircularProgress />
        <Typography sx={{ ml: 2, color: "text.secondary" }}>
          Loading finished goods...
        </Typography>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "$0.00";
    return `$${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="rounded-xl overflow-hidden shadow-md flex-1 flex flex-col min-h-[600px]">
        {/* Header with Title and Search */}
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "grey.800" }}>
              Finished Goods Summary
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Migrate completed production to <Chip label="Finished Products" size="small" sx={{ bgcolor: '#d1fae5', color: '#059669', fontWeight: 600, ml: 0.5 }} /> inventory
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <TextField
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              type="date"
              label="From"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ width: 150 }}
            />
            <TextField
              type="date"
              label="To"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ width: 150 }}
            />
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportCSV}
              sx={{ borderColor: "#0d9488", color: "#0d9488" }}
            >
              CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportPDF}
              sx={{ borderColor: "#0d9488", color: "#0d9488" }}
            >
              PDF
            </Button>
          </div>
        </div>

        <TableContainer sx={{ flex: 1, overflow: "auto", minHeight: "500px" }}>
          {completedCycles.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <Typography color="text.secondary">
                No finished goods found.
              </Typography>
            </div>
          ) : (
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: "#0d9488",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 1.5,
                    }}
                  >
                    Batch No
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#0d9488",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 1.5,
                    }}
                  >
                    Product Name
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#0d9488",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 1.5,
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#0d9488",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 1.5,
                    }}
                  >
                    Material Cost
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#0d9488",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 1.5,
                    }}
                  >
                    Labor Cost
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#0d9488",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 1.5,
                    }}
                  >
                    Overhead Cost
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#0d9488",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 1.5,
                    }}
                  >
                    Total Cost
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "#0d9488",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 1.5,
                    }}
                  >
                    Unit Cost
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#0d9488",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 1.5,
                    }}
                  >
                    Date Completed
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: "#0d9488",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 1.5,
                    }}
                  >
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
                        bgcolor: isEven ? "#fafafa" : "#f5f5f5",
                        "&:hover": {
                          bgcolor: "#e8f5e9",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "grey.800", py: 1.5, fontWeight: 600 }}>
                        {cycle.batchNo?.replace(/[^0-9]/g, '') || cycle.name?.replace(/[^0-9]/g, '') || cycle.id.slice(-6)}
                      </TableCell>
                      <TableCell sx={{ color: "grey.800", py: 1.5, fontWeight: 500 }}>
                        {cycle.productName}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "grey.800", py: 1.5 }}>
                        {qty.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "grey.800", py: 1.5 }}>
                        {formatCurrency(cycle.materialCost)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "grey.800", py: 1.5 }}>
                        {formatCurrency(cycle.laborCost)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "grey.800", py: 1.5 }}>
                        {formatCurrency(cycle.overheadCost)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "grey.800", py: 1.5, fontWeight: 600 }}
                      >
                        {formatCurrency(total)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "grey.800", py: 1.5 }}>
                        {formatCurrency(unit)}
                      </TableCell>
                      <TableCell sx={{ color: "grey.800", py: 1.5 }}>
                        {(() => {
                          const date = cycle.completedAt || cycle.updatedAt;
                          if (!date) return "-";
                          // Handle Firestore timestamp
                          if (date._seconds || date.seconds) {
                            const timestamp = date._seconds || date.seconds;
                            return new Date(timestamp * 1000).toLocaleDateString();
                          }
                          // Handle ISO string or Date object
                          return new Date(date).toLocaleDateString();
                        })()}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
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
              borderTop: "1px solid",
              borderColor: "divider",
              "& .MuiTablePagination-toolbar": {
                bgcolor: "grey.50",
              },
            }}
          />
        )}
      </div>

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
    </div>
  );
}
