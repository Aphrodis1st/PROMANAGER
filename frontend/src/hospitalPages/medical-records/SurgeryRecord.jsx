import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";

export default function SurgeryRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addSurgeryRecord } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [formData, setFormData] = useState({
    procedureName: "",
    procedureCode: "",
    surgeon: "",
    assistant: "",
    anesthesiologist: "",
    surgeryDate: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: "",
    anesthesiaType: "General",
    preOpDiagnosis: "",
    postOpDiagnosis: "",
    operativeFindings: "",
    procedureDetails: "",
    complications: "",
    bloodLoss: "",
    postOpPlan: "",
    recoveryRoom: ""
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
    if (!formData.procedureName || !formData.surgeon || !formData.surgeryDate) {
      alert("Please fill in required fields");
      return;
    }
    
    setLoading(true);
    try {
      await addSurgeryRecord(id, formData);
      alert("Surgery record added successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error adding surgery record:", error);
      alert("Failed to add surgery record");
    } finally {
      setLoading(false);
    }
  };

  const commonProcedures = [
    { name: "Appendectomy", code: "44950" },
    { name: "Cholecystectomy", code: "47562" },
    { name: "Hernia Repair", code: "49505" },
    { name: "Cesarean Section", code: "59510" },
    { name: "Hip Replacement", code: "27130" },
    { name: "Knee Arthroscopy", code: "29881" },
    { name: "Coronary Artery Bypass", code: "33533" },
    { name: "Cataract Surgery", code: "66984" }
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
      <PageHeader title="Surgery Documentation" />
      
      {patientInfo && (
        <Card>
          <div style={{ padding: "1rem", backgroundColor: "#fef3c7", borderLeft: "4px solid #f59e0b" }}>
            <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Patient: {patientInfo.fullName}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>MRN: {patientInfo.id} | Age: {patientInfo.age} | Blood Type: {patientInfo.bloodType || "N/A"}</div>
          </div>
        </Card>
      )}

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e5e7eb" }}>Procedure Information</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Procedure Name *</label>
                <select
                  style={inputStyle}
                  value={formData.procedureName}
                  onChange={(e) => {
                    const selected = commonProcedures.find(p => p.name === e.target.value);
                    setFormData({ ...formData, procedureName: e.target.value, procedureCode: selected?.code || "" });
                  }}
                  required
                >
                  <option value="">Select Procedure</option>
                  {commonProcedures.map(p => (
                    <option key={p.code} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>CPT Code</label>
                <input
                  style={{ ...inputStyle, backgroundColor: "#f9fafb" }}
                  value={formData.procedureCode}
                  onChange={(e) => setFormData({ ...formData, procedureCode: e.target.value })}
                  placeholder="Auto-filled or enter manually"
                />
              </div>
            </div>

            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e5e7eb" }}>Surgical Team</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Lead Surgeon *</label>
                <select
                  style={inputStyle}
                  value={formData.surgeon}
                  onChange={(e) => setFormData({ ...formData, surgeon: e.target.value })}
                  required
                >
                  <option value="">Select Surgeon</option>
                  {doctors.filter(d => d.specialization?.includes("Surgeon") || d.specialization?.includes("Surgery")).map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.fullName || d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Assistant Surgeon</label>
                <select
                  style={inputStyle}
                  value={formData.assistant}
                  onChange={(e) => setFormData({ ...formData, assistant: e.target.value })}
                >
                  <option value="">Select Assistant</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.fullName || d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Anesthesiologist</label>
                <select
                  style={inputStyle}
                  value={formData.anesthesiologist}
                  onChange={(e) => setFormData({ ...formData, anesthesiologist: e.target.value })}
                >
                  <option value="">Select Anesthesiologist</option>
                  {doctors.filter(d => d.specialization?.includes("Anesthesiology")).map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.fullName || d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e5e7eb" }}>Surgery Details</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Surgery Date *</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={formData.surgeryDate}
                  onChange={(e) => setFormData({ ...formData, surgeryDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Start Time</label>
                <input
                  type="time"
                  style={inputStyle}
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>End Time</label>
                <input
                  type="time"
                  style={inputStyle}
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>Anesthesia Type *</label>
                <select
                  style={inputStyle}
                  value={formData.anesthesiaType}
                  onChange={(e) => setFormData({ ...formData, anesthesiaType: e.target.value })}
                  required
                >
                  <option value="General">General</option>
                  <option value="Local">Local</option>
                  <option value="Regional">Regional</option>
                  <option value="Spinal">Spinal</option>
                  <option value="Epidural">Epidural</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Pre-Operative Diagnosis</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.preOpDiagnosis}
                  onChange={(e) => setFormData({ ...formData, preOpDiagnosis: e.target.value })}
                  placeholder="Diagnosis before surgery..."
                />
              </div>

              <div>
                <label style={labelStyle}>Post-Operative Diagnosis</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.postOpDiagnosis}
                  onChange={(e) => setFormData({ ...formData, postOpDiagnosis: e.target.value })}
                  placeholder="Diagnosis after surgery..."
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Operative Findings</label>
              <textarea
                style={{ ...inputStyle, minHeight: "100px" }}
                value={formData.operativeFindings}
                onChange={(e) => setFormData({ ...formData, operativeFindings: e.target.value })}
                placeholder="Detailed findings during surgery..."
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Procedure Details</label>
              <textarea
                style={{ ...inputStyle, minHeight: "120px" }}
                value={formData.procedureDetails}
                onChange={(e) => setFormData({ ...formData, procedureDetails: e.target.value })}
                placeholder="Step-by-step procedure description..."
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Complications (if any)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.complications}
                  onChange={(e) => setFormData({ ...formData, complications: e.target.value })}
                  placeholder="None or describe complications..."
                />
              </div>

              <div>
                <label style={labelStyle}>Estimated Blood Loss</label>
                <input
                  style={inputStyle}
                  value={formData.bloodLoss}
                  onChange={(e) => setFormData({ ...formData, bloodLoss: e.target.value })}
                  placeholder="e.g., 200ml"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Post-Operative Plan</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={formData.postOpPlan}
                  onChange={(e) => setFormData({ ...formData, postOpPlan: e.target.value })}
                  placeholder="Recovery plan, medications, follow-up..."
                />
              </div>

              <div>
                <label style={labelStyle}>Recovery Room Assignment</label>
                <input
                  style={inputStyle}
                  value={formData.recoveryRoom}
                  onChange={(e) => setFormData({ ...formData, recoveryRoom: e.target.value })}
                  placeholder="e.g., Recovery Room 3"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Surgery Record"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  );
}
