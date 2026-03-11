import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";

export default function CreateMedicalRecord() {
  const { createRecord } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    recordNumber: "",
    chiefComplaint: "",
    presentIllness: "",
    medicalHistory: "",
    allergies: "",
    currentMedications: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    if (patientId) setFormData(prev => ({ ...prev, patientId }));
    
    const recordNum = `MR${Date.now().toString().slice(-8)}`;
    setFormData(prev => ({ ...prev, recordNumber: recordNum }));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId) {
      alert("Please select patient and doctor");
      return;
    }
    
    setLoading(true);
    try {
      await createRecord(formData);
      alert("Medical record created successfully!");
      navigate("/hospital/medical-records");
    } catch (error) {
      console.error("Error creating medical record:", error);
      alert("Failed to create medical record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.625rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.375rem",
    fontSize: "0.875rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    fontSize: "0.875rem"
  };

  return (
    <>
      <PageHeader title="Create New Medical Record" />
      
      <Card>
        <div style={{ padding: "1.5rem" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Patient *</label>
                <select
                  style={inputStyle}
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Primary Doctor *</label>
                <select
                  style={inputStyle}
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.fullName || d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Record Number *</label>
              <input
                type="text"
                style={{ ...inputStyle, backgroundColor: "#f9fafb" }}
                value={formData.recordNumber}
                readOnly
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Chief Complaint</label>
              <textarea
                style={{ ...inputStyle, minHeight: "80px" }}
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                placeholder="Primary reason for visit..."
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>History of Present Illness</label>
              <textarea
                style={{ ...inputStyle, minHeight: "100px" }}
                value={formData.presentIllness}
                onChange={(e) => setFormData({ ...formData, presentIllness: e.target.value })}
                placeholder="Detailed description of current condition..."
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Medical History</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  placeholder="Past medical conditions..."
                />
              </div>

              <div>
                <label style={labelStyle}>Known Allergies</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="Drug allergies, food allergies..."
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Current Medications</label>
              <textarea
                style={{ ...inputStyle, minHeight: "80px" }}
                value={formData.currentMedications}
                onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                placeholder="List current medications and dosages..."
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
              <Button type="button" variant="secondary" onClick={() => navigate("/hospital/medical-records")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Medical Record"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  );
}
