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
    visitDate: new Date().toISOString().split('T')[0],
    visitType: "",
    chiefComplaint: "",
    presentIllness: "",
    duration: "",
    severity: "",
    medicalHistory: "",
    surgicalHistory: "",
    familyHistory: "",
    socialHistory: "",
    allergies: "",
    currentMedications: "",
    vitalSigns: {
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      weight: "",
      height: "",
      bmi: ""
    },
    physicalExamination: "",
    reviewOfSystems: "",
    diagnosis: "",
    differentialDiagnosis: "",
    treatmentPlan: "",
    labTests: "",
    imagingStudies: "",
    prescriptions: "",
    followUpInstructions: "",
    notes: ""
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
    fontSize: "0.875rem",
    color: "#374151"
  };

  const sectionStyle = {
    marginBottom: "2rem",
    paddingBottom: "1.5rem",
    borderBottom: "2px solid #e5e7eb"
  };

  const sectionTitleStyle = {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "2px solid #3b82f6"
  };

  const updateVitalSign = (field, value) => {
    setFormData(prev => ({
      ...prev,
      vitalSigns: { ...prev.vitalSigns, [field]: value }
    }));
  };

  return (
    <>
      <PageHeader title="Create New Medical Record" />
      
      <Card>
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            {/* PATIENT & VISIT INFORMATION */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Patient & Visit Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Patient *</label>
                  <select style={inputStyle} value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} required>
                    <option value="">Select Patient</option>
                    {patients.map(p => (<option key={p.id} value={p.id}>{p.fullName}</option>))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Primary Doctor *</label>
                  <select style={inputStyle} value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })} required>
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (<option key={d.id} value={d.id}>Dr. {d.fullName || d.name}</option>))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Record Number *</label>
                  <input type="text" style={{ ...inputStyle, backgroundColor: "#f9fafb" }} value={formData.recordNumber} readOnly />
                </div>
                <div>
                  <label style={labelStyle}>Visit Date *</label>
                  <input type="date" style={inputStyle} value={formData.visitDate} onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Visit Type *</label>
                  <select style={inputStyle} value={formData.visitType} onChange={(e) => setFormData({ ...formData, visitType: e.target.value })} required>
                    <option value="">Select Type</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Outpatient">Outpatient</option>
                    <option value="Inpatient">Inpatient</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CHIEF COMPLAINT & HISTORY */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Chief Complaint & History</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Chief Complaint *</label>
                <textarea style={{ ...inputStyle, minHeight: "80px" }} value={formData.chiefComplaint} onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })} placeholder="Primary reason for visit..." required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Duration of Symptoms</label>
                  <input type="text" style={inputStyle} value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 3 days, 2 weeks" />
                </div>
                <div>
                  <label style={labelStyle}>Severity</label>
                  <select style={inputStyle} value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })}>
                    <option value="">Select Severity</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>History of Present Illness</label>
                <textarea style={{ ...inputStyle, minHeight: "120px" }} value={formData.presentIllness} onChange={(e) => setFormData({ ...formData, presentIllness: e.target.value })} placeholder="Detailed description: onset, location, duration, character, aggravating/relieving factors, timing, severity..." />
              </div>
            </div>

            {/* MEDICAL HISTORY */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Medical History</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Past Medical History</label>
                  <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.medicalHistory} onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })} placeholder="Chronic conditions, previous diagnoses..." />
                </div>
                <div>
                  <label style={labelStyle}>Surgical History</label>
                  <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.surgicalHistory} onChange={(e) => setFormData({ ...formData, surgicalHistory: e.target.value })} placeholder="Previous surgeries and dates..." />
                </div>
                <div>
                  <label style={labelStyle}>Family History</label>
                  <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.familyHistory} onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })} placeholder="Hereditary conditions, family diseases..." />
                </div>
                <div>
                  <label style={labelStyle}>Social History</label>
                  <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.socialHistory} onChange={(e) => setFormData({ ...formData, socialHistory: e.target.value })} placeholder="Smoking, alcohol, occupation, living situation..." />
                </div>
              </div>
            </div>

            {/* ALLERGIES & MEDICATIONS */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Allergies & Current Medications</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Known Allergies</label>
                  <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.allergies} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} placeholder="Drug allergies, food allergies, environmental allergies with reactions..." />
                </div>
                <div>
                  <label style={labelStyle}>Current Medications</label>
                  <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.currentMedications} onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })} placeholder="Medication name, dosage, frequency, route..." />
                </div>
              </div>
            </div>

            {/* VITAL SIGNS */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Vital Signs</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Temperature (°F/°C)</label>
                  <input type="text" style={inputStyle} value={formData.vitalSigns.temperature} onChange={(e) => updateVitalSign('temperature', e.target.value)} placeholder="98.6°F" />
                </div>
                <div>
                  <label style={labelStyle}>Blood Pressure (mmHg)</label>
                  <input type="text" style={inputStyle} value={formData.vitalSigns.bloodPressure} onChange={(e) => updateVitalSign('bloodPressure', e.target.value)} placeholder="120/80" />
                </div>
                <div>
                  <label style={labelStyle}>Heart Rate (bpm)</label>
                  <input type="text" style={inputStyle} value={formData.vitalSigns.heartRate} onChange={(e) => updateVitalSign('heartRate', e.target.value)} placeholder="72" />
                </div>
                <div>
                  <label style={labelStyle}>Respiratory Rate (bpm)</label>
                  <input type="text" style={inputStyle} value={formData.vitalSigns.respiratoryRate} onChange={(e) => updateVitalSign('respiratoryRate', e.target.value)} placeholder="16" />
                </div>
                <div>
                  <label style={labelStyle}>O₂ Saturation (%)</label>
                  <input type="text" style={inputStyle} value={formData.vitalSigns.oxygenSaturation} onChange={(e) => updateVitalSign('oxygenSaturation', e.target.value)} placeholder="98" />
                </div>
                <div>
                  <label style={labelStyle}>Weight (kg/lbs)</label>
                  <input type="text" style={inputStyle} value={formData.vitalSigns.weight} onChange={(e) => updateVitalSign('weight', e.target.value)} placeholder="70 kg" />
                </div>
                <div>
                  <label style={labelStyle}>Height (cm/ft)</label>
                  <input type="text" style={inputStyle} value={formData.vitalSigns.height} onChange={(e) => updateVitalSign('height', e.target.value)} placeholder="170 cm" />
                </div>
                <div>
                  <label style={labelStyle}>BMI</label>
                  <input type="text" style={inputStyle} value={formData.vitalSigns.bmi} onChange={(e) => updateVitalSign('bmi', e.target.value)} placeholder="24.2" />
                </div>
              </div>
            </div>

            {/* PHYSICAL EXAMINATION */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Physical Examination & Review of Systems</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Physical Examination Findings</label>
                <textarea style={{ ...inputStyle, minHeight: "120px" }} value={formData.physicalExamination} onChange={(e) => setFormData({ ...formData, physicalExamination: e.target.value })} placeholder="General appearance, HEENT, cardiovascular, respiratory, abdominal, neurological, musculoskeletal, skin..." />
              </div>
              <div>
                <label style={labelStyle}>Review of Systems</label>
                <textarea style={{ ...inputStyle, minHeight: "120px" }} value={formData.reviewOfSystems} onChange={(e) => setFormData({ ...formData, reviewOfSystems: e.target.value })} placeholder="Constitutional, cardiovascular, respiratory, GI, GU, musculoskeletal, neurological, psychiatric, endocrine, hematologic..." />
              </div>
            </div>

            {/* ASSESSMENT & DIAGNOSIS */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Assessment & Diagnosis</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Primary Diagnosis</label>
                <textarea style={{ ...inputStyle, minHeight: "80px" }} value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} placeholder="Primary diagnosis with ICD codes if available..." />
              </div>
              <div>
                <label style={labelStyle}>Differential Diagnosis</label>
                <textarea style={{ ...inputStyle, minHeight: "80px" }} value={formData.differentialDiagnosis} onChange={(e) => setFormData({ ...formData, differentialDiagnosis: e.target.value })} placeholder="Alternative diagnoses to consider..." />
              </div>
            </div>

            {/* DIAGNOSTIC TESTS */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Diagnostic Tests & Studies</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Laboratory Tests Ordered</label>
                  <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.labTests} onChange={(e) => setFormData({ ...formData, labTests: e.target.value })} placeholder="CBC, CMP, urinalysis, cultures, etc..." />
                </div>
                <div>
                  <label style={labelStyle}>Imaging Studies Ordered</label>
                  <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.imagingStudies} onChange={(e) => setFormData({ ...formData, imagingStudies: e.target.value })} placeholder="X-ray, CT, MRI, ultrasound, etc..." />
                </div>
              </div>
            </div>

            {/* TREATMENT PLAN */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Treatment Plan</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Treatment Plan</label>
                <textarea style={{ ...inputStyle, minHeight: "120px" }} value={formData.treatmentPlan} onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })} placeholder="Therapeutic interventions, procedures, referrals..." />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Prescriptions</label>
                <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.prescriptions} onChange={(e) => setFormData({ ...formData, prescriptions: e.target.value })} placeholder="Medication name, dosage, frequency, duration, quantity..." />
              </div>
              <div>
                <label style={labelStyle}>Follow-up Instructions</label>
                <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.followUpInstructions} onChange={(e) => setFormData({ ...formData, followUpInstructions: e.target.value })} placeholder="Return visit schedule, warning signs, patient education..." />
              </div>
            </div>

            {/* ADDITIONAL NOTES */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={sectionTitleStyle}>Additional Notes</h3>
              <div>
                <label style={labelStyle}>Clinical Notes</label>
                <textarea style={{ ...inputStyle, minHeight: "100px" }} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Any additional observations, concerns, or documentation..." />
              </div>
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
