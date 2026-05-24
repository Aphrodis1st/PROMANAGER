import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer, List, Typography, Toolbar } from '@mui/material';
import PharmacySidebar from './PharmacySidebar';
import { getServiceOrganization } from '../../utils/authCookies.js';
import { getWorkspaceOrganization, getServiceLabel } from '../../config/serviceContext.js';

const drawerWidth = 280;

export default function PharmacyLayout() {
  const organization = getWorkspaceOrganization('pharmacy') || getServiceOrganization('pharmacy');
  const serviceLabel = getServiceLabel('pharmacy');

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
          <Box>
            <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
              {organization?.name || 'Pharmacy Services'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
              {serviceLabel}
            </Typography>
          </Box>
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