import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../../components/stock/sidebar';

const drawerWidth = 320;

export default function StockLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          p: 0,
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        {children || <Outlet />}
      </Box>
    </Box>
  );
}
