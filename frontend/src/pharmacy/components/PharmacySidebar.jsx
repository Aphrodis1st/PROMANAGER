import React, { useState } from 'react';
import { ListItemButton, ListItemText, Collapse, List } from '@mui/material';
import { Link } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function PharmacySidebar() {
  const [doctorsOpen, setDoctorsOpen] = useState(false);
  const [prescriptionsOpen, setPrescriptionsOpen] = useState(false);
  const [quotesOpen, setQuotesOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);

  return (
    <>
      {/* Pharmacy Dashboard */}
      <ListItemButton 
        component={Link} 
        to="/pharmacy/dashboard" 
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Pharmacy Dashboard" />
      </ListItemButton>

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
          <ListItemButton component={Link} to="/pharmacy/doctors" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Pharmacies" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Prescriptions Menu */}
      <ListItemButton 
        onClick={() => setPrescriptionsOpen(!prescriptionsOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Prescriptions" />
        {prescriptionsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={prescriptionsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/pharmacy/prescriptions" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Prescription List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/pharmacy/prescriptions/create" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Create Prescription" />
          </ListItemButton>
          <ListItemButton component={Link} to="/pharmacy/prescriptions/verify" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Verify Prescription" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Quotes Menu */}
      <ListItemButton 
        onClick={() => setQuotesOpen(!quotesOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Quotes" />
        {quotesOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={quotesOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/pharmacy/quotes" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Quote List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/pharmacy/quotes/create" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Create Quote" />
          </ListItemButton>
          <ListItemButton component={Link} to="/pharmacy/quotes/pending" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Pending Quotes" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Orders Menu */}
      <ListItemButton 
        onClick={() => setOrdersOpen(!ordersOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Orders" />
        {ordersOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={ordersOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/pharmacy/orders" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Order List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/pharmacy/orders/create" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Create Order" />
          </ListItemButton>
          <ListItemButton component={Link} to="/pharmacy/orders/tracking" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Order Tracking" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Branding Menu */}
      <ListItemButton 
        onClick={() => setBrandingOpen(!brandingOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Branding" />
        {brandingOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={brandingOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/pharmacy/branding" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Brand Management" />
          </ListItemButton>
          <ListItemButton component={Link} to="/pharmacy/branding/campaigns" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Marketing Campaigns" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Payments Menu */}
      <ListItemButton 
        onClick={() => setPaymentsOpen(!paymentsOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Payments" />
        {paymentsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={paymentsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/pharmacy/payments" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Payment List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/pharmacy/payments/process" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Process Payment" />
          </ListItemButton>
          <ListItemButton component={Link} to="/pharmacy/payments/reports" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Payment Reports" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Call Center */}
      <ListItemButton 
        component={Link} 
        to="/pharmacy/callcenter" 
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Call Center" />
      </ListItemButton>
    </>
  );
}