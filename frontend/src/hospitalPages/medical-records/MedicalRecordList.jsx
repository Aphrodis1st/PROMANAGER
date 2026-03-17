import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { usePatients } from "../../hooks/usePatients";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { useDoctors } from "../../hooks/useDoctors";

export default function MedicalRecordList() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { records, fetchRecords, deleteRecord } = useMedicalRecords();
  const { doctors } = useDoctors();
  const [allRecords, setAllRecords] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const refreshRecords = async () => {
    setLoading(true);
    console.log('Refreshing records for patients:', patients);
    
    try {
      const combined = [];
      
      // Fetch records for each patient and collect them directly
      for (const patient of patients) {
        try {
          console.log(`Fetching records for patient: ${patient.fullName} (${patient.id})`);
          const patientRecords = await fetchRecords(patient.id);
          
          console.log(`Received ${patientRecords.length} records for ${patient.fullName}`);
          
          // Add patient info to each record
          const recordsWithPatientInfo = patientRecords.map(r => ({
            ...r,
            patientName: patient.fullName,
            patientId: patient.id
          }));
          
          combined.push(...recordsWithPatientInfo);
        } catch (error) {
          console.error(`Error fetching records for patient ${patient.fullName}:`, error);
        }
      }
      
      // Remove duplicates
      const uniqueRecords = combined.filter((record, index, self) => 
        index === self.findIndex(r => r.id === record.id)
      );
      
      console.log('Combined unique records:', uniqueRecords);
      setAllRecords(uniqueRecords);
    } catch (error) {
      console.error('Error refreshing records:', error);
      setAllRecords([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (patients.length > 0) {
      refreshRecords();
    }
  }, [patients]);

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.fullName || doctor.name}` : "N/A";
  };

  const handleDeleteRecord = async (record) => {
    setDeleting(true);
    try {
      console.log('Deleting medical record:', record.id);
      await deleteRecord(record.id);
      
      // Remove from local state
      setAllRecords(prev => prev.filter(r => r.id !== record.id));
      
      alert('Medical record deleted successfully!');
    } catch (error) {
      console.error('Error deleting medical record:', error);
      alert('Failed to delete medical record. Please try again.');
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const confirmDelete = (record) => {
    setDeleteConfirm(record);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const filteredRecords = allRecords.filter(r => {
    const matchesSearch = r.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.recordNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = [
    { label: "Total Records", value: allRecords.length, color: "#3b82f6" },
    { label: "Active Patients", value: patients.length, color: "#10b981" },
    { label: "This Month", value: allRecords.filter(r => new Date(r.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length, color: "#f59e0b" },
    { label: "Doctors", value: doctors.length, color: "#8b5cf6" }
  ];

  return (
    <>
      <PageHeader
        title="Electronic Medical Records"
        action={
          <Button onClick={() => navigate("create")}>
            + Create Medical Record
          </Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {stats.map((stat, i) => (
          <Card key={i}>
            <div style={{ padding: "1rem" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>{stat.label}</div>
              <div style={{ fontSize: "1.875rem", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Medical Records</h3>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search by patient or record number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                  width: "300px"
                }}
              />
              <Button 
                variant="secondary" 
                onClick={refreshRecords}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Debug Info */}
          <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.375rem", fontSize: "0.875rem" }}>
            <strong>Debug Info:</strong><br/>
            Patients: {patients.length} | Records in Context: {records.length} | All Records: {allRecords.length}<br/>
            Patient IDs: {patients.map(p => p.id).join(', ')}<br/>
            Record Patient IDs: {allRecords.map(r => r.patientId).join(', ')}
          </div>

          {filteredRecords.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
              <p style={{ marginBottom: "1rem" }}>No medical records found. Create one to get started.</p>
              <Button onClick={() => navigate("create")}>Create First Record</Button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Record #</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Patient Name</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Primary Doctor</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Created Date</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Last Updated</th>
                    <th style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "1rem", fontWeight: "500", color: "#3b82f6" }}>{record.recordNumber}</td>
                      <td style={{ padding: "1rem" }}>{record.patientName}</td>
                      <td style={{ padding: "1rem" }}>{getDoctorName(record.doctorId)}</td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                        {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                        {record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          <Button size="sm" onClick={() => navigate(`view/${record.id}`)}>View</Button>
                          <Button size="sm" variant="secondary" onClick={() => navigate(`diagnosis/${record.id}`)}>Add Diagnosis</Button>
                          <Button 
                            size="sm" 
                            variant="danger" 
                            onClick={() => confirmDelete(record)}
                            disabled={deleting}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#dc2626'
            }}>
              ⚠️ Confirm Delete Medical Record
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#374151' }}>
              Are you sure you want to delete the medical record for <strong>{deleteConfirm.patientName}</strong>?
            </p>
            <div style={{
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.375rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#991b1b' }}>
                <strong>Record Details:</strong>
              </p>
              <ul style={{ fontSize: '0.875rem', color: '#991b1b', marginTop: '0.5rem', paddingLeft: '1rem' }}>
                <li>• Record #: {deleteConfirm.recordNumber}</li>
                <li>• Patient: {deleteConfirm.patientName}</li>
                <li>• Created: {deleteConfirm.createdAt ? new Date(deleteConfirm.createdAt).toLocaleDateString() : 'N/A'}</li>
              </ul>
              <p style={{ fontSize: '0.875rem', color: '#991b1b', marginTop: '0.5rem' }}>
                <strong>This action cannot be undone!</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button 
                variant="secondary" 
                onClick={cancelDelete}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleDeleteRecord(deleteConfirm)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Record'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
