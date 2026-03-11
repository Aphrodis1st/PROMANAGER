import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";

export default function TreatmentPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addTreatmentPlan } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [formData, setFormData] = useState({
    treatmentGoals: "",
    therapyPlan: "",
    careType: "Outpatient",
    reviewDate: "",
    planCreatedBy: "",
    planDate: new Date().toISOString().split('T')[0],
    medications: "",
    dietaryRestrictions: "",
    activityLevel: "Moderate",
    followUpInstructions: "",
    specialConsiderations: "",
    notes: ""
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
    if (!formData.treatmentGoals) {
      alert("Please fill in treatment goals");
      return;
    }
    
    setLoading(true);
    try {
      await addTreatmentPlan(id, formData);
      alert("Treatment plan added successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error adding treatment plan:", error);
      alert("Failed to add treatment plan");
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
      <PageHeader title="Treatment & Care Plan" />
      
      {patientInfo && (
        <Card>
          <div style={{ padding: "1rem", backgroundColor: "#f0fdf4", borderLeft: "4px solid #10b981" }}>
            <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Patient: {patientInfo.fullName}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>MRN: {patientInfo.id} | Age: {patientInfo.age} | Condition: {patientInfo.condition || "N/A"}</div>
          </div>
        </Card>
      )}

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e5e7eb" }}>Plan Overview</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Care Type *</label>
                <select
                  style={inputStyle}
                  value={formData.careType}
                  onChange={(e) => setFormData({ ...formData, careType: e.target.value })}
                  required
                >
                  <option value="Inpatient">Inpatient</option>
                  <option value="Outpatient">Outpatient</option>
                  <option value="Rehabilitation">Rehabilitation</option>
                  <option value="Home Care">Home Care</option>
                  <option value="Palliative">Palliative</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Plan Created By</label>
                <select
                  style={inputStyle}
                  value={formData.planCreatedBy}
                  onChange={(e) => setFormData({ ...formData, planCreatedBy: e.target.value })}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.fullName || d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Plan Date *</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={formData.planDate}
                  onChange={(e) => setFormData({ ...formData, planDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Treatment Goals *</label>
              <textarea
                style={{ ...inputStyle, minHeight: "100px" }}
                value={formData.treatmentGoals}
                onChange={(e) => setFormData({ ...formData, treatmentGoals: e.target.value })}
                placeholder="Primary and secondary treatment objectives..."
                required
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Therapy / Procedure Plan</label>
              <textarea
                style={{ ...inputStyle, minHeight: "100px" }}
                value={formData.therapyPlan}
                onChange={(e) => setFormData({ ...formData, therapyPlan: e.target.value })}
                placeholder="Detailed therapy schedule, procedures, interventions..."
              />
            </div>

            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e5e7eb" }}>Care Instructions</h3>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Medications & Dosages</label>
              <textarea
                style={{ ...inputStyle, minHeight: "80px" }}
                value={formData.medications}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                placeholder="List all prescribed medications with dosages and schedules..."
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Dietary Restrictions</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                  placeholder="Special diet requirements, restrictions..."
                />
              </div>

              <div>
                <label style={labelStyle}>Activity Level</label>
                <select
                  style={{ ...inputStyle, marginBottom: "0.5rem" }}
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                >
                  <option value="Bed Rest">Bed Rest</option>
                  <option value="Limited">Limited Activity</option>
                  <option value="Moderate">Moderate Activity</option>
                  <option value="Normal">Normal Activity</option>
                  <option value="Active">Active/Exercise</option>
                </select>
                <textarea
                  style={{ ...inputStyle, minHeight: "60px" }}
                  value={formData.specialConsiderations}
                  onChange={(e) => setFormData({ ...formData, specialConsiderations: e.target.value })}
                  placeholder="Activity restrictions or recommendations..."
                />
              </div>
            </div>

            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e5e7eb" }}>Follow-Up & Monitoring</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Next Review Date</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={formData.reviewDate}
                  onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>Follow-Up Instructions</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.followUpInstructions}
                  onChange={(e) => setFormData({ ...formData, followUpInstructions: e.target.value })}
                  placeholder="When to return, warning signs to watch for..."
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Additional Notes</label>
              <textarea
                style={{ ...inputStyle, minHeight: "100px" }}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any other relevant information, patient education, caregiver instructions..."
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Treatment Plan"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  );
}
