import { ListItemButton, ListItemText, Collapse, List } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function ClinicalLinks() {
  const [patientsOpen, setPatientsOpen] = useState(false);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [medicalRecordsOpen, setMedicalRecordsOpen] = useState(false);
  const [admissionsOpen, setAdmissionsOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [wardsOpen, setWardsOpen] = useState(false);

  return (
    <>
      {/* Patients Menu */}
      <ListItemButton 
        onClick={() => setPatientsOpen(!patientsOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Patients" />
        {patientsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={patientsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/hospital/patients" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Patient List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/patients/create" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Register Patient" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Appointments Menu */}
      <ListItemButton 
        onClick={() => setAppointmentsOpen(!appointmentsOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Appointments" />
        {appointmentsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={appointmentsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/hospital/appointments" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Appointment List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/appointments/create" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Book Appointment" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/appointments/calendar" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Calendar View" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Medical Records Menu */}
      <ListItemButton 
        onClick={() => setMedicalRecordsOpen(!medicalRecordsOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Medical Records" />
        {medicalRecordsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={medicalRecordsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/hospital/medical-records" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Records List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/medical-records/create" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Create Record" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/medical-records/prescriptions/all" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="💊 Prescription List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/medical-records/surgery-list" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="🏥 Surgery List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/medical-records/treatment-plan-list" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="📋 Treatment Plans" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/medical-records/diagnosis/:id" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Diagnosis Entry" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/medical-records/prescription/:id" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Prescription Entry" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/medical-records/surgery/:id" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Surgery Record" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/medical-records/treatment/:id" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Treatment Plan" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Admissions Menu */}
      <ListItemButton 
        onClick={() => setAdmissionsOpen(!admissionsOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Admissions" />
        {admissionsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={admissionsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/hospital/admissions" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Admission List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/admissions/admit" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Admit Patient" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Lab Tests Menu */}
      <ListItemButton 
        onClick={() => setLabOpen(!labOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Lab Tests" />
        {labOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={labOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/hospital/lab" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Lab Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/lab/tests" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Test List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/lab/create" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Create Test" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/lab/pending" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Pending Tests" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Wards Menu */}
      <ListItemButton 
        onClick={() => setWardsOpen(!wardsOpen)}
        sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ListItemText primary="Wards" />
        {wardsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={wardsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/hospital/wards" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Ward List" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/wards/availability" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Bed Availability" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/wards/allocation" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="Bed Allocation" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hospital/wards/icu" sx={{ pl: 4, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ListItemText primary="ICU Management" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
