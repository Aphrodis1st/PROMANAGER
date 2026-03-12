import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';

export default function PharmacyDashboard() {
  const navigate = useNavigate();

  const dashboardCards = [
    { title: 'Total Prescriptions', value: '1,234', color: '#2196f3', path: '/pharmacy/prescriptions' },
    { title: 'Pending Orders', value: '56', color: '#ff9800', path: '/pharmacy/orders' },
    { title: 'Active Quotes', value: '23', color: '#4caf50', path: '/pharmacy/quotes' },
    { title: 'Today\'s Revenue', value: '₹45,678', color: '#9c27b0', path: '/pharmacy/payments' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pharmacy Services Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: card.color }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" onClick={() => navigate('/pharmacy/prescriptions/create')}>
                  Create New Prescription
                </Button>
                <Button variant="contained" onClick={() => navigate('/pharmacy/orders/create')}>
                  Create New Order
                </Button>
                <Button variant="contained" onClick={() => navigate('/pharmacy/quotes/create')}>
                  Generate Quote
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">• New prescription received from Dr. Smith</Typography>
                <Typography variant="body2">• Order #1234 shipped to customer</Typography>
                <Typography variant="body2">• Quote approved for bulk order</Typography>
                <Typography variant="body2">• Payment processed for Order #1235</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}