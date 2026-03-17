import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";
import hospitalService from "../../services/hospitalService";

export default function PrescriptionEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addPrescription } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [prescriptions, setPrescriptions] = useState([{
    medicationName: "",
    genericName: "",
    dosage: "",
    strength: "",
    frequency: "",
    duration: "",
    route: "Oral",
    quantity: "",
    refills: "0",
    instructions: ""
  }]);
  const [formData, setFormData] = useState({
    prescribedBy: "",
    prescriptionDate: new Date().toISOString().split('T')[0],
    diagnosis: "",
    icd10Code: "",
    patientWeight: "",
    patientHeight: "",
    bloodPressure: "",
    temperature: "",
    pharmacyNotes: "",
    substitutionAllowed: true,
    urgency: "Routine"
  });
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    console.log('PrescriptionEntry - Record ID:', id);
    console.log('PrescriptionEntry - Patient ID from URL:', patientId);
    console.log('PrescriptionEntry - Available patients:', patients.length);
    console.log('PrescriptionEntry - Available doctors:', doctors.length);
    
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      console.log('PrescriptionEntry - Found patient:', patient);
      setPatientInfo(patient);
    }
  }, [searchParams, patients, doctors, id]);

  const addMedication = () => {
    setPrescriptions([...prescriptions, {
      medicationName: "",
      genericName: "",
      dosage: "",
      strength: "",
      frequency: "",
      duration: "",
      route: "Oral",
      quantity: "",
      refills: "0",
      instructions: ""
    }]);
  };

  const removeMedication = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updateMedication = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasEmpty = prescriptions.some(p => !p.medicationName || !p.dosage || !p.frequency || !p.duration || !p.quantity);
    if (hasEmpty) {
      alert("Please fill in all required medication fields");
      return;
    }
    if (!formData.diagnosis) {
      alert("Please enter diagnosis");
      return;
    }
    if (!formData.prescribedBy) {
      alert("Please select the prescribing doctor");
      return;
    }
    
    setLoading(true);
    try {
      console.log('🏥 Submitting prescription for medical record:', id);
      console.log('📋 Form data:', formData);
      console.log('💊 Medications:', prescriptions);
      
      // Prepare prescription data with patient information
      const prescriptionData = {
        medicalRecordId: id,
        patientId: patientInfo?.id || searchParams.get("patientId"),
        patientName: patientInfo?.fullName || 'Unknown Patient',
        doctorId: formData.prescribedBy,
        doctorName: doctors.find(d => d.id === formData.prescribedBy)?.fullName || 'Unknown Doctor',
        prescriptionDate: formData.prescriptionDate,
        diagnosis: formData.diagnosis,
        icd10Code: formData.icd10Code,
        medications: prescriptions.map(med => ({
          ...med,
          // Ensure all required fields are present
          medicationName: med.medicationName,
          strength: med.strength,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          quantity: parseInt(med.quantity) || 0,
          route: med.route || 'Oral',
          refills: med.refills || '0',
          instructions: med.instructions || ''
        })),
        urgency: formData.urgency,
        pharmacyNotes: formData.pharmacyNotes,
        substitutionAllowed: formData.substitutionAllowed,
        patientWeight: formData.patientWeight,
        patientHeight: formData.patientHeight,
        bloodPressure: formData.bloodPressure,
        temperature: formData.temperature,
        status: 'PENDING',
        createdBy: formData.prescribedBy,
        createdAt: new Date().toISOString()
      };
      
      console.log('📦 Sending prescription data:', prescriptionData);
      
      // Use hospital service to create prescription
      const result = await hospitalService.createPrescription(prescriptionData);
      console.log('✅ Prescription created successfully:', result);
      
      alert(`Prescription created successfully for ${patientInfo?.fullName || 'patient'}!`);
      navigate(-1);
    } catch (error) {
      console.error("❌ Error adding prescription:", error);
      let errorMessage = "Failed to add prescription";
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

  const commonMedications = [
    "Amoxicillin", "Azithromycin", "Ciprofloxacin", "Metformin", "Lisinopril",
    "Amlodipine", "Atorvastatin", "Omeprazole", "Ibuprofen", "Paracetamol"
  ];

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
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
      <PageHeader title="Prescription Entry" />
      
      {/* Debug Information */}
      <Card>
        <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.375rem", fontSize: "0.875rem" }}>
          <strong>Debug Info:</strong><br/>
          Medical Record ID: {id}<br/>
          Patient ID from URL: {searchParams.get("patientId")}<br/>
          Patients loaded: {patients.length}<br/>
          Doctors loaded: {doctors.length}<br/>
          Patient found: {patientInfo ? `${patientInfo.fullName} (${patientInfo.id})` : 'No'}
        </div>
      </Card>
      
      {/* Patient Selection */}
      {!patientInfo && patients.length > 0 && (
        <Card>
          <div style={{ padding: "1rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Select Patient</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {patients.map(patient => (
                <div 
                  key={patient.id}
                  onClick={() => setPatientInfo(patient)}
                  style={{
                    padding: "1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    backgroundColor: "#ffffff"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.backgroundColor = "#f0f9ff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.backgroundColor = "#ffffff";
                  }}
                >
                  <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>{patient.fullName}</div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    MRN: {patient.id} | Age: {patient.age} | Gender: {patient.gender}
                  </div>
                  {patient.allergies && (
                    <div style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>
                      ⚠️ Allergies: {patient.allergies}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
      
      {patientInfo && (
        <Card>
          <div style={{ padding: "1rem", backgroundColor: "#f0fdf4", borderLeft: "4px solid #10b981" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Patient: {patientInfo.fullName}</div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>MRN: {patientInfo.id} | Age: {patientInfo.age} | Allergies: {patientInfo.allergies || "None"}</div>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setPatientInfo(null)}
              >
                Change Patient
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "2px solid #e5e7eb" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>Prescriber Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Prescribed By *</label>
                  <select style={inputStyle} value={formData.prescribedBy} onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })} required>
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (<option key={d.id} value={d.id}>Dr. {d.fullName || d.name}</option>))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Prescription Date *</label>
                  <input type="date" style={inputStyle} value={formData.prescriptionDate} onChange={(e) => setFormData({ ...formData, prescriptionDate: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Urgency *</label>
                  <select style={inputStyle} value={formData.urgency} onChange={(e) => setFormData({ ...formData, urgency: e.target.value })} required>
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "2px solid #e5e7eb" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>Clinical Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={labelStyle}>Diagnosis *</label>
                  <input style={inputStyle} value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} placeholder="Primary diagnosis" required />
                </div>
                <div>
                  <label style={labelStyle}>ICD-10 Code</label>
                  <input style={inputStyle} value={formData.icd10Code} onChange={(e) => setFormData({ ...formData, icd10Code: e.target.value })} placeholder="e.g., J06.9" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Weight (kg)</label>
                  <input type="number" step="0.1" style={inputStyle} value={formData.patientWeight} onChange={(e) => setFormData({ ...formData, patientWeight: e.target.value })} placeholder="70" />
                </div>
                <div>
                  <label style={labelStyle}>Height (cm)</label>
                  <input type="number" style={inputStyle} value={formData.patientHeight} onChange={(e) => setFormData({ ...formData, patientHeight: e.target.value })} placeholder="170" />
                </div>
                <div>
                  <label style={labelStyle}>Blood Pressure</label>
                  <input style={inputStyle} value={formData.bloodPressure} onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })} placeholder="120/80" />
                </div>
                <div>
                  <label style={labelStyle}>Temperature (°C)</label>
                  <input type="number" step="0.1" style={inputStyle} value={formData.temperature} onChange={(e) => setFormData({ ...formData, temperature: e.target.value })} placeholder="37.0" />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937" }}>Medications</h3>
                <Button type="button" size="sm" onClick={addMedication}>+ Add Medication</Button>
              </div>

              {prescriptions.map((med, index) => (
                <div key={index} style={{ padding: "1.25rem", border: "2px solid #d1d5db", borderRadius: "0.5rem", marginBottom: "1rem", backgroundColor: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ fontWeight: "600", fontSize: "1rem", color: "#1f2937" }}>Medication #{index + 1}</span>
                    {prescriptions.length > 1 && (
                      <button type="button" onClick={() => removeMedication(index)} style={{ color: "#ef4444", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer", fontWeight: "500" }}>✕ Remove</button>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Brand/Trade Name *</label>
                      <input list={`medications-${index}`} style={inputStyle} value={med.medicationName} onChange={(e) => updateMedication(index, "medicationName", e.target.value)} placeholder="e.g., Augmentin" required />
                      <datalist id={`medications-${index}`}>
                        {commonMedications.map(m => <option key={m} value={m} />)}
                      </datalist>
                    </div>
                    <div>
                      <label style={labelStyle}>Generic Name</label>
                      <input style={inputStyle} value={med.genericName} onChange={(e) => updateMedication(index, "genericName", e.target.value)} placeholder="e.g., Amoxicillin-Clavulanate" />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Strength *</label>
                      <input style={inputStyle} value={med.strength} onChange={(e) => updateMedication(index, "strength", e.target.value)} placeholder="500mg" required />
                    </div>
                    <div>
                      <label style={labelStyle}>Dosage *</label>
                      <input style={inputStyle} value={med.dosage} onChange={(e) => updateMedication(index, "dosage", e.target.value)} placeholder="1 tablet" required />
                    </div>
                    <div>
                      <label style={labelStyle}>Route *</label>
                      <select style={inputStyle} value={med.route} onChange={(e) => updateMedication(index, "route", e.target.value)} required>
                        <option value="Oral">Oral</option>
                        <option value="IV">Intravenous (IV)</option>
                        <option value="IM">Intramuscular (IM)</option>
                        <option value="SC">Subcutaneous (SC)</option>
                        <option value="Topical">Topical</option>
                        <option value="Sublingual">Sublingual</option>
                        <option value="Inhalation">Inhalation</option>
                        <option value="Rectal">Rectal</option>
                        <option value="Ophthalmic">Ophthalmic</option>
                        <option value="Otic">Otic</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Frequency *</label>
                      <select style={inputStyle} value={med.frequency} onChange={(e) => updateMedication(index, "frequency", e.target.value)} required>
                        <option value="">Select</option>
                        <option value="QD">Once daily (QD)</option>
                        <option value="BID">Twice daily (BID)</option>
                        <option value="TID">Three times daily (TID)</option>
                        <option value="QID">Four times daily (QID)</option>
                        <option value="Q4H">Every 4 hours (Q4H)</option>
                        <option value="Q6H">Every 6 hours (Q6H)</option>
                        <option value="Q8H">Every 8 hours (Q8H)</option>
                        <option value="Q12H">Every 12 hours (Q12H)</option>
                        <option value="PRN">As needed (PRN)</option>
                        <option value="STAT">Immediately (STAT)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Duration *</label>
                      <input style={inputStyle} value={med.duration} onChange={(e) => updateMedication(index, "duration", e.target.value)} placeholder="7 days" required />
                    </div>
                    <div>
                      <label style={labelStyle}>Quantity *</label>
                      <input type="number" style={inputStyle} value={med.quantity} onChange={(e) => updateMedication(index, "quantity", e.target.value)} placeholder="30" required />
                    </div>
                    <div>
                      <label style={labelStyle}>Refills</label>
                      <select style={inputStyle} value={med.refills} onChange={(e) => updateMedication(index, "refills", e.target.value)}>
                        <option value="0">No refills</option>
                        <option value="1">1 refill</option>
                        <option value="2">2 refills</option>
                        <option value="3">3 refills</option>
                        <option value="4">4 refills</option>
                        <option value="5">5 refills</option>
                        <option value="PRN">PRN (as needed)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Special Instructions</label>
                    <textarea style={{ ...inputStyle, minHeight: "70px" }} value={med.instructions} onChange={(e) => updateMedication(index, "instructions", e.target.value)} placeholder="Take with food, avoid alcohol, take at bedtime, etc." />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "1.5rem", paddingTop: "1.5rem", borderTop: "2px solid #e5e7eb" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>Additional Information</h3>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ ...labelStyle, display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.substitutionAllowed} onChange={(e) => setFormData({ ...formData, substitutionAllowed: e.target.checked })} style={{ marginRight: "0.5rem" }} />
                  Generic substitution allowed
                </label>
              </div>
              <div>
                <label style={labelStyle}>Pharmacy Notes</label>
                <textarea style={{ ...inputStyle, minHeight: "80px" }} value={formData.pharmacyNotes} onChange={(e) => setFormData({ ...formData, pharmacyNotes: e.target.value })} placeholder="Additional notes for pharmacist..." />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Prescription"}
              </Button>
            </div>
            
            {/* Debug Panel */}
            <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "0.5rem", border: "1px solid #e9ecef" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#495057" }}>🔍 Debug Info</h4>
              <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                <p><strong>Medical Record ID:</strong> {id}</p>
                <p><strong>Patient Info:</strong> {patientInfo ? `${patientInfo.fullName} (${patientInfo.id})` : 'Not loaded'}</p>
                <p><strong>Medications Count:</strong> {prescriptions.length}</p>
                <p><strong>API Endpoint:</strong> /api/v1/hospital/prescriptions</p>
                <p><strong>Data Flow:</strong> PrescriptionEntry → MedicalRecordContext.addPrescription → hospitalService.createPrescription → Backend</p>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </>
  );
}
