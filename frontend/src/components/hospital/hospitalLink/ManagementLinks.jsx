import { ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

export default function ManagementLinks() {
  return (
    <>
      <ListItemButton component={Link} to="/hospital/doctors" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
        <ListItemText primary="Doctors" />
      </ListItemButton>

      <ListItemButton component={Link} to="/hospital/departments" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
        <ListItemText primary="Departments" />
      </ListItemButton>
    </>
  );
}