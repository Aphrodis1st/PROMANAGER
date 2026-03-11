import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";

export default function DiagnosisEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addDiagnosis } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    severity: "Moderate",
    status: "Active",
    clinicalNotes: "",
    diagnosedBy: "",
    diagnosisDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      setPatientInfo(patient);
    }
  }, [searchParams, patients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.description) {
      alert("Please fill in required fields");
      return;
    }
    
    setLoading(true);
    try {
      await addDiagnosis(id, formData);
      alert("Diagnosis added successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error adding diagnosis:", error);
      alert("Failed to add diagnosis");
    } finally {
      setLoading(false);
    }
  };

  const icdCodes = [
    { code: "I10", desc: "Essential (primary) hypertension" },
    { code: "E11", desc: "Type 2 diabetes mellitus" },
    { code: "J44", desc: "Chronic obstructive pulmonary disease" },
    { code: "I25", desc: "Chronic ischemic heart disease" },
    { code: "M79.3", desc: "Panniculitis, unspecified" },
    { code: "J18.9", desc: "Pneumonia, unspecified organism" },
    { code: "K21.9", desc: "Gastro-esophageal reflux disease" },
    { code: "M54.5", desc: "Low back pain" },
    { code: "F41.1", desc: "Generalized anxiety disorder" },
    { code: "N18.9", desc: "Chronic kidney disease, unspecified" }
  ];

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
      <PageHeader title="Add Diagnosis (ICD-10 Based)" />
      
      {patientInfo && (
        <Card>
          <div style={{ padding: "1rem", backgroundColor: "#f0f9ff", borderLeft: "4px solid #3b82f6" }}>
            <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Patient: {patientInfo.fullName}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>MRN: {patientInfo.id} | Age: {patientInfo.age} | Gender: {patientInfo.gender}</div>
          </div>
        </Card>
      )}

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>ICD-10 Code *</label>
                <select
                  style={inputStyle}
                  value={formData.code}
                  onChange={(e) => {
                    const selected = icdCodes.find(c => c.code === e.target.value);
                    setFormData({ ...formData, code: e.target.value, description: selected?.desc || "" });
                  }}
                  required
                >
                  <option value="">Select ICD-10 Code</option>
                  {icdCodes.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.desc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Diagnosis Date *</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={formData.diagnosisDate}
                  onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Diagnosis Description *</label>
              <textarea
                style={{ ...inputStyle, minHeight: "80px" }}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed diagnosis description..."
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Severity *</label>
                <select
                  style={inputStyle}
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  required
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Status *</label>
                <select
                  style={inputStyle}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Chronic">Chronic</option>
                  <option value="Resolved">Resolved</option>
                  <option value="In Remission">In Remission</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Diagnosed By</label>
                <select
                  style={inputStyle}
                  value={formData.diagnosedBy}
                  onChange={(e) => setFormData({ ...formData, diagnosedBy: e.target.value })}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.fullName || d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Clinical Notes</label>
              <textarea
                style={{ ...inputStyle, minHeight: "120px" }}
                value={formData.clinicalNotes}
                onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                placeholder="Additional clinical observations, patient symptoms, examination findings..."
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Add Diagnosis"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  );
}
