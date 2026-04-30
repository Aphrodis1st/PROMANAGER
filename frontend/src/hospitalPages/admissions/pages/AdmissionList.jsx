import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import { useAdmissions } from "../../../hooks/useAdmissions";

export default function AdmissionList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  
  // Add error boundary
  const [error, setError] = useState(null);
  
  let admissions = [];
  let loading = false;
  let fetchAdmissions = () => {};
  
  try {
    const admissionContext = useAdmissions();
    admissions = admissionContext.admissions || [];
    loading = admissionContext.loading;
    fetchAdmissions = admissionContext.fetchAdmissions;
  } catch (err) {
    console.error('Error using admissions context:', err);
    setError(err.message);
  }

  useEffect(() => {
    console.log('AdmissionList mounted, fetching admissions...');
    if (fetchAdmissions) {
      fetchAdmissions();
    }
  }, []);

  useEffect(() => {
    console.log('Admissions updated:', admissions);
  }, [admissions]);
  
  if (error) {
    return (
      <>
        <PageHeader title="Hospital Admissions" />
        <Card>
          <div style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>
            <h3>Error Loading Admissions</h3>
            <p>{error}</p>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "1rem" }}>
              The AdmissionProvider context is not available. Please check App.jsx configuration.
            </p>
          </div>
        </Card>
      </>
    );
  }

  const filteredAdmissions = admissions.filter(admission => {
    if (filter === 'all') return true;
    return admission.status === filter;
  });

  console.log('Rendering AdmissionList, filtered admissions:', filteredAdmissions);

  const columns = [
    { key: "patientName", label: "Patient Name" },
    { key: "admissionType", label: "Type" },
    { key: "ward", label: "Ward" },
    { key: "bed", label: "Bed" },
    { 
      key: "admitDate", 
      label: "Admitted On",
      render: (row) => row.admitDate ? new Date(row.admitDate).toLocaleDateString() : 'N/A'
    },
    { 
      key: "status", 
      label: "Status",
      render: (row) => (
        <span style={{
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: row.status === 'Active' ? '#dcfce7' : '#fee2e2',
          color: row.status === 'Active' ? '#166534' : '#991b1b'
        }}>
          {row.status}
        </span>
      )
    },
  ];

  return (
    <>
      <PageHeader title="Hospital Admissions" />
      <Card>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button 
              onClick={() => setFilter('all')}
              style={{
                backgroundColor: filter === 'all' ? '#2563eb' : '#e5e7eb',
                color: filter === 'all' ? 'white' : '#374151'
              }}
            >
              All ({admissions?.length || 0})
            </Button>
            <Button 
              onClick={() => setFilter('Active')}
              style={{
                backgroundColor: filter === 'Active' ? '#16a34a' : '#e5e7eb',
                color: filter === 'Active' ? 'white' : '#374151'
              }}
            >
              Active ({admissions?.filter(a => a.status === 'Active').length || 0})
            </Button>
            <Button 
              onClick={() => setFilter('Discharged')}
              style={{
                backgroundColor: filter === 'Discharged' ? '#dc2626' : '#e5e7eb',
                color: filter === 'Discharged' ? 'white' : '#374151'
              }}
            >
              Discharged ({admissions?.filter(a => a.status === 'Discharged').length || 0})
            </Button>
          </div>
          <Button onClick={() => navigate("/hospital/admissions/admit")}>
            + Admit New Patient
          </Button>
        </div>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading admissions...</p>
          </div>
        ) : !admissions || admissions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <p>No admissions found.</p>
            <Button 
              onClick={() => navigate("/hospital/admissions/admit")} 
              style={{ marginTop: "1rem" }}
            >
              Admit First Patient
            </Button>
          </div>
        ) : filteredAdmissions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <p>No {filter.toLowerCase()} admissions found.</p>
          </div>
        ) : (
          <DataTable
            data={filteredAdmissions}
            columns={columns}
            onRowClick={(admission) => navigate(`/hospital/admissions/${admission.id}`)}
          />
        )}
      </Card>
    </>
  );
}