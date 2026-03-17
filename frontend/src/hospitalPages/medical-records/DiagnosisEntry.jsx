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
    diagnosisType: "",
    laterality: "",
    onset: "",
    clinicalNotes: "",
    diagnosedBy: "",
    diagnosisDate: new Date().toISOString().split('T')[0],
    symptoms: "",
    physicalFindings: "",
    diagnosticTests: "",
    differentialDiagnosis: "",
    complications: "",
    prognosis: "",
    treatmentRecommendations: "",
    followUpPlan: "",
    patientEducation: ""
  });
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    console.log('DiagnosisEntry - Record ID:', id);
    console.log('DiagnosisEntry - Patient ID from URL:', patientId);
    console.log('DiagnosisEntry - Available patients:', patients.length);
    
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      console.log('DiagnosisEntry - Found patient:', patient);
      setPatientInfo(patient);
    }
  }, [searchParams, patients, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.code || !formData.description) {
      alert("Please fill in required fields: ICD Code and Description");
      return;
    }
    
    if (!formData.diagnosedBy) {
      alert("Please select the diagnosing doctor");
      return;
    }
    
    setLoading(true);
    try {
      console.log('Submitting diagnosis for record ID:', id);
      console.log('Diagnosis data:', formData);
      
      await addDiagnosis(id, formData);
      alert("Diagnosis added successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error adding diagnosis:", error);
      
      // More specific error messages
      let errorMessage = "Failed to add diagnosis";
      if (error.message.includes('not found')) {
        errorMessage = "Medical record not found. Please try refreshing the page.";
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.response?.data?.message) {
        errorMessage = `Error: ${error.response.data.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const icdCodes = [
    { code: "I10", desc: "Essential (primary) hypertension", category: "Cardiovascular" },
    { code: "E11", desc: "Type 2 diabetes mellitus", category: "Endocrine" },
    { code: "J44", desc: "Chronic obstructive pulmonary disease", category: "Respiratory" },
    { code: "I25", desc: "Chronic ischemic heart disease", category: "Cardiovascular" },
    { code: "M79.3", desc: "Panniculitis, unspecified", category: "Musculoskeletal" },
    { code: "J18.9", desc: "Pneumonia, unspecified organism", category: "Respiratory" },
    { code: "K21.9", desc: "Gastro-esophageal reflux disease", category: "Digestive" },
    { code: "M54.5", desc: "Low back pain", category: "Musculoskeletal" },
    { code: "F41.1", desc: "Generalized anxiety disorder", category: "Mental Health" },
    { code: "N18.9", desc: "Chronic kidney disease, unspecified", category: "Renal" },
    { code: "I50.9", desc: "Heart failure, unspecified", category: "Cardiovascular" },
    { code: "J45.9", desc: "Asthma, unspecified", category: "Respiratory" },
    { code: "E78.5", desc: "Hyperlipidemia, unspecified", category: "Endocrine" },
    { code: "F32.9", desc: "Major depressive disorder, single episode", category: "Mental Health" },
    { code: "M81.0", desc: "Age-related osteoporosis", category: "Musculoskeletal" },
    { code: "N39.0", desc: "Urinary tract infection", category: "Renal" },
    { code: "K29.7", desc: "Gastritis, unspecified", category: "Digestive" },
    { code: "I63.9", desc: "Cerebral infarction, unspecified", category: "Neurological" },
    { code: "C50.9", desc: "Malignant neoplasm of breast", category: "Oncology" },
    { code: "G43.9", desc: "Migraine, unspecified", category: "Neurological" }
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

  return (
    <>
      <PageHeader title="Add Diagnosis (ICD-10 Based)" />
      
      {/* Debug Information */}
      <Card>
        <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.375rem", fontSize: "0.875rem" }}>
          <strong>Debug Info:</strong><br/>
          Record ID: {id}<br/>
          Patient ID from URL: {searchParams.get("patientId")}<br/>
          Patients loaded: {patients.length}<br/>
          Doctors loaded: {doctors.length}<br/>
          Patient found: {patientInfo ? 'Yes' : 'No'}
        </div>
      </Card>
      
      {patientInfo && (
        <Card>
          <div style={{ padding: "1rem", backgroundColor: "#f0f9ff", borderLeft: "4px solid #3b82f6" }}>
            <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Patient: {patientInfo.fullName}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>MRN: {patientInfo.id} | Age: {patientInfo.age} | Gender: {patientInfo.gender}</div>
          </div>
        </Card>
      )}

      <Card>
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            {/* DIAGNOSIS IDENTIFICATION */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Diagnosis Identification</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
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
                <div>
                  <label style={labelStyle}>Diagnosed By *</label>
                  <select
                    style={inputStyle}
                    value={formData.diagnosedBy}
                    onChange={(e) => setFormData({ ...formData, diagnosedBy: e.target.value })}
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
                <label style={labelStyle}>Diagnosis Description *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed diagnosis description..."
                  required
                />
              </div>
            </div>

            {/* DIAGNOSIS CLASSIFICATION */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Diagnosis Classification</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
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
                    <option value="Recurrent">Recurrent</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Diagnosis Type</label>
                  <select
                    style={inputStyle}
                    value={formData.diagnosisType}
                    onChange={(e) => setFormData({ ...formData, diagnosisType: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Comorbidity">Comorbidity</option>
                    <option value="Complication">Complication</option>
                    <option value="Provisional">Provisional</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Laterality</label>
                  <select
                    style={inputStyle}
                    value={formData.laterality}
                    onChange={(e) => setFormData({ ...formData, laterality: e.target.value })}
                  >
                    <option value="">Not Applicable</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                    <option value="Bilateral">Bilateral</option>
                    <option value="Unspecified">Unspecified</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: "1.5rem" }}>
                <label style={labelStyle}>Onset</label>
                <select
                  style={inputStyle}
                  value={formData.onset}
                  onChange={(e) => setFormData({ ...formData, onset: e.target.value })}
                >
                  <option value="">Select Onset</option>
                  <option value="Acute">Acute (sudden onset)</option>
                  <option value="Subacute">Subacute (gradual onset)</option>
                  <option value="Chronic">Chronic (long-term)</option>
                  <option value="Congenital">Congenital (present at birth)</option>
                  <option value="Acquired">Acquired</option>
                </select>
              </div>
            </div>

            {/* CLINICAL PRESENTATION */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Clinical Presentation</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Presenting Symptoms</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="List all presenting symptoms, their duration, frequency, and characteristics..."
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Physical Examination Findings</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={formData.physicalFindings}
                  onChange={(e) => setFormData({ ...formData, physicalFindings: e.target.value })}
                  placeholder="Relevant physical examination findings supporting the diagnosis..."
                />
              </div>
              <div>
                <label style={labelStyle}>Diagnostic Tests & Results</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={formData.diagnosticTests}
                  onChange={(e) => setFormData({ ...formData, diagnosticTests: e.target.value })}
                  placeholder="Laboratory tests, imaging studies, biopsies, and their results..."
                />
              </div>
            </div>

            {/* DIFFERENTIAL DIAGNOSIS */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Differential Diagnosis & Assessment</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Differential Diagnosis</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={formData.differentialDiagnosis}
                  onChange={(e) => setFormData({ ...formData, differentialDiagnosis: e.target.value })}
                  placeholder="Other conditions considered and ruled out..."
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Potential Complications</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: "100px" }}
                    value={formData.complications}
                    onChange={(e) => setFormData({ ...formData, complications: e.target.value })}
                    placeholder="Possible complications to monitor..."
                  />
                </div>
                <div>
                  <label style={labelStyle}>Prognosis</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: "100px" }}
                    value={formData.prognosis}
                    onChange={(e) => setFormData({ ...formData, prognosis: e.target.value })}
                    placeholder="Expected outcome and recovery timeline..."
                  />
                </div>
              </div>
            </div>

            {/* TREATMENT & MANAGEMENT */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Treatment & Management Plan</h3>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Treatment Recommendations</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "120px" }}
                  value={formData.treatmentRecommendations}
                  onChange={(e) => setFormData({ ...formData, treatmentRecommendations: e.target.value })}
                  placeholder="Medications, therapies, procedures, lifestyle modifications..."
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Follow-up Plan</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={formData.followUpPlan}
                  onChange={(e) => setFormData({ ...formData, followUpPlan: e.target.value })}
                  placeholder="Follow-up schedule, monitoring requirements, referrals..."
                />
              </div>
              <div>
                <label style={labelStyle}>Patient Education</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={formData.patientEducation}
                  onChange={(e) => setFormData({ ...formData, patientEducation: e.target.value })}
                  placeholder="Information provided to patient about condition, warning signs, self-care..."
                />
              </div>
            </div>

            {/* CLINICAL NOTES */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={sectionTitleStyle}>Additional Clinical Notes</h3>
              <div>
                <label style={labelStyle}>Clinical Notes</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "120px" }}
                  value={formData.clinicalNotes}
                  onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                  placeholder="Additional clinical observations, patient concerns, special considerations..."
                />
              </div>
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
