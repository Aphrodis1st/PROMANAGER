import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer, List, Typography, Toolbar } from '@mui/material';
import PharmacySidebar from './PharmacySidebar';

const drawerWidth = 280;

export default function PharmacyLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#1976d2',
            color: 'white',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
            Pharmacy Services
          </Typography>
        </Toolbar>
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <PharmacySidebar />
          </List>
        </Box>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}