import React, { useState, useRef, useMemo } from 'react';
import { useProduction } from '../../context/ProductionContext';
import { useStock } from '../../context/stockContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
  Card,
  CardContent,
  Grid,
  Box,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  GetApp as ExportIcon,
  Print as PrintIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const formatDate = (value) => {
  if (!value) return '-';
  if (value?.toDate) return value.toDate().toLocaleString();
  if (value?._seconds) return new Date(value._seconds * 1000).toLocaleString();
  return new Date(value).toLocaleString();
};

export default function ProductionReportsPage() {
  const {
    wipCycles = [],
    finishedGoods = [],
    damagedProducts = [],
    cycles = [],
  } = useProduction();
  const { products = [], getProductStock } = useStock();

  const [reportType, setReportType] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totals, setTotals] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const tableRef = useRef();

  // Dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const totalCycles = cycles.length;
    const completedCycles = cycles.filter(c => c.status === 'completed').length;
    const wipCount = wipCycles.length;
    const damagedCount = damagedProducts.length;
    
    const totalProduction = cycles.reduce((sum, c) => sum + (c.quantityCompleted || 0), 0);
    
    // Calculate total cost with proper material cost calculation
    const totalCost = cycles.reduce((sum, c) => {
      const materialCost = c.costSummary?.materialCost || c.materialCost || 
        (c.consumedMaterials || c.rawMaterials || []).reduce((matSum, mat) => 
          matSum + (mat.totalCost || (mat.qtyUsed * mat.unitCost) || (mat.quantity * mat.costPerUnit) || 0), 0
        );
      const laborCost = c.costSummary?.laborCost || c.laborCost || 0;
      const overheadCost = c.costSummary?.overheadCost || c.overheadCost || 0;
      return sum + materialCost + laborCost + overheadCost;
    }, 0);
    
    const avgCostPerUnit = totalProduction > 0 ? totalCost / totalProduction : 0;
    const completionRate = totalCycles > 0 ? (completedCycles / totalCycles) * 100 : 0;
    
    return {
      totalCycles,
      completedCycles,
      wipCount,
      damagedCount,
      totalProduction,
      totalCost,
      avgCostPerUnit,
      completionRate,
    };
  }, [cycles, wipCycles, damagedProducts]);

  const filterByDate = (data = []) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return data.filter((d) => {
      const raw = d.dateProduced || d.datePlanned || d.createdAt;
      if (!raw) return false;

      let dateObj;
      if (raw.toDate) dateObj = raw.toDate();
      else if (raw._seconds) dateObj = new Date(raw._seconds * 1000);
      else dateObj = new Date(raw);

      if (isNaN(dateObj.getTime())) return false;
      if (start && dateObj < start) return false;
      if (end && dateObj > end) return false;

      return true;
    });
  };

  // Helper function to calculate material cost from consumed materials
  const calculateMaterialCost = (item) => {
    // First try to get from costSummary
    if (item.costSummary?.materialCost) {
      return item.costSummary.materialCost;
    }
    
    // Then try to get from materialCost property
    if (item.materialCost && item.materialCost > 0) {
      return item.materialCost;
    }
    
    // Calculate from consumed materials or raw materials
    const materials = item.consumedMaterials || item.rawMaterials || [];
    return materials.reduce((sum, material) => {
      const cost = material.totalCost || (material.qtyUsed * material.unitCost) || (material.quantity * material.costPerUnit) || 0;
      return sum + cost;
    }, 0);
  };

  const handleGenerateReport = () => {
    let data = [];
    switch (reportType) {
      case 'WIP':
        data = filterByDate(wipCycles).map(item => ({
          ...item,
          materialCost: calculateMaterialCost(item),
          laborCost: item.laborCost || item.costSummary?.laborCost || 0,
          overheadCost: item.overheadCost || item.costSummary?.overheadCost || 0,
          totalCost: item.totalCost || item.costSummary?.totalCost || 0,
        }));
        break;
      case 'Finished Goods':
        data = filterByDate(finishedGoods).map(item => ({
          ...item,
          materialCost: calculateMaterialCost(item),
          laborCost: item.laborCost || item.costSummary?.laborCost || 0,
          overheadCost: item.overheadCost || item.costSummary?.overheadCost || 0,
          totalCost: item.totalCost || item.costSummary?.totalCost || 0,
        }));
        break;
      case 'Damaged':
        data = filterByDate(damagedProducts).map(item => ({
          ...item,
          materialCost: calculateMaterialCost(item),
          laborCost: item.laborCost || item.costSummary?.laborCost || 0,
          overheadCost: item.overheadCost || item.costSummary?.overheadCost || 0,
          totalCost: item.totalCost || item.costSummary?.totalCost || 0,
        }));
        break;
      case 'Material Consumption':
        data = filterByDate(finishedGoods).map((fg) => {
          const materialCost = calculateMaterialCost(fg);
          return {
            ...fg,
            materialCost,
            laborCost: fg.laborCost || fg.costSummary?.laborCost || 0,
            overheadCost: fg.overheadCost || fg.costSummary?.overheadCost || 0,
            totalCost: fg.totalCost || fg.costSummary?.totalCost || 0,
            rawMaterials: (fg.rawMaterials || fg.consumedMaterials || []).map((rm) => ({
              ...rm,
              remaining: getProductStock(rm.productId || rm.materialId),
              productName: rm.productName || rm.materialName || 
                products.find((p) => p.id === (rm.productId || rm.materialId))?.name || 
                rm.productId || rm.materialId,
              quantity: rm.quantity || rm.qtyUsed || 0,
              costPerUnit: rm.costPerUnit || rm.unitCost || 0,
              totalCost: rm.totalCost || (rm.quantity * rm.costPerUnit) || (rm.qtyUsed * rm.unitCost) || 0,
            })),
          };
        });
        break;
      default:
        data = [];
    }

    setFilteredData(data);
    setTotals(data.reduce((sum, item) => sum + (item.quantityCompleted || 0), 0));
    setPage(0);

    if (data.length === 0) {
      setSnackbar({
        open: true,
        message: 'No data found for the selected criteria',
        severity: 'info',
      });
    }
  };

  const exportExcel = () => {
    if (!filteredData.length) {
      setSnackbar({ open: true, message: 'No data to export', severity: 'warning' });
      return;
    }

    try {
      const excelData = filteredData.map((row) => {
        const rmStr = (row.rawMaterials || [])
          .map((rm) => {
            const name = rm.productName || rm.materialName || rm.productId || rm.materialId;
            return `${name} | Qty: ${rm.quantity || rm.qtyUsed || 0} | Cost: $${(Number(rm.costPerUnit) || Number(rm.unitCost) || 0).toFixed(2)} | Total: $${(Number(rm.totalCost) || 0).toFixed(2)} | Remaining: ${rm.remaining ?? 0}`;
          })
          .join('; ');
        return {
          ...row,
          materialCost: `$${(Number(row.materialCost) || 0).toFixed(2)}`,
          laborCost: `$${(Number(row.laborCost) || 0).toFixed(2)}`,
          overheadCost: `$${(Number(row.overheadCost) || 0).toFixed(2)}`,
          totalCost: `$${(Number(row.totalCost) || 0).toFixed(2)}`,
          rawMaterials: rmStr,
          createdAt: formatDate(row.createdAt),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Production Report');
      XLSX.writeFile(workbook, `${reportType}_Report_${Date.now()}.xlsx`);
      setSnackbar({ open: true, message: 'Excel file exported successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to export Excel file', severity: 'error' });
    }
  };

  const exportPDF = () => {
    if (!filteredData.length) {
      setSnackbar({ open: true, message: 'No data to export', severity: 'warning' });
      return;
    }

    try {
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.setFontSize(14);
      doc.text(`${reportType} Report`, 14, 16);

      const tableRows = [];
      filteredData.forEach((row) => {
        tableRows.push([
          row.batchNo?.replace(/[^0-9]/g, '') || row.name?.replace(/[^0-9]/g, '') || row.planId?.slice(-6) || row.id?.slice(-6) || '-',
          row.productName || '-',
          row.quantityPlanned || 0,
          row.quantityCompleted || 0,
          row.status || '-',
          `$${(Number(row.laborCost) || 0).toFixed(2)}`,
          `$${(Number(row.overheadCost) || 0).toFixed(2)}`,
          `$${(Number(row.materialCost) || 0).toFixed(2)}`,
          `$${(Number(row.totalCost) || 0).toFixed(2)}`,
          formatDate(row.createdAt),
        ]);

        (row.rawMaterials || []).forEach((rm) => {
          const name = rm.productName || rm.materialName || rm.productId || rm.materialId;
          tableRows.push([
            '',
            `↳ ${name}`,
            `Qty: ${rm.quantity || rm.qtyUsed || 0}`,
            '',
            '',
            `Cost/unit: $${(Number(rm.costPerUnit) || Number(rm.unitCost) || 0).toFixed(2)}`,
            `Total: $${(Number(rm.totalCost) || 0).toFixed(2)}`,
            `Remaining: ${rm.remaining ?? 0}`,
            '',
            '',
          ]);
        });
      });

      doc.autoTable({
        head: [
          [
            'Batch No',
            'Product Name',
            'Qty Planned',
            'Qty Completed',
            'Status',
            'Labor Cost',
            'Overhead Cost',
            'Material Cost',
            'Total Cost',
            'Created At',
          ],
        ],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        bodyStyles: { valign: 'top' },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      doc.save(`${reportType}_Report_${Date.now()}.pdf`);
      setSnackbar({ open: true, message: 'PDF file exported successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to export PDF file', severity: 'error' });
    }
  };

  const printReport = () => {
    if (!filteredData.length) {
      setSnackbar({ open: true, message: 'No data to print', severity: 'warning' });
      return;
    }
    window.print();
  };

  const columns = useMemo(() => {
    if (!filteredData.length) return [];
    return ['batchNo', 'productName', 'quantityPlanned', 'quantityCompleted', 'status', 'laborCost', 'overheadCost', 'materialCost', 'totalCost', 'createdAt'].filter(
      (key) => filteredData.some((row) => row.hasOwnProperty(key) || key === 'batchNo')
    );
  }, [filteredData]);

  const paginatedData = filteredData.slice(
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

  const formatColumnName = (col) => {
    return col
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className='p-6 flex flex-col gap-6'>
      {/* Dashboard Header */}
      <Card sx={{ background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <div className='flex items-center gap-3 mb-4'>
            <AssessmentIcon sx={{ fontSize: 40 }} />
            <div>
              <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
                Production Dashboard
              </Typography>
              <Typography variant='body1' sx={{ opacity: 0.9 }}>
                Comprehensive production analytics and reporting
              </Typography>
            </div>
          </div>
          
          {/* Key Metrics */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                  {dashboardMetrics.totalCycles}
                </Typography>
                <Typography variant='body2' sx={{ opacity: 0.8 }}>
                  Total Cycles
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                  {dashboardMetrics.totalProduction.toLocaleString()}
                </Typography>
                <Typography variant='body2' sx={{ opacity: 0.8 }}>
                  Units Produced
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                  ${dashboardMetrics.totalCost.toLocaleString()}
                </Typography>
                <Typography variant='body2' sx={{ opacity: 0.8 }}>
                  Total Cost
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h3' sx={{ fontWeight: 700, mb: 1 }}>
                  {dashboardMetrics.completionRate.toFixed(1)}%
                </Typography>
                <Typography variant='body2' sx={{ opacity: 0.8 }}>
                  Completion Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#10b981', fontSize: 32 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Completed
                </Typography>
              </Box>
              <Typography variant='h4' sx={{ fontWeight: 700, color: '#10b981', mb: 1 }}>
                {dashboardMetrics.completedCycles}
              </Typography>
              <LinearProgress 
                variant='determinate' 
                value={dashboardMetrics.completionRate} 
                sx={{ height: 8, borderRadius: 4, bgcolor: '#e5e7eb' }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <ScheduleIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  In Progress
                </Typography>
              </Box>
              <Typography variant='h4' sx={{ fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                {dashboardMetrics.wipCount}
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Active production cycles
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <WarningIcon sx={{ color: '#ef4444', fontSize: 32 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Damaged
                </Typography>
              </Box>
              <Typography variant='h4' sx={{ fontWeight: 700, color: '#ef4444', mb: 1 }}>
                {dashboardMetrics.damagedCount}
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Quality issues
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <MoneyIcon sx={{ color: '#8b5cf6', fontSize: 32 }} />
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                  Avg Cost/Unit
                </Typography>
              </Box>
              <Typography variant='h4' sx={{ fontWeight: 700, color: '#8b5cf6', mb: 1 }}>
                ${dashboardMetrics.avgCostPerUnit.toFixed(2)}
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Production efficiency
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reports Section */}
      <Card sx={{ boxShadow: 3 }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant='h6' sx={{ fontWeight: 600, color: 'grey.800' }}>
            Production Reports
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
            Generate detailed reports and export data
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <div className='flex flex-wrap gap-4 items-end'>
            <TextField
              type='date'
              label='Start Date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size='small'
              InputLabelProps={{ shrink: true }}
              sx={{ width: 180 }}
            />
            <TextField
              type='date'
              label='End Date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size='small'
              InputLabelProps={{ shrink: true }}
              sx={{ width: 180 }}
            />
            <FormControl size='small' sx={{ width: 220 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label='Report Type'
              >
                <MenuItem value=''>
                  <em>Select Report</em>
                </MenuItem>
                <MenuItem value='WIP'>Work In Progress</MenuItem>
                <MenuItem value='Finished Goods'>Finished Goods</MenuItem>
                <MenuItem value='Damaged'>Damaged Products</MenuItem>
                <MenuItem value='Material Consumption'>Material Consumption</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant='contained'
              onClick={handleGenerateReport}
              disabled={!reportType}
              sx={{
                bgcolor: '#0d9488',
                '&:hover': { bgcolor: '#14b8a6' },
                '&:disabled': { bgcolor: 'grey.300' },
              }}
            >
              Generate Report
            </Button>
          </div>
        </Box>

        {/* Export Buttons */}
        {filteredData.length > 0 && (
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <div className='flex gap-3'>
              <Button
                variant='outlined'
                startIcon={<ExportIcon />}
                onClick={exportExcel}
                sx={{ borderColor: '#0d9488', color: '#0d9488' }}
              >
                Export Excel
              </Button>
              <Button
                variant='outlined'
                startIcon={<ExportIcon />}
                onClick={exportPDF}
                sx={{ borderColor: '#0d9488', color: '#0d9488' }}
              >
                Export PDF
              </Button>
              <Button
                variant='outlined'
                startIcon={<PrintIcon />}
                onClick={printReport}
                sx={{ borderColor: '#0d9488', color: '#0d9488' }}
              >
                Print Report
              </Button>
              <div className='ml-auto flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    Total Quantity:
                  </Typography>
                  <Chip label={totals.toLocaleString()} color='primary' size='small' />
                </div>
                <div className='flex items-center gap-2'>
                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    Total Material Cost:
                  </Typography>
                  <Chip 
                    label={`$${filteredData.reduce((sum, item) => sum + (Number(item.materialCost) || 0), 0).toFixed(2)}`} 
                    color='secondary' 
                    size='small' 
                  />
                </div>
              </div>
            </div>
          </Box>
        )}

        {/* Table */}
        <Box sx={{ p: 3 }}>
          {filteredData.length === 0 ? (
            <Typography color='text.secondary' sx={{ textAlign: 'center', py: 4 }}>
              {reportType
                ? 'No records found for the selected criteria. Please adjust your filters and try again.'
                : 'Select a report type and click "Generate Report" to view data.'}
            </Typography>
          ) : (
            <Card sx={{ boxShadow: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
              <div ref={tableRef}>
                <TableContainer sx={{ flex: 1, overflow: 'auto', minHeight: '400px' }}>
                  <Table size='medium' stickyHeader>
                    <TableHead>
                      <TableRow>
                        {columns.map((col) => (
                          <TableCell
                            key={col}
                            sx={{
                              bgcolor: '#0d9488',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.95rem',
                              py: 1.5,
                              minWidth: 120,
                            }}
                          >
                            {formatColumnName(col)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.map((row, rowIndex) => {
                        const actualIndex = page * rowsPerPage + rowIndex;
                        const isEven = actualIndex % 2 === 0;
                        return (
                          <TableRow
                            key={row.planId || row.id || rowIndex}
                            hover
                            sx={{
                              bgcolor: isEven ? '#fafafa' : '#f5f5f5',
                              '&:hover': { bgcolor: '#e8f5e9' },
                            }}
                          >
                            {columns.map((col) => (
                              <TableCell
                                key={col}
                                sx={{ color: 'grey.800', py: 1.5 }}
                              >
                                {col === 'batchNo' ? (
                                  row.batchNo?.replace(/[^0-9]/g, '') || row.name?.replace(/[^0-9]/g, '') || row.planId?.slice(-6) || row.id?.slice(-6) || '-'
                                ) : col === 'status' ? (
                                  <Chip
                                    label={row[col] || '-'}
                                    size='small'
                                    color={
                                      row[col] === 'completed'
                                        ? 'success'
                                        : row[col] === 'in_progress'
                                        ? 'info'
                                        : 'default'
                                    }
                                  />
                                ) : col === 'createdAt' ? (
                                  formatDate(row[col])
                                ) : (col === 'materialCost' || col === 'laborCost' || col === 'overheadCost' || col === 'totalCost') ? (
                                  `$${(Number(row[col]) || 0).toFixed(2)}`
                                ) : (
                                  row[col]?.toString() || '-'
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <TablePagination
                component='div'
                count={filteredData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                sx={{
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  '& .MuiTablePagination-toolbar': { bgcolor: 'grey.50' },
                }}
              />
            </Card>
          )}
        </Box>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}