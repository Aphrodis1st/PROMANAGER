import { ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

export default function FinancialLinks() {
  return (
    <>
      <ListItemButton component={Link} to="/hospital/billing" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
        <ListItemText primary="Billing & Invoices" />
      </ListItemButton>
    </>
  );
}