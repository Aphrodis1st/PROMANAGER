import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";
import hospitalService from "../../services/hospitalService";

export default function SurgeryRecord() {
  const { patientId } = useParams();
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
    recoveryRoom: "",
    // Professional Hospital Fields
    hospitalName: "E-Hospital System",
    hospitalLicense: "HL-2024-001",
    accreditation: "JCI",
    surgicalSuite: "",
    equipmentUsed: "",
    nursingStaff: "",
    technicalStaff: "",
    qualityAssurance: "WHO Surgical Safety Checklist completed",
    infectionControl: "Standard sterile technique, prophylactic antibiotics administered",
    professionalNotes: "",
    // Additional professional fields
    surgicalApproach: "",
    implantDetails: "",
    pathologySpecimens: "",
    imagingUsed: "",
    monitoringDevices: "",
    patientPosition: "",
    skinPreparation: "",
    drapingTechnique: ""
  });
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const patientIdFromParams = patientId || searchParams.get("patientId");
    console.log('🏥 Surgery Record - Patient ID:', patientIdFromParams);
    console.log('🏥 Surgery Record - Available patients:', patients.length);
    console.log('🏥 Surgery Record - Available doctors:', doctors.length);
    
    if (patientIdFromParams) {
      const patient = patients.find(p => p.id === patientIdFromParams);
      console.log('🏥 Surgery Record - Found patient:', patient);
      setPatientInfo(patient);
      setSelectedPatient(patient);
    }
  }, [patientId, searchParams, patients, doctors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedPatient) {
      alert("Please select a patient for this surgery record");
      return;
    }
    if (!formData.procedureName || !formData.surgeon || !formData.surgeryDate) {
      alert("Please fill in required fields (Procedure Name, Surgeon, Surgery Date)");
      return;
    }
    
    setLoading(true);
    try {
      console.log('🏥 Submitting surgery record for patient:', selectedPatient.fullName);
      
      // Prepare surgery record data
      const surgeryData = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.fullName,
        patientAge: selectedPatient.age,
        patientGender: selectedPatient.gender,
        patientBloodType: selectedPatient.bloodType,
        patientAllergies: selectedPatient.allergies,
        ...formData,
        // Add surgeon and staff names
        surgeonName: doctors.find(d => d.id === formData.surgeon)?.fullName || 'Unknown',
        assistantName: formData.assistant ? doctors.find(d => d.id === formData.assistant)?.fullName || 'Unknown' : '',
        anesthesiologistName: formData.anesthesiologist ? doctors.find(d => d.id === formData.anesthesiologist)?.fullName || 'Unknown' : '',
        // Professional metadata
        recordType: 'SURGERY',
        status: 'COMPLETED',
        createdBy: formData.surgeon,
        createdAt: new Date().toISOString(),
        hospitalId: 'HOSP001',
        medicalRecordNumber: selectedPatient.id
      };
      
      console.log('📋 Surgery data to submit:', surgeryData);
      
      // Use hospital service to create surgery record
      const result = await hospitalService.createSurgeryRecord(surgeryData);
      console.log('✅ Surgery record created successfully:', result);
      
      alert(`Surgery record created successfully for ${selectedPatient.fullName}!`);
      navigate('/hospital/medical-records/surgery-list');
    } catch (error) {
      console.error("❌ Error adding surgery record:", error);
      let errorMessage = "Failed to add surgery record";
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
      <PageHeader title="Professional Surgery Documentation" />
      
      {/* Debug Information */}
      <Card>
        <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.375rem", fontSize: "0.875rem" }}>
          <strong>🔍 Debug Info:</strong><br/>
          Patient ID from URL: {patientId || searchParams.get("patientId")}<br/>
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
              👥 Select Patient for Surgery
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>
              Choose the registered patient who will undergo the surgical procedure. All surgery documentation will be linked to this patient's medical record.
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
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.backgroundColor = "#f0f9ff";
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
                      backgroundColor: "#3b82f6", 
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
                    backgroundColor: "#f0f9ff", 
                    borderRadius: "0.375rem", 
                    textAlign: "center", 
                    fontSize: "0.875rem", 
                    fontWeight: "500", 
                    color: "#1d4ed8" 
                  }}>
                    Click to Select for Surgery
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
                      🏥 Surgery Patient: {selectedPatient.fullName}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      MRN: {selectedPatient.id} | Age: {selectedPatient.age} | Gender: {selectedPatient.gender} | Blood Type: {selectedPatient.bloodType || "Unknown"}
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
                    ⚠️ <strong>CRITICAL ALLERGIES:</strong> {selectedPatient.allergies}
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
                <div style={{ fontSize: "1.5rem", marginRight: "1rem" }}>🏥</div>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, color: "#1f2937" }}>Professional Surgery Documentation</h2>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>Complete surgical record for {selectedPatient.fullName}</p>
                </div>
              </div>
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

            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e5e7eb" }}>Professional Hospital Information</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Hospital Name *</label>
                <input
                  style={inputStyle}
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  placeholder="Enter hospital name"
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Hospital License Number</label>
                <input
                  style={inputStyle}
                  value={formData.hospitalLicense}
                  onChange={(e) => setFormData({ ...formData, hospitalLicense: e.target.value })}
                  placeholder="Hospital license/registration number"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Accreditation Status</label>
                <select
                  style={inputStyle}
                  value={formData.accreditation}
                  onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                >
                  <option value="">Select Accreditation</option>
                  <option value="JCI">Joint Commission International (JCI)</option>
                  <option value="NABH">National Accreditation Board for Hospitals (NABH)</option>
                  <option value="ISO">ISO 9001:2015</option>
                  <option value="AAAHC">Accreditation Association for Ambulatory Health Care</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Surgical Suite/OR Number</label>
                <input
                  style={inputStyle}
                  value={formData.surgicalSuite}
                  onChange={(e) => setFormData({ ...formData, surgicalSuite: e.target.value })}
                  placeholder="e.g., OR-3, Suite A"
                />
              </div>
            </div>

            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e5e7eb" }}>Professional Staff & Equipment</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Nursing Staff Present</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.nursingStaff}
                  onChange={(e) => setFormData({ ...formData, nursingStaff: e.target.value })}
                  placeholder="List nursing staff involved (names, roles)..."
                />
              </div>

              <div>
                <label style={labelStyle}>Technical Staff</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "80px" }}
                  value={formData.technicalStaff}
                  onChange={(e) => setFormData({ ...formData, technicalStaff: e.target.value })}
                  placeholder="Technicians, perfusionists, etc..."
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Equipment & Technology Used</label>
              <textarea
                style={{ ...inputStyle, minHeight: "100px" }}
                value={formData.equipmentUsed}
                onChange={(e) => setFormData({ ...formData, equipmentUsed: e.target.value })}
                placeholder="List surgical equipment, monitors, specialized technology used..."
              />
            </div>

            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e5e7eb" }}>Quality & Safety Protocols</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Quality Assurance Measures</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={formData.qualityAssurance}
                  onChange={(e) => setFormData({ ...formData, qualityAssurance: e.target.value })}
                  placeholder="Safety checklists, verification protocols, quality measures taken..."
                />
              </div>

              <div>
                <label style={labelStyle}>Infection Control Protocols</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "100px" }}
                  value={formData.infectionControl}
                  onChange={(e) => setFormData({ ...formData, infectionControl: e.target.value })}
                  placeholder="Sterilization procedures, infection prevention measures..."
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Professional Notes & Observations</label>
              <textarea
                style={{ ...inputStyle, minHeight: "120px" }}
                value={formData.professionalNotes}
                onChange={(e) => setFormData({ ...formData, professionalNotes: e.target.value })}
                placeholder="Additional professional observations, recommendations, or notes for hospital administration..."
              />
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
      )}
    </>
  );
}
