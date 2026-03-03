import { ListItemButton, ListItemText, Collapse, List } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function ManagementLinks() {
  const [doctorsOpen, setDoctorsOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);

  return (
    <>
      {/* Doctors Menu */}
      <ListItemButton 
        onClick={() => setDoctorsOpen(!doctorsOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Doctors" />
        {doctorsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={doctorsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/hospital/doctors" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Doctor List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/doctors/schedule" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Doctor Schedule" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/doctors/specialization" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Specializations" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Departments Menu */}
      <ListItemButton 
        onClick={() => setDepartmentsOpen(!departmentsOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Departments" />
        {departmentsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={departmentsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/hospital/departments" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Department List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/departments/create" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Create Department" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/departments/:id" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Department Details" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/departments/assign-head/:id" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Assign Head" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/departments/statistics/:id" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Statistics" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}