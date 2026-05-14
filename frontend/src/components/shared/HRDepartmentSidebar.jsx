import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ListItemButton, ListItemText, Collapse, List } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function HRDepartmentSidebar({ basePath }) {
  const [hrOpen, setHrOpen] = useState(false);

  return (
    <>
      <ListItemButton 
        onClick={() => setHrOpen(!hrOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="👥 HR Department" />
        {hrOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={hrOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to={`${basePath}/hr/employees`} sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Employees" />
          </ListItemButton>
          <ListItemButton component={Link} to={`${basePath}/hr/departments`} sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Departments" />
          </ListItemButton>
          <ListItemButton component={Link} to={`${basePath}/hr/attendance`} sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Attendance" />
          </ListItemButton>
          <ListItemButton component={Link} to={`${basePath}/hr/leave`} sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Leave Management" />
          </ListItemButton>
          <ListItemButton component={Link} to={`${basePath}/hr/payroll`} sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Payroll" />
          </ListItemButton>
          <ListItemButton component={Link} to={`${basePath}/hr/contracts`} sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Contracts" />
          </ListItemButton>
          <ListItemButton component={Link} to={`${basePath}/hr/shifts`} sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Shifts" />
          </ListItemButton>
          <ListItemButton component={Link} to={`${basePath}/hr/performance`} sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Performance" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
