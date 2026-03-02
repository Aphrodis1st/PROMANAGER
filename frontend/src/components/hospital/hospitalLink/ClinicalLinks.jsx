import { ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

export default function ClinicalLinks() {
  return (
    <>
      <ListItemButton component={Link} to="/hospital/patients" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
        <ListItemText primary="Patients" />
      </ListItemButton>

      <ListItemButton component={Link} to="/hospital/appointments" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
        <ListItemText primary="Appointments" />
      </ListItemButton>

      <ListItemButton component={Link} to="/hospital/medical-records" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
        <ListItemText primary="Medical Records" />
      </ListItemButton>

      <ListItemButton component={Link} to="/hospital/lab" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
        <ListItemText primary="Lab Tests" />
      </ListItemButton>

      <ListItemButton component={Link} to="/hospital/wards" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
        <ListItemText primary="Wards" />
      </ListItemButton>
    </>
  );
}
