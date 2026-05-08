import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TablePagination,
  Card,
  CardContent,
  Box,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, AttachMoney as CurrencyIcon } from "@mui/icons-material";
import { useStockAuth } from "../../context/StockAuthContext.jsx";
import { useCurrency } from "../../context/CurrencyContext.jsx";

const ALL_ROLES = [
  "ADMIN",
  "MANAGER",
  "STOREKEEPER",
  "PURCHASER",
  "SALES",
  "ACCOUNTANT",
  "PRODUCTIONMANAGER",
  "STAFF",
  "VISITO",
];

const ALL_DEPARTMENTS = [
  "Warehouse",
  "Finance",
  "Purchasing",
  "Sales",
  "Production",
  "Management",
  "Visitor",
  "Staff",
];

export default function UserSettingsPage() {
  const { logout } = useStockAuth();
  const { currencies, defaultCurrency, fetchDefaultCurrency, setOrganizationCurrency, loading: currencyLoading } = useCurrency();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });
  const [editingEmail, setEditingEmail] = useState(null);
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencyMessage, setCurrencyMessage] = useState("");
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [initializingCurrencies, setInitializingCurrencies] = useState(false);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("registeredStockUsers")) || [];
    setUsers(savedUsers);
    
    // Load currency settings
    const orgId = localStorage.getItem("stockOrganizationId") || "stock-org-1";
    fetchDefaultCurrency(orgId, "stock").then(currency => {
      if (currency) {
        setSelectedCurrency(currency.id);
      }
    });
  }, [currencies]);

  const handleInitializeCurrencies = async () => {
    try {
      setInitializingCurrencies(true);
      setCurrencyMessage("");
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${API_URL}/currency/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to initialize currencies');
      
      const data = await response.json();
      setCurrencyMessage(`Successfully initialized ${data.currencies.length} currencies!`);
      
      // Refresh currencies list
      window.location.reload();
    } catch (error) {
      setCurrencyMessage(`Error: ${error.message}`);
    } finally {
      setInitializingCurrencies(false);
      setTimeout(() => setCurrencyMessage(""), 5000);
    }
  };

  const handleCurrencySave = async () => {
    if (!selectedCurrency) {
      setCurrencyMessage("Please select a currency");
      setTimeout(() => setCurrencyMessage(""), 3000);
      return;
    }

    try {
      setSavingCurrency(true);
      const orgId = localStorage.getItem("stockOrganizationId") || "stock-org-1";
      await setOrganizationCurrency(orgId, "stock", selectedCurrency);
      setCurrencyMessage("Currency updated successfully!");
      setTimeout(() => setCurrencyMessage(""), 3000);
    } catch (error) {
      setCurrencyMessage("Failed to update currency");
      setTimeout(() => setCurrencyMessage(""), 3000);
    } finally {
      setSavingCurrency(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      let updatedUsers = [...users];
      if (editingEmail) {
        const idx = updatedUsers.findIndex((u) => u.email === editingEmail);
        updatedUsers[idx] = { ...updatedUsers[idx], ...form };
        setMessage("User updated successfully!");
      } else {
        if (updatedUsers.find((u) => u.email === form.email)) {
          throw new Error("Email already exists.");
        }
        updatedUsers.push(form);
        setMessage("User created successfully!");
      }
      setUsers(updatedUsers);
      localStorage.setItem("registeredStockUsers", JSON.stringify(updatedUsers));
      setForm({ name: "", email: "", password: "", role: "", department: "" });
      setEditingEmail(null);
      setFormOpen(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleEdit = (u) => {
    setForm(u);
    setEditingEmail(u.email);
    setFormOpen(true);
  };

  const handleDelete = (email) => {
    const updatedUsers = users.filter((u) => u.email !== email);
    setUsers(updatedUsers);
    localStorage.setItem("registeredStockUsers", JSON.stringify(updatedUsers));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase()) ||
      u.department?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginatedData = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'grey.800' }}>
          System Settings
        </Typography>
        <div className="flex items-center gap-4">
          <TextField
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setFormOpen(true);
              setEditingEmail(null);
              setForm({ name: "", email: "", password: "", role: "", department: "" });
            }}
            sx={{
              bgcolor: '#0d9488',
              '&:hover': {
                bgcolor: '#14b8a6',
              },
            }}
          >
            Create New User
          </Button>
        </div>
      </div>

      {/* Currency Settings Card */}
      <Card sx={{ mb: 4, border: '1px solid #e2e8f0', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CurrencyIcon sx={{ color: '#0d9488', fontSize: 28, mr: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
              Currency Configuration
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select the currency to be used for all stock transactions, purchases, sales, expenses, and financial reports. This currency will be applied across the entire stock management system.
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {currencyMessage && (
            <Alert 
              severity={currencyMessage.includes("success") ? "success" : "error"} 
              sx={{ mb: 3 }}
            >
              {currencyMessage}
            </Alert>
          )}

          {currencies.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                No currencies available. Initialize the currency system to get started.
              </Typography>
              <Button
                variant="contained"
                onClick={handleInitializeCurrencies}
                disabled={initializingCurrencies}
                sx={{
                  bgcolor: '#0d9488',
                  '&:hover': {
                    bgcolor: '#14b8a6',
                  },
                }}
              >
                {initializingCurrencies ? 'Initializing...' : 'Initialize Currencies'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <FormControl sx={{ flex: 1, maxWidth: 400 }} size="small">
                <InputLabel>Default Currency</InputLabel>
                <Select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  label="Default Currency"
                  disabled={currencyLoading || savingCurrency}
                  sx={{
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0d9488",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0d9488",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>-- Select Currency --</em>
                  </MenuItem>
                  {currencies.map((currency) => (
                    <MenuItem key={currency.id} value={currency.id}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleCurrencySave}
                disabled={savingCurrency || !selectedCurrency}
                sx={{
                  bgcolor: '#0d9488',
                  '&:hover': {
                    bgcolor: '#14b8a6',
                  },
                  minWidth: 120,
                  height: 40,
                }}
              >
                {savingCurrency ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          )}

          {defaultCurrency && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f0fdfa', borderRadius: 1, border: '1px solid #99f6e4' }}>
              <Typography variant="body2" sx={{ color: 'grey.700' }}>
                <strong>Current Currency:</strong> {defaultCurrency.code} - {defaultCurrency.name} ({defaultCurrency.symbol})
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* User Management Section */}
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800', mb: 2 }}>
        User Management
      </Typography>
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded">
        <div className="rounded-xl overflow-hidden shadow-md">
          <TableContainer>
            <Table size="medium">
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
                    Name
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
                    Email
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
                    Password
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
                    Department
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
                    Role
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
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((u, index) => {
                    const actualIndex = page * rowsPerPage + index;
                    const isEven = actualIndex % 2 === 0;
                    return (
                      <TableRow
                        key={u.email}
                        hover
                        sx={{
                          bgcolor: isEven ? "#fafafa" : "#f5f5f5",
                          "&:hover": {
                            bgcolor: "#e8f5e9",
                          },
                        }}
                      >
                        <TableCell sx={{ color: "grey.800", py: 1.5 }}>{u.name}</TableCell>
                        <TableCell sx={{ color: "grey.800", py: 1.5 }}>{u.email}</TableCell>
                        <TableCell sx={{ color: "grey.800", py: 1.5 }}>{u.password}</TableCell>
                        <TableCell sx={{ color: "grey.800", py: 1.5 }}>{u.department}</TableCell>
                        <TableCell sx={{ color: "grey.800", py: 1.5 }}>{u.role}</TableCell>
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <div className="flex items-center justify-center gap-2">
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(u)}
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
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(u.email)}
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
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredUsers.length}
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
        </div>
      </div>

      <Dialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingEmail(null);
          setForm({ name: "", email: "", password: "", role: "", department: "" });
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: '#0d9488',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.25rem',
            py: 2,
          }}
        >
          {editingEmail ? "Edit User" : "Create User"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: 'white' }}>
          {message && (
            <Alert severity={message.includes("success") ? "success" : "error"} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#0d9488" },
                    "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#0d9488" },
                    "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#0d9488" },
                    "&.Mui-focused fieldset": { borderColor: "#0d9488" },
                  },
                }}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  label="Department"
                  required
                  sx={{
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0d9488",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0d9488",
                    },
                  }}
                >
                  {ALL_DEPARTMENTS.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  label="Role"
                  required
                  sx={{
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0d9488",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0d9488",
                    },
                  }}
                >
                  {ALL_ROLES.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFormOpen(false);
                    setEditingEmail(null);
                    setForm({ name: "", email: "", password: "", role: "", department: "" });
                  }}
                  sx={{
                    borderColor: "grey.400",
                    color: "grey.700",
                    "&:hover": {
                      borderColor: "grey.600",
                      bgcolor: "grey.50",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#0d9488",
                    "&:hover": {
                      bgcolor: "#14b8a6",
                    },
                  }}
                >
                  {editingEmail ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
