import { ListItemButton, ListItemText, Collapse, List } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function ReportLinks() {
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <>
      {/* Reports Menu */}
      <ListItemButton 
        onClick={() => setReportsOpen(!reportsOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Hospital Reports" />
        {reportsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/hospital/reports" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Report Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/reports/patient" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Patient Reports" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/reports/medical-records" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Medical Record Reports" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/reports/financial" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Financial Reports" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/reports/department" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Department Reports" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/reports/lab" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Lab Reports" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/reports/audit" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Audit Logs" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}