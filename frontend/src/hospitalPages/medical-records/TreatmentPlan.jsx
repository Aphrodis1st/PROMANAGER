import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";
import hospitalService from "../../services/hospitalService";

export default function TreatmentPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addTreatmentPlan } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [formData, setFormData] = useState({
    // Primary Information
    diagnosis: "",
    icd10Code: "",
    treatmentGoals: "",
    expectedOutcome: "",
    estimatedDuration: "",
    
    // Treatment Details
    therapyPlan: "",
    careType: "Outpatient",
    treatmentPhase: "Initial",
    interventions: "",
    procedures: "",
    
    // Medications
    medications: "",
    pharmacologicalTherapy: "",
    
    // Lifestyle & Care
    dietaryRestrictions: "",
    nutritionPlan: "",
    activityLevel: "Moderate",
    physicalTherapy: "",
    occupationalTherapy: "",
    
    // Monitoring & Follow-up
    reviewDate: "",
    followUpSchedule: "",
    monitoringParameters: "",
    warningSignsSymptoms: "",
    emergencyProtocol: "",
    
    // Professional Details
    planCreatedBy: "",
    planDate: new Date().toISOString().split('T')[0],
    multidisciplinaryTeam: "",
    consultations: "",
    referrals: "",
    
    // Patient Education
    patientEducation: "",
    caregiverInstructions: "",
    selfManagementGoals: "",
    
    // Additional
    specialConsiderations: "",
    contraindications: "",
    riskFactors: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const patientIdFromParams = id || searchParams.get("patientId");
    console.log('📋 Treatment Plan - Patient ID:', patientIdFromParams);
    console.log('📋 Treatment Plan - Available patients:', patients.length);
    
    if (patientIdFromParams) {
      const patient = patients.find(p => p.id === patientIdFromParams);
      console.log('📋 Treatment Plan - Found patient:', patient);
      setPatientInfo(patient);
      setSelectedPatient(patient);
    }
  }, [id, searchParams, patients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      alert("Please select a patient for this treatment plan");
      return;
    }
    if (!formData.treatmentGoals || !formData.diagnosis) {
      alert("Please fill in required fields (Diagnosis and Treatment Goals)");
      return;
    }
    
    setLoading(true);
    try {
      console.log('📋 Submitting treatment plan for patient:', selectedPatient.fullName);
      
      const treatmentPlanData = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.fullName,
        patientAge: selectedPatient.age,
        patientGender: selectedPatient.gender,
        ...formData,
        doctorName: doctors.find(d => d.id === formData.planCreatedBy)?.fullName || 'Unknown',
        status: 'ACTIVE',
        recordType: 'TREATMENT_PLAN',
        createdBy: formData.planCreatedBy,
        createdAt: new Date().toISOString(),
        medicalRecordId: id
      };
      
      console.log('📋 Treatment plan data:', treatmentPlanData);
      
      const result = await hospitalService.createTreatmentPlan(treatmentPlanData);
      console.log('✅ Treatment plan created successfully:', result);
      
      alert(`Treatment plan created successfully for ${selectedPatient.fullName}!`);
      navigate('/hospital/medical-records/treatment-plan-list');
    } catch (error) {
      console.error("❌ Error adding treatment plan:", error);
      let errorMessage = "Failed to add treatment plan";
      if (error.response?.data?.message) {
        errorMessage += ": " + error.response.data.message;
      } else if (error.message) {
        errorMessage += ": " + error.message;
      }
      alert(errorMessage);
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
      <PageHeader title="Professional Treatment & Care Plan" />
      
      {/* Debug Information */}
      <Card>
        <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.375rem", fontSize: "0.875rem" }}>
          <strong>🔍 Debug Info:</strong><br/>
          Patient ID from URL: {id || searchParams.get("patientId")}<br/>
          Patients loaded: {patients.length}<br/>
          Doctors loaded: {doctors.length}<br/>
          Selected patient: {selectedPatient ? `${selectedPatient.fullName} (${selectedPatient.id})` : 'None'}
        </div>
      </Card>
      
      {/* Patient Selection */}
      {!selectedPatient && patients.length > 0 && (
        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
              👥 Select Patient for Treatment Plan
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>
              Choose the registered patient for whom you are creating this comprehensive treatment plan.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1rem" }}>
              {patients.map(patient => (
                <div 
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setPatientInfo(patient);
                  }}
                  style={{
                    padding: "1.25rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10b981";
                    e.currentTarget.style.backgroundColor = "#f0fdf4";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "50%", 
                      backgroundColor: "#10b981", 
                      color: "white", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontWeight: "600",
                      marginRight: "0.75rem"
                    }}>
                      {patient.fullName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "1rem", color: "#1f2937" }}>{patient.fullName}</div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>MRN: {patient.id}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", fontSize: "0.875rem" }}>
                    <div><strong>Age:</strong> {patient.age}</div>
                    <div><strong>Gender:</strong> {patient.gender}</div>
                    <div><strong>Blood Type:</strong> {patient.bloodType || 'Unknown'}</div>
                    <div><strong>Phone:</strong> {patient.phone}</div>
                  </div>
                  {patient.allergies && (
                    <div style={{ 
                      fontSize: "0.75rem", 
                      color: "#ef4444", 
                      marginTop: "0.5rem", 
                      padding: "0.5rem", 
                      backgroundColor: "#fef2f2", 
                      borderRadius: "0.375rem",
                      border: "1px solid #fecaca"
                    }}>
                      ⚠️ <strong>Allergies:</strong> {patient.allergies}
                    </div>
                  )}
                  <div style={{ 
                    marginTop: "0.75rem", 
                    padding: "0.5rem", 
                    backgroundColor: "#f0fdf4", 
                    borderRadius: "0.375rem", 
                    textAlign: "center", 
                    fontSize: "0.875rem", 
                    fontWeight: "500", 
                    color: "#059669" 
                  }}>
                    Click to Select
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
      
      {/* Selected Patient Display */}
      {selectedPatient && (
        <Card>
          <div style={{ padding: "1.5rem", backgroundColor: "#f0fdf4", borderLeft: "4px solid #10b981" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    borderRadius: "50%", 
                    backgroundColor: "#10b981", 
                    color: "white", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontWeight: "600",
                    fontSize: "1.25rem",
                    marginRight: "1rem"
                  }}>
                    {selectedPatient.fullName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "1.125rem", color: "#1f2937" }}>
                      📋 Treatment Plan for: {selectedPatient.fullName}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      MRN: {selectedPatient.id} | Age: {selectedPatient.age} | Gender: {selectedPatient.gender}
                    </div>
                  </div>
                </div>
                {selectedPatient.allergies && (
                  <div style={{ 
                    fontSize: "0.875rem", 
                    color: "#ef4444", 
                    padding: "0.5rem", 
                    backgroundColor: "#fef2f2", 
                    borderRadius: "0.375rem", 
                    border: "1px solid #fecaca",
                    marginTop: "0.5rem"
                  }}>
                    ⚠️ <strong>ALLERGIES:</strong> {selectedPatient.allergies}
                  </div>
                )}
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => {
                  setSelectedPatient(null);
                  setPatientInfo(null);
                }}
              >
                Change Patient
              </Button>
            </div>
          </div>
        </Card>
      )}

      {selectedPatient && (
        <Card>
          <div style={{ padding: "1.5rem" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "1.5rem", marginRight: "1rem" }}>📋</div>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, color: "#1f2937" }}>Professional Treatment Plan</h2>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>Comprehensive care plan for {selectedPatient.fullName}</p>
                </div>
              </div>

              {/* Diagnosis & Overview */}
              <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #10b981", color: "#1f2937" }}>🎯 Diagnosis & Treatment Overview</h3>
            
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Primary Diagnosis *</label>
                  <input
                    style={inputStyle}
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    placeholder="Primary diagnosis"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>ICD-10 Code</label>
                  <input
                    style={inputStyle}
                    value={formData.icd10Code}
                    onChange={(e) => setFormData({ ...formData, icd10Code: e.target.value })}
                    placeholder="e.g., E11.9"
                  />
                </div>
              </div>

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
                    <option value="Palliative">Palliative Care</option>
                    <option value="Long-term Care">Long-term Care</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Treatment Phase</label>
                  <select
                    style={inputStyle}
                    value={formData.treatmentPhase}
                    onChange={(e) => setFormData({ ...formData, treatmentPhase: e.target.value })}
                  >
                    <option value="Initial">Initial Assessment</option>
                    <option value="Active">Active Treatment</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Recovery">Recovery</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Estimated Duration</label>
                  <input
                    style={inputStyle}
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    placeholder="e.g., 6 weeks, 3 months"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Treatment Goals *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={formData.treatmentGoals}
                  onChange={(e) => setFormData({ ...formData, treatmentGoals: e.target.value })}
                  placeholder="Primary and secondary treatment objectives, measurable outcomes..."
                  required
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Expected Outcome</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.expectedOutcome}
                  onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
                  placeholder="Expected clinical outcomes, prognosis, quality of life improvements..."
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
      )}
    </>
  );
}
