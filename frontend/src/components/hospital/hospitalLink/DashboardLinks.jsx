import { ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

export default function DashboardLinks() {
  return (
    <>
      <ListItemButton component={Link} to="/hospital/dashboard" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
        <ListItemText primary="Dashboard Overview" />
      </ListItemButton>
    </>
  );
}