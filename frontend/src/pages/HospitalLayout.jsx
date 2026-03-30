import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import HospitalSidebar from '../components/hospital/HospitalSidebar';

const drawerWidth = 320;

export default function HospitalLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <HospitalSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: `${drawerWidth}px`,
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        {children || <Outlet />}
      </Box>
    </Box>
  );
}