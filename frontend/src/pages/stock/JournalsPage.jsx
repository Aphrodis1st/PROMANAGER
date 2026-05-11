import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  LinearProgress,
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
} from "@mui/icons-material";
import { useJournal } from "../../context/JournalContext";
import { useStock } from "../../context/stockContext";
import JournalForm from "../../components/stock/JournalForm";
import JournalTable from "../../components/stock/JournalTable";

export default function JournalsPage() {
  const { journalEntries, addJournalEntry, removeJournalEntry, loading } = useJournal();
  const { accountSettings } = useStock();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    let totalDebits = 0;
    let totalCredits = 0;
    let entriesThisMonth = 0;
    let balancedEntries = 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    journalEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
        entriesThisMonth++;
      }

      let entryDebits = 0;
      let entryCredits = 0;
      
      entry.lines?.forEach(line => {
        if (line.type === 'debit') {
          totalDebits += Number(line.amount) || 0;
          entryDebits += Number(line.amount) || 0;
        } else if (line.type === 'credit') {
          totalCredits += Number(line.amount) || 0;
          entryCredits += Number(line.amount) || 0;
        }
      });

      if (entryDebits === entryCredits && entryDebits > 0) {
        balancedEntries++;
      }
    });

    return {
      totalEntries: journalEntries.length,
      totalDebits,
      totalCredits,
      entriesThisMonth,
      balancedEntries,
      balanceAccuracy: journalEntries.length > 0 ? (balancedEntries / journalEntries.length) * 100 : 0
    };
  }, [journalEntries]);

  const handleAddClick = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEditClick = (entry) => {
    setEditData(entry);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      await removeJournalEntry(id);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                mb: 1,
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              General Journal Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and track all accounting journal entries
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh Data">
              <IconButton 
                sx={{ 
                  bgcolor: 'white', 
                  boxShadow: 2,
                  '&:hover': { bgcolor: '#f1f5f9' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Journal">
              <IconButton 
                sx={{ 
                  bgcolor: 'white', 
                  boxShadow: 2,
                  '&:hover': { bgcolor: '#f1f5f9' }
                }}
              >
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{
                bgcolor: '#0d9488',
                '&:hover': { bgcolor: '#14b8a6' },
                borderRadius: 2,
                px: 3,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
              }}
            >
              New Entry
            </Button>
          </Stack>
        </Stack>

        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Entries
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {metrics.totalEntries}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <AssessmentIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(240, 147, 251, 0.3)'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Debits
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {formatCurrency(metrics.totalDebits)}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <TrendingUpIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(79, 172, 254, 0.3)'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Credits
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {formatCurrency(metrics.totalCredits)}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <WalletIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(250, 112, 154, 0.3)'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      This Month
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {metrics.entriesThisMonth}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <AnalyticsIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Balance Accuracy Card */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 3 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Journal Balance Accuracy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metrics.balancedEntries} of {metrics.totalEntries} entries are properly balanced
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={metrics.balanceAccuracy} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: '#e2e8f0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: metrics.balanceAccuracy >= 90 ? '#10b981' : metrics.balanceAccuracy >= 70 ? '#f59e0b' : '#ef4444',
                          borderRadius: 4
                        }
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {metrics.balanceAccuracy.toFixed(1)}%
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, minHeight: 'calc(100vh - 400px)' }}>
        {/* Journal Table */}
        <Box sx={{ flex: showForm ? 2 : 1 }}>
          <Paper 
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              height: '100%'
            }}
          >
            <JournalTable 
              data={journalEntries} 
              onDelete={handleDelete}
              onAdd={handleAddClick}
            />
          </Paper>
        </Box>

        {/* Journal Form */}
        {showForm && (
          <Box sx={{ flex: 1, minWidth: 400 }}>
            <Paper 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <JournalForm 
                initialData={editData} 
                onCancel={() => setShowForm(false)} 
              />
            </Paper>
          </Box>
        )}
      </Box>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack alignItems="center" spacing={2}>
              <LinearProgress sx={{ width: 200 }} />
              <Typography>Loading journal entries...</Typography>
            </Stack>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
