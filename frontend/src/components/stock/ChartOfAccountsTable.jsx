import React, { useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Chip,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip,
  TablePagination,
  Button,
  TableSortLabel,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";

export default function ChartOfAccountsTable({
  data = [],
  loading,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("code");
  const [order, setOrder] = useState("asc");

  const filtered = useMemo(() => {
    return data.filter((item) => {
      return (
        (item.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (item.code?.toString().includes(search) || false) ||
        (item.accountType?.toLowerCase().includes(search.toLowerCase()) ||
          false) ||
        (item.category?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (item.subCategory?.toLowerCase().includes(search.toLowerCase()) || false)
      );
    });
  }, [data, search]);

  const sorted = useMemo(() => {
    const comparator = (a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      if (aVal == null) aVal = "";
      if (bVal == null) bVal = "";

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    };

    return [...filtered].sort(comparator);
  }, [filtered, orderBy, order]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status) => {
    return status === "Active" ? "success" : "error";
  };

  const getTypeColor = (type) => {
    const colors = {
      Asset: "#3b82f6",
      Liability: "#ef4444",
      Equity: "#8b5cf6",
      Revenue: "#10b981",
      Expense: "#f59e0b",
    };
    return colors[type] || "#6b7280";
  };

  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "grey.800",
          }}
        >
          Chart of Accounts
        </Typography>
        <div className="flex items-center gap-4">
          <TextField
            placeholder="Search account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{
                bgcolor: "#0d9488",
                "&:hover": {
                  bgcolor: "#14b8a6",
                },
              }}
            >
              Add Account
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flex: 1,
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2, color: "text.secondary" }}>
            Loading accounts...
          </Typography>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flex: 1,
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">No accounts found.</Typography>
        </div>
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "600px",
          }}
        >
          <TableContainer
            sx={{
              flex: 1,
              overflow: "auto",
              minHeight: "500px",
            }}
          >
            <Table stickyHeader size="medium">
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
                    <TableSortLabel
                      active={orderBy === "code"}
                      direction={orderBy === "code" ? order : "asc"}
                      onClick={() => handleSort("code")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      Code
                    </TableSortLabel>
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
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleSort("name")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      Account Name
                    </TableSortLabel>
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
                    <TableSortLabel
                      active={orderBy === "accountType"}
                      direction={orderBy === "accountType" ? order : "asc"}
                      onClick={() => handleSort("accountType")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      Type
                    </TableSortLabel>
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
                    <TableSortLabel
                      active={orderBy === "category"}
                      direction={orderBy === "category" ? order : "asc"}
                      onClick={() => handleSort("category")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      Category
                    </TableSortLabel>
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
                    Sub Category
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
                    Statement
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
                    <TableSortLabel
                      active={orderBy === "status"}
                      direction={orderBy === "status" ? order : "asc"}
                      onClick={() => handleSort("status")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      Status
                    </TableSortLabel>
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
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((acc, index) => {
                  const actualIndex = page * rowsPerPage + index;
                  const isEven = actualIndex % 2 === 0;
                  return (
                    <TableRow
                      key={acc.id || acc._id}
                      hover
                      sx={{
                        bgcolor: isEven ? "#fafafa" : "#f5f5f5",
                        "&:hover": {
                          bgcolor: "#e8f5e9",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontFamily: "monospace",
                          color: "grey.800",
                          py: 1.5,
                          fontWeight: 600,
                        }}
                      >
                        {acc.code ?? "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: "grey.800",
                          py: 1.5,
                        }}
                      >
                        {acc.name ?? "-"}
                      </TableCell>
                      <TableCell sx={{ color: "grey.800", py: 1.5 }}>
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 2,
                            py: 0.5,
                            bgcolor: getTypeColor(acc.accountType),
                            color: "white",
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          {acc.accountType ?? "-"}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "grey.800", py: 1.5 }}>
                        {acc.category ?? "-"}
                      </TableCell>
                      <TableCell sx={{ color: "grey.800", py: 1.5 }}>
                        {acc.subCategory ?? "-"}
                      </TableCell>
                      <TableCell sx={{ color: "grey.800", py: 1.5 }}>
                        {acc.statement ?? "-"}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        <Chip
                          label={acc.status ?? "-"}
                          size="small"
                          color={getStatusColor(acc.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {onEdit && (
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onEdit(acc)}
                                sx={{
                                  "&:hover": {
                                    bgcolor: "primary.light",
                                    color: "white",
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onDelete && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDelete(acc.id || acc._id)}
                                sx={{
                                  "&:hover": {
                                    bgcolor: "error.light",
                                    color: "white",
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sorted.length}
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
        </Paper>
      )}
    </div>
  );
}
