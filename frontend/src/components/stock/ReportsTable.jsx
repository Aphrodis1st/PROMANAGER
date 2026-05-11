// ========================================
// ✅ ReportsTable.jsx (Professional Component)
// Enhanced financial reports table with modern design
// ========================================
import React, { useState } from "react";
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
  Box,
  Chip,
  Avatar,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import { useReports } from "../../context/ReportsContext";

export default function ReportsTable({ reportType }) {
  const {
    ledger,
    trialBalance,
    incomeStatement,
    balanceSheet,
    cashFlow,
    loadingLedger,
    loadingTrial,
    loadingIncome,
    loadingBalance,
    loadingCashFlow,
  } = useReports();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let data = [];
  let loading = false;
  let title = "";

  switch (reportType) {
    case "ledger":
      data = ledger;
      loading = loadingLedger;
      title = "Ledger";
      break;
    case "trialBalance":
      data = trialBalance;
      loading = loadingTrial;
      title = "Trial Balance";
      break;
    case "incomeStatement":
      data = incomeStatement;
      loading = loadingIncome;
      title = "Income Statement";
      break;
    case "balanceSheet":
      data = balanceSheet;
      loading = loadingBalance;
      title = "Balance Sheet";
      break;
    case "cashFlow":
      data = cashFlow;
      loading = loadingCashFlow;
      title = "Cash Flow Statement";
      break;
    default:
      data = [];
      loading = false;
      title = "Report";
  }

  const filteredData = data.filter((row) => {
    if (reportType === "ledger") {
      return (
        row.accountName?.toLowerCase().includes(search.toLowerCase()) ||
        row.description?.toLowerCase().includes(search.toLowerCase())
      );
    } else if (reportType === "trialBalance") {
      return row.accountName?.toLowerCase().includes(search.toLowerCase());
    } else if (reportType === "incomeStatement" || reportType === "balanceSheet") {
      return row.accountName?.toLowerCase().includes(search.toLowerCase());
    } else if (reportType === "cashFlow") {
      return row.activity?.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "-";
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getHeaders = () => {
    if (reportType === "ledger") {
      return ["Date", "Description", "Account", "Debit", "Credit", "Balance"];
    } else if (reportType === "trialBalance") {
      return ["Account", "Debit", "Credit"];
    } else if (reportType === "incomeStatement" || reportType === "balanceSheet") {
      return ["Account", "Amount", "Type"];
    } else if (reportType === "cashFlow") {
      return ["Activity", "Amount"];
    }
    return [];
  };

  const getReportIcon = () => {
    switch (reportType) {
      case "ledger": return <ReceiptIcon />;
      case "trialBalance": return <AccountBalanceIcon />;
      case "incomeStatement": return <TrendingUpIcon />;
      case "balanceSheet": return <AnalyticsIcon />;
      case "cashFlow": return <TimelineIcon />;
      default: return <ReceiptIcon />;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Enhanced Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#e0e7ff', color: '#1e40af' }}>
            {getReportIcon()}
          </Avatar>
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 600, color: 'grey.800' }}>
              {title}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {filteredData.length} records found
            </Typography>
          </Box>
        </Box>
        
        <TextField
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size='small'
          sx={{ 
            width: 320,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#1e40af' }} />
          <Typography sx={{ ml: 2, color: 'text.secondary', fontWeight: 500 }}>
            Loading {title}...
          </Typography>
        </Box>
      ) : filteredData.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 8,
          bgcolor: '#f8fafc',
          borderRadius: 2
        }}>
          <Avatar sx={{ bgcolor: '#e5e7eb', color: '#6b7280', width: 64, height: 64, mb: 2 }}>
            {getReportIcon()}
          </Avatar>
          <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
            No Records Found
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {search ? `No results for "${search}"` : `No ${title.toLowerCase()} data available`}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 2 }}>
          <TableContainer sx={{ bgcolor: 'white' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {getHeaders().map((header) => (
                    <TableCell
                      key={header}
                      align={
                        header === "Debit" ||
                        header === "Credit" ||
                        header === "Balance" ||
                        header === "Amount"
                          ? "right"
                          : "left"
                      }
                      sx={{
                        bgcolor: '#1e40af',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        py: 2,
                        borderBottom: 'none'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row, index) => {
                  const actualIndex = page * rowsPerPage + index;
                  const isEven = actualIndex % 2 === 0;
                  return (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        bgcolor: isEven ? '#fafafa' : 'white',
                        '&:hover': {
                          bgcolor: '#f0f9ff',
                        },
                        cursor: 'pointer'
                      }}
                    >
                      {reportType === "ledger" && (
                        <>
                          <TableCell sx={{ py: 2, fontWeight: 500 }}>
                            {row.date ? new Date(row.date).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell sx={{ py: 2, fontWeight: 500 }}>
                            {row.description || "-"}
                          </TableCell>
                          <TableCell sx={{ py: 2, fontWeight: 500 }}>
                            <Chip 
                              label={row.accountName || row.accountId}
                              size='small'
                              sx={{ bgcolor: '#e0e7ff', color: '#1e40af', fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2, fontWeight: 600, color: '#dc2626' }}>
                            {row.debit ? formatAmount(row.debit) : "-"}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2, fontWeight: 600, color: '#16a34a' }}>
                            {row.credit ? formatAmount(row.credit) : "-"}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2, fontWeight: 700, color: '#1e40af' }}>
                            {formatAmount(row.balance)}
                          </TableCell>
                        </>
                      )}

                      {reportType === "trialBalance" && (
                        <>
                          <TableCell sx={{ py: 2, fontWeight: 500 }}>
                            <Chip 
                              label={row.accountName || row.accountId}
                              size='small'
                              sx={{ bgcolor: '#e0e7ff', color: '#1e40af', fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2, fontWeight: 600, color: '#dc2626' }}>
                            {formatAmount(row.debit)}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2, fontWeight: 600, color: '#16a34a' }}>
                            {formatAmount(row.credit)}
                          </TableCell>
                        </>
                      )}

                      {(reportType === "incomeStatement" ||
                        reportType === "balanceSheet") && (
                        <>
                          <TableCell sx={{ py: 2, fontWeight: 500 }}>
                            <Chip 
                              label={row.accountName || row.accountId}
                              size='small'
                              sx={{ bgcolor: '#e0e7ff', color: '#1e40af', fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2, fontWeight: 700, color: '#1e40af' }}>
                            {formatAmount(row.amount)}
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Chip 
                              label={row.type || row.category || "-"}
                              size='small'
                              sx={{ 
                                bgcolor: row.type === 'Asset' ? '#dcfce7' : row.type === 'Liability' ? '#fef3c7' : '#f3e8ff',
                                color: row.type === 'Asset' ? '#166534' : row.type === 'Liability' ? '#92400e' : '#7c3aed',
                                fontWeight: 600 
                              }}
                            />
                          </TableCell>
                        </>
                      )}

                      {reportType === "cashFlow" && (
                        <>
                          <TableCell sx={{ py: 2, fontWeight: 500 }}>
                            {row.activity}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2, fontWeight: 700, color: '#1e40af' }}>
                            {formatAmount(row.amount)}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            sx={{
              bgcolor: '#f8fafc',
              borderTop: '1px solid #e5e7eb',
              '& .MuiTablePagination-toolbar': {
                px: 3,
                py: 2
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
