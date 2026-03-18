import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useAdmissions } from "../../../hooks/useAdmissions";

export default function AdmissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admission, fetchAdmissionById, loading } = useAdmissions();
  const [showDischargeModal, setShowDischargeModal] = useState(false);

  useEffect(() => {
    if (id) fetchAdmissionById(id);
  }, [id]);

  if (loading) {
    return (
      <>
        <PageHeader title="Admission Details" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading admission details...</p>
          </div>
        </Card>
      </>
    );
  }

  if (!admission) {
    return (
      <>
        <PageHeader title="Admission Details" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Admission not found</p>
            <Button onClick={() => navigate('/hospital/admissions')} style={{ marginTop: '1rem' }}>
              Back to Admissions
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Admission Details" />
      <Card>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ 
            display: "inline-block",
            padding: '6px 16px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor: admission.status === 'Active' ? '#dcfce7' : '#fee2e2',
            color: admission.status === 'Active' ? '#166534' : '#991b1b'
          }}>
            {admission.status}
          </div>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div style={{ padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "0.25rem" }}>Patient Name</p>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>{admission.patientName || 'N/A'}</p>
          </div>
          
          <div style={{ padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "0.25rem" }}>Admission Type</p>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>{admission.admissionType || 'N/A'}</p>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "0.25rem" }}>Ward</p>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>{admission.ward || 'N/A'}</p>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "0.25rem" }}>Bed Number</p>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>{admission.bed || 'N/A'}</p>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "0.25rem" }}>Admission Date</p>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>
              {admission.admitDate ? new Date(admission.admitDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          {admission.dischargeDate && (
            <div style={{ padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "0.25rem" }}>Discharge Date</p>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>
                {new Date(admission.dischargeDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {admission.reason && (
          <div style={{ 
            padding: "1rem", 
            backgroundColor: "#f0f9ff", 
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #bae6fd"
          }}>
            <p style={{ fontSize: "12px", color: "#0369a1", marginBottom: "0.5rem", fontWeight: "600" }}>Reason for Admission</p>
            <p style={{ fontSize: "14px", color: "#1e3a8a" }}>{admission.reason}</p>
          </div>
        )}

        {admission.dischargeNotes && (
          <div style={{ 
            padding: "1rem", 
            backgroundColor: "#fef3c7", 
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #fde68a"
          }}>
            <p style={{ fontSize: "12px", color: "#92400e", marginBottom: "0.5rem", fontWeight: "600" }}>Discharge Notes</p>
            <p style={{ fontSize: "14px", color: "#78350f" }}>{admission.dischargeNotes}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button onClick={() => navigate('/hospital/admissions')}>
            ← Back to List
          </Button>
          
          {admission.status === 'Active' && (
            <>
              <Button 
                onClick={() => navigate(`/hospital/admissions/${id}/discharge`)}
                style={{ backgroundColor: '#dc2626' }}
              >
                Discharge Patient
              </Button>
              <Button 
                onClick={() => navigate(`/hospital/admissions/${id}/transfer`)}
                style={{ backgroundColor: '#f59e0b' }}
              >
                Transfer Patient
              </Button>
            </>
          )}
        </div>
      </Card>
    </>
  );
}
