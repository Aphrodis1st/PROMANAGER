// ========================================
// ✅ ReportsDashboard.jsx (Professional Dashboard)
// Modern financial reporting dashboard with analytics
// ========================================
import React, { useState, useEffect, useMemo } from "react";
import { useReports } from "../../context/ReportsContext";
import { useStock, useStockCurrency } from "../../context/stockContext";
import CurrencyDisplay from "../../components/stock/CurrencyDisplay";
import ReportsTable from "../../components/stock/ReportsTable";
import {
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Paper,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  MonetizationOn as MoneyIcon,
  Receipt as ReceiptIcon,
  Analytics as AnalyticsIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  DateRange as DateRangeIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";

export default function ReportsDashboard() {
  const { loadReports } = useReports();
  const { formatAmount } = useStockCurrency();
  const [activeTab, setActiveTab] = useState("overview");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('thisMonth');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const tabs = [
    { key: "overview", label: "Overview", icon: <AssessmentIcon /> },
    { key: "ledger", label: "Ledger", icon: <ReceiptIcon /> },
    { key: "trialBalance", label: "Trial Balance", icon: <AccountBalanceIcon /> },
    { key: "incomeStatement", label: "Income Statement", icon: <TrendingUpIcon /> },
    { key: "balanceSheet", label: "Balance Sheet", icon: <AnalyticsIcon /> },
    { key: "cashFlow", label: "Cash Flow", icon: <TimelineIcon /> },
  ];

  // Mock financial data for demonstration
  const financialMetrics = useMemo(() => {
    return {
      totalRevenue: 2450000,
      totalExpenses: 1890000,
      netIncome: 560000,
      totalAssets: 8750000,
      totalLiabilities: 3200000,
      equity: 5550000,
      cashFlow: 420000,
      grossMargin: 22.9,
      netMargin: 18.6,
      roe: 15.2,
      currentRatio: 2.73,
      revenueGrowth: 12.5,
      expenseGrowth: 8.3,
    };
  }, [dateRange, selectedPeriod]);

  const fetchReport = async (type) => {
    if (type === 'overview') {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await loadReports(type);
      setReportData(data);
    } catch (err) {
      console.error(`Error loading ${type} report:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Load report on tab change
  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Professional Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 3, 
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <AssessmentIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
                Financial Reports Dashboard
              </Typography>
              <Typography variant='body1' sx={{ opacity: 0.9 }}>
                Comprehensive financial analysis and reporting suite
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size='small' sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: 'white' }}>Period</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                sx={{ 
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                  '& .MuiSvgIcon-root': { color: 'white' }
                }}
              >
                <MenuItem value='thisMonth'>This Month</MenuItem>
                <MenuItem value='lastMonth'>Last Month</MenuItem>
                <MenuItem value='thisQuarter'>This Quarter</MenuItem>
                <MenuItem value='thisYear'>This Year</MenuItem>
              </Select>
            </FormControl>
            <IconButton 
              onClick={handleMenuClick}
              sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon sx={{ mr: 1 }} /> Export PDF
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PrintIcon sx={{ mr: 1 }} /> Print Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon sx={{ mr: 1 }} /> Share Report
        </MenuItem>
      </Menu>

      {/* Financial Overview Cards - Only show on overview tab */}
      {activeTab === 'overview' && (
        <>
          {/* Key Financial Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#dcfce7', color: '#16a34a' }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <Typography variant='h5' sx={{ fontWeight: 700, color: '#16a34a' }}>
                      <CurrencyDisplay amount={financialMetrics.totalRevenue} />
                    </Typography>
                  </Box>
                  <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                    Total Revenue
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`+${financialMetrics.revenueGrowth}%`} 
                      size='small' 
                      sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 }}
                    />
                    <Typography variant='caption' sx={{ ml: 1, color: 'text.secondary' }}>
                      vs last period
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#fef3c7', color: '#d97706' }}>
                      <TrendingDownIcon />
                    </Avatar>
                    <Typography variant='h5' sx={{ fontWeight: 700, color: '#d97706' }}>
                      <CurrencyDisplay amount={financialMetrics.totalExpenses} />
                    </Typography>
                  </Box>
                  <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                    Total Expenses
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`+${financialMetrics.expenseGrowth}%`} 
                      size='small' 
                      sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 600 }}
                    />
                    <Typography variant='caption' sx={{ ml: 1, color: 'text.secondary' }}>
                      vs last period
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#e0e7ff', color: '#4f46e5' }}>
                      <MoneyIcon />
                    </Avatar>
                    <Typography variant='h5' sx={{ fontWeight: 700, color: '#4f46e5' }}>
                      <CurrencyDisplay amount={financialMetrics.netIncome} />
                    </Typography>
                  </Box>
                  <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                    Net Income
                  </Typography>
                  <LinearProgress 
                    variant='determinate' 
                    value={financialMetrics.netMargin} 
                    sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: '#e0e7ff' }}
                  />
                  <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                    {financialMetrics.netMargin}% Net Margin
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#f0fdfa', color: '#0d9488' }}>
                      <AccountBalanceIcon />
                    </Avatar>
                    <Typography variant='h5' sx={{ fontWeight: 700, color: '#0d9488' }}>
                      <CurrencyDisplay amount={financialMetrics.totalAssets} />
                    </Typography>
                  </Box>
                  <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                    Total Assets
                  </Typography>
                  <LinearProgress 
                    variant='determinate' 
                    value={75} 
                    sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: '#f0fdfa' }}
                  />
                  <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                    ROE: {financialMetrics.roe}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Financial Analysis Charts */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <PieChartIcon sx={{ color: '#1e40af', fontSize: 28 }} />
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                      Financial Performance Analysis
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0f9ff', borderRadius: 2 }}>
                        <Typography variant='h4' sx={{ fontWeight: 700, color: '#1e40af', mb: 1 }}>
                          {financialMetrics.grossMargin}%
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                          Gross Margin
                        </Typography>
                        <Typography variant='caption' sx={{ color: '#1e40af', fontWeight: 600 }}>
                          Industry Avg: 20.5%
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                        <Typography variant='h4' sx={{ fontWeight: 700, color: '#16a34a', mb: 1 }}>
                          {financialMetrics.currentRatio}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                          Current Ratio
                        </Typography>
                        <Typography variant='caption' sx={{ color: '#16a34a', fontWeight: 600 }}>
                          Healthy Liquidity
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fef7ff', borderRadius: 2 }}>
                        <Typography variant='h4' sx={{ fontWeight: 700, color: '#a855f7', mb: 1 }}>
                          <CurrencyDisplay amount={financialMetrics.cashFlow} />
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
                          Operating Cash Flow
                        </Typography>
                        <Typography variant='caption' sx={{ color: '#a855f7', fontWeight: 600 }}>
                          Strong Cash Position
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                      Balance Sheet Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                          <Typography variant='body2' color='text.secondary'>Assets</Typography>
                          <Typography variant='h6' sx={{ fontWeight: 600, color: '#0d9488' }}>
                            <CurrencyDisplay amount={financialMetrics.totalAssets} />
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                          <Typography variant='body2' color='text.secondary'>Liabilities</Typography>
                          <Typography variant='h6' sx={{ fontWeight: 600, color: '#dc2626' }}>
                            <CurrencyDisplay amount={financialMetrics.totalLiabilities} />
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
                          <Typography variant='body2' color='text.secondary'>Equity</Typography>
                          <Typography variant='h6' sx={{ fontWeight: 600, color: '#16a34a' }}>
                            <CurrencyDisplay amount={financialMetrics.equity} />
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <BarChartIcon sx={{ color: '#dc2626', fontSize: 28 }} />
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                      Quick Reports
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button 
                      variant='contained' 
                      fullWidth 
                      onClick={() => setActiveTab('incomeStatement')}
                      sx={{ 
                        bgcolor: '#1e40af', 
                        '&:hover': { bgcolor: '#1d4ed8' },
                        borderRadius: 2,
                        py: 1.5,
                        justifyContent: 'flex-start'
                      }}
                      startIcon={<TrendingUpIcon />}
                    >
                      Income Statement
                    </Button>
                    
                    <Button 
                      variant='outlined' 
                      fullWidth 
                      onClick={() => setActiveTab('balanceSheet')}
                      sx={{ 
                        borderColor: '#1e40af', 
                        color: '#1e40af',
                        '&:hover': { borderColor: '#1d4ed8', bgcolor: '#f0f9ff' },
                        borderRadius: 2,
                        py: 1.5,
                        justifyContent: 'flex-start'
                      }}
                      startIcon={<AccountBalanceIcon />}
                    >
                      Balance Sheet
                    </Button>
                    
                    <Button 
                      variant='outlined' 
                      fullWidth 
                      onClick={() => setActiveTab('cashFlow')}
                      sx={{ 
                        borderColor: '#1e40af', 
                        color: '#1e40af',
                        '&:hover': { borderColor: '#1d4ed8', bgcolor: '#f0f9ff' },
                        borderRadius: 2,
                        py: 1.5,
                        justifyContent: 'flex-start'
                      }}
                      startIcon={<TimelineIcon />}
                    >
                      Cash Flow Statement
                    </Button>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                      <Typography variant='body2' color='text.secondary' sx={{ mb: 1, fontWeight: 600 }}>
                        Report Status
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Last updated: Today, 2:30 PM
                      </Typography>
                      <br />
                      <Typography variant='caption' color='text.secondary'>
                        Next scheduled: Tomorrow, 9:00 AM
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Professional Tabs */}
      <Card elevation={2} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant='scrollable'
          scrollButtons='auto'
          sx={{
            bgcolor: 'white',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 72,
              px: 3,
              '&.Mui-selected': {
                color: '#1e40af',
                bgcolor: '#f0f9ff'
              },
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#1e40af',
              height: 3,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab 
              key={tab.key} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.icon}
                  {tab.label}
                </Box>
              } 
              value={tab.key} 
            />
          ))}
        </Tabs>
      </Card>

      {/* Report Content */}
      {activeTab !== 'overview' && (
        <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb', bgcolor: '#f8fafc' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#e0e7ff', color: '#1e40af' }}>
                    {tabs.find(t => t.key === activeTab)?.icon}
                  </Avatar>
                  <Box>
                    <Typography variant='h5' sx={{ fontWeight: 600 }}>
                      {tabs.find(t => t.key === activeTab)?.label}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Detailed financial report for {dateRange.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant='outlined' 
                    size='small'
                    startIcon={<FilterListIcon />}
                    sx={{ borderColor: '#1e40af', color: '#1e40af' }}
                  >
                    Filter
                  </Button>
                  <Button 
                    variant='contained' 
                    size='small'
                    startIcon={<DownloadIcon />}
                    sx={{ bgcolor: '#1e40af', '&:hover': { bgcolor: '#1d4ed8' } }}
                  >
                    Export
                  </Button>
                </Box>
              </Box>
            </Box>
            
            <ReportsTable
              reportType={activeTab}
              data={reportData}
              loading={loading}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
