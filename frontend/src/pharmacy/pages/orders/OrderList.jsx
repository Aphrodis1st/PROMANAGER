import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip
} from '@mui/material';

export default function OrderList() {
  const [orders] = useState([
    { 
      id: 1, 
      customerName: 'John Doe', 
      items: 'Paracetamol, Cough Syrup', 
      amount: '₹450', 
      status: 'Processing',
      date: '2024-01-15'
    },
    { 
      id: 2, 
      customerName: 'Jane Smith', 
      items: 'Antibiotics, Vitamins', 
      amount: '₹1,200', 
      status: 'Shipped',
      date: '2024-01-14'
    },
    { 
      id: 3, 
      customerName: 'Bob Wilson', 
      items: 'Insulin, Test Strips', 
      amount: '₹2,800', 
      status: 'Delivered',
      date: '2024-01-13'
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Shipped': return 'info';
      case 'Processing': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              All Orders
            </Typography>
            <Button variant="contained">
              Create New Order
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        View
                      </Button>
                      <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                        Track
                      </Button>
                      <Button size="small" variant="outlined" color="success">
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}