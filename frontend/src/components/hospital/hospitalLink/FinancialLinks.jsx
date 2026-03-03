import { ListItemButton, ListItemText, Collapse, List } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function FinancialLinks() {
  const [billingOpen, setBillingOpen] = useState(false);

  return (
    <>
      {/* Billing Menu */}
      <ListItemButton 
        onClick={() => setBillingOpen(!billingOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Billing & Invoices" />
        {billingOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={billingOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/hospital/billing" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Billing Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/billing/invoices" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Invoice List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/billing/create" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Create Invoice" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/billing/payment" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Payment Processing" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/billing/insurance" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Insurance Claims" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/billing/reports" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Revenue Reports" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}