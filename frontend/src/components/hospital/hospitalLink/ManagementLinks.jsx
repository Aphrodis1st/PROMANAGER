import { ListItemButton, ListItemText, Collapse, List } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useHospitalAuth } from "../../../context/HospitalAuthContext";

export default function ManagementLinks() {
  const [doctorsOpen, setDoctorsOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { admin } = useHospitalAuth();

  // Check if user is hospital admin or sub admin
  const role = admin?.role?.toLowerCase();
  const isHospitalAdmin = role === 'hospital_admin' || role === 'hospital_sub_admin' || role === 'admin';

  return (
    <>
      {/* Hospital Admin Menu - Only show for hospital admins */}
      {isHospitalAdmin && (
        <>
          <ListItemButton 
            onClick={() => setAdminOpen(!adminOpen)}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <ListItemText primary="Hospital Admin" />
            {adminOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          
          <Collapse in={adminOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton component={Link} to="/hospital/admin/dashboard" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemText primary="Admin Dashboard" />
              </ListItemButton>
              <ListItemButton component={Link} to="/hospital/admin/users" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemText primary="User Management" />
              </ListItemButton>
              <ListItemButton component={Link} to="/hospital/admin/departments" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemText primary="Department Management" />
              </ListItemButton>
              <ListItemButton component={Link} to="/hospital/admin/staff" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemText primary="Staff Management" />
              </ListItemButton>
              <ListItemButton component={Link} to="/hospital/admin/patients" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemText primary="Patient Management" />
              </ListItemButton>
              <ListItemButton component={Link} to="/hospital/admin/appointments" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemText primary="Appointment System" />
              </ListItemButton>
              <ListItemButton component={Link} to="/hospital/admin/sub-admin" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemText primary="Sub Admin Management" />
              </ListItemButton>
              <ListItemButton component={Link} to="/hospital/admin/access-control" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemText primary="Access Control" />
              </ListItemButton>
            </List>
          </Collapse>
        </>
      )}

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
          <ListItemButton component={Link} to="/hospital/doctors/create" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Add Doctor" />
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
        </List>
      </Collapse>
    </>
  );
}