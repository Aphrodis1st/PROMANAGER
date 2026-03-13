import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import DataTable from "../../../components/hospital/DataTable";
import { usePatients } from "../../../hooks/usePatients";
import { useAppointments } from "../../../hooks/useAppointments";
import { useMedicalRecords } from "../../../hooks/useMedicalRecords";

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { records, fetchRecords } = useMedicalRecords();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const found = patients?.find(p => p.id === id);
    setPatient(found);
    if (found) {
      fetchRecords(id);
    }
  }, [id, patients]);

  const patientAppointments = appointments?.filter(a => a.patientId === id) || [];
  const patientRecords = records || [];

  // Mock vital signs and lab results for demonstration
  const mockVitalSigns = [
    {
      id: 'vital-1',
      date: new Date().toISOString().split('T')[0],
      type: 'Vital Signs',
      details: 'BP: 120/80, HR: 72, Temp: 98.6°F',
      recordedBy: 'Nurse Johnson'
    },
    {
      id: 'vital-2',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      type: 'Vital Signs',
      details: 'BP: 125/82, HR: 78, Temp: 99.1°F',
      recordedBy: 'Dr. Smith'
    }
  ];

  const mockLabResults = [
    {
      id: 'lab-1',
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      type: 'Lab Results',
      details: 'Complete Blood Count - Normal',
      recordedBy: 'Lab Tech'
    },
    {
      id: 'lab-2',
      date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
      type: 'Lab Results',
      details: 'Lipid Panel - Cholesterol slightly elevated',
      recordedBy: 'Lab Tech'
    }
  ];

  // Combine all history items
  const allHistory = [
    ...patientAppointments.map(apt => ({
      id: `apt-${apt.id}`,
      date: apt.date || new Date().toISOString().split('T')[0],
      type: "Appointment",
      details: `${apt.reason || 'Regular checkup'} - ${apt.status || 'Scheduled'}`,
      recordedBy: apt.doctorName || 'Dr. TBD',
      status: apt.status || 'Scheduled'
    })),
    ...patientRecords.map(rec => ({
      id: `rec-${rec.id}`,
      date: rec.lastVisit || rec.createdAt || new Date().toISOString().split('T')[0],
      type: "Medical Record",
      details: `Record #${rec.recordNumber || rec.id} - ${rec.diagnosis || 'General consultation'}`,
      recordedBy: rec.primaryDoctor || 'Dr. TBD',
      status: 'Completed'
    })),
    ...mockVitalSigns,
    ...mockLabResults
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getFilteredHistory = () => {
    if (activeTab === 'all') return allHistory;
    return allHistory.filter(item => {
      switch (activeTab) {
        case 'appointments': return item.type === 'Appointment';
        case 'records': return item.type === 'Medical Record';
        case 'vitals': return item.type === 'Vital Signs';
        case 'labs': return item.type === 'Lab Results';
        default: return true;
      }
    });
  };

  const columns = [
    { 
      key: "date", 
      label: "Date",
      render: (row) => (
        <div style={{ fontWeight: "600" }}>
          {new Date(row.date).toLocaleDateString()}
        </div>
      )
    },
    { 
      key: "type", 
      label: "Type",
      render: (row) => {
        const variant = {
          'Appointment': 'info',
          'Medical Record': 'success',
          'Vital Signs': 'warning',
          'Lab Results': 'secondary'
        }[row.type] || 'info';
        return <Badge variant={variant}>{row.type}</Badge>;
      }
    },
    { 
      key: "details", 
      label: "Details",
      render: (row) => (
        <div style={{ maxWidth: "300px" }}>
          {row.details}
        </div>
      )
    },
    { 
      key: "recordedBy", 
      label: "Recorded By",
      render: (row) => (
        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          {row.recordedBy}
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button size="sm" variant="secondary">
          View Details
        </Button>
      )
    }
  ];

  const tabStyle = (isActive) => ({
    padding: "0.75rem 1.5rem",
    border: "none",
    backgroundColor: isActive ? "#3b82f6" : "transparent",
    color: isActive ? "white" : "#6b7280",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: isActive ? "600" : "400",
    fontSize: "0.875rem"
  });

  if (!patient) {
    return (
      <>
        <PageHeader title="Patient History" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Patient not found</p>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title={`Medical History - ${patient.fullName}`}
        subtitle={`Patient ID: ${patient.patientId || patient.id} • Complete medical timeline`}
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button onClick={() => navigate(`/hospital/patients/${id}/vital-signs`)}>
              Record Vitals
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/hospital/patients/${id}`)}>
              Back to Patient
            </Button>
          </div>
        }
      />

      {/* Patient Summary */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", padding: "1rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6" }}>
              {allHistory.filter(h => h.type === 'Appointment').length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Appointments</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#10b981" }}>
              {allHistory.filter(h => h.type === 'Medical Record').length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Medical Records</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#f59e0b" }}>
              {allHistory.filter(h => h.type === 'Vital Signs').length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Vital Signs Records</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#8b5cf6" }}>
              {allHistory.filter(h => h.type === 'Lab Results').length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Lab Results</div>
          </div>
        </div>
      </Card>

      {/* History Tabs and Table */}
      <Card>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <button 
              style={tabStyle(activeTab === 'all')} 
              onClick={() => setActiveTab('all')}
            >
              All History ({allHistory.length})
            </button>
            <button 
              style={tabStyle(activeTab === 'appointments')} 
              onClick={() => setActiveTab('appointments')}
            >
              Appointments ({allHistory.filter(h => h.type === 'Appointment').length})
            </button>
            <button 
              style={tabStyle(activeTab === 'records')} 
              onClick={() => setActiveTab('records')}
            >
              Medical Records ({allHistory.filter(h => h.type === 'Medical Record').length})
            </button>
            <button 
              style={tabStyle(activeTab === 'vitals')} 
              onClick={() => setActiveTab('vitals')}
            >
              Vital Signs ({allHistory.filter(h => h.type === 'Vital Signs').length})
            </button>
            <button 
              style={tabStyle(activeTab === 'labs')} 
              onClick={() => setActiveTab('labs')}
            >
              Lab Results ({allHistory.filter(h => h.type === 'Lab Results').length})
            </button>
          </div>

          {getFilteredHistory().length > 0 ? (
            <DataTable 
              columns={columns} 
              data={getFilteredHistory()} 
              searchable
              sortable
              pagination
              pageSize={10} 
            />
          ) : (
            <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                No {activeTab === 'all' ? 'history' : activeTab} found
              </h3>
              <p style={{ fontSize: "0.875rem" }}>
                {activeTab === 'all' 
                  ? 'This patient has no recorded medical history yet.' 
                  : `No ${activeTab} records found for this patient.`
                }
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}