import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import HospitalSidebar from '../components/hospital/HospitalSidebar';

const drawerWidth = 320;

export default function HospitalLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <HospitalSidebar />
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