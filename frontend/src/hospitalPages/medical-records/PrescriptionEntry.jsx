import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";

export default function PrescriptionEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addPrescription } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [prescriptions, setPrescriptions] = useState([{
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    route: "Oral",
    instructions: ""
  }]);
  const [formData, setFormData] = useState({
    prescribedBy: "",
    prescriptionDate: new Date().toISOString().split('T')[0],
    pharmacyNotes: ""
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

  const addMedication = () => {
    setPrescriptions([...prescriptions, {
      medicationName: "",
      dosage: "",
      frequency: "",
      duration: "",
      route: "Oral",
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
    const hasEmpty = prescriptions.some(p => !p.medicationName || !p.dosage || !p.frequency || !p.duration);
    if (hasEmpty) {
      alert("Please fill in all required medication fields");
      return;
    }
    
    setLoading(true);
    try {
      await addPrescription(id, { ...formData, medications: prescriptions });
      alert("Prescription added successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error adding prescription:", error);
      alert("Failed to add prescription");
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
      
      {patientInfo && (
        <Card>
          <div style={{ padding: "1rem", backgroundColor: "#f0fdf4", borderLeft: "4px solid #10b981" }}>
            <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Patient: {patientInfo.fullName}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>MRN: {patientInfo.id} | Age: {patientInfo.age} | Allergies: {patientInfo.allergies || "None"}</div>
          </div>
        </Card>
      )}

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Prescribed By *</label>
                <select
                  style={inputStyle}
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.fullName || d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Prescription Date *</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={formData.prescriptionDate}
                  onChange={(e) => setFormData({ ...formData, prescriptionDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600" }}>Medications</h3>
                <Button type="button" size="sm" onClick={addMedication}>+ Add Medication</Button>
              </div>

              {prescriptions.map((med, index) => (
                <div key={index} style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", marginBottom: "1rem", backgroundColor: "#f9fafb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ fontWeight: "600", fontSize: "0.875rem" }}>Medication #{index + 1}</span>
                    {prescriptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        style={{ color: "#ef4444", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Medication Name *</label>
                      <input
                        list={`medications-${index}`}
                        style={inputStyle}
                        value={med.medicationName}
                        onChange={(e) => updateMedication(index, "medicationName", e.target.value)}
                        placeholder="Enter or select medication"
                        required
                      />
                      <datalist id={`medications-${index}`}>
                        {commonMedications.map(m => <option key={m} value={m} />)}
                      </datalist>
                    </div>

                    <div>
                      <label style={labelStyle}>Dosage *</label>
                      <input
                        style={inputStyle}
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                        placeholder="e.g., 500mg"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Frequency *</label>
                      <select
                        style={inputStyle}
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="Four times daily">Four times daily</option>
                        <option value="Every 4 hours">Every 4 hours</option>
                        <option value="Every 6 hours">Every 6 hours</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Duration *</label>
                      <input
                        style={inputStyle}
                        value={med.duration}
                        onChange={(e) => updateMedication(index, "duration", e.target.value)}
                        placeholder="e.g., 7 days"
                        required
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Route *</label>
                      <select
                        style={inputStyle}
                        value={med.route}
                        onChange={(e) => updateMedication(index, "route", e.target.value)}
                        required
                      >
                        <option value="Oral">Oral</option>
                        <option value="IV">IV</option>
                        <option value="IM">IM</option>
                        <option value="Topical">Topical</option>
                        <option value="Sublingual">Sublingual</option>
                        <option value="Rectal">Rectal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Special Instructions</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: "60px" }}
                      value={med.instructions}
                      onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                      placeholder="Take with food, avoid alcohol, etc."
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Pharmacy Notes</label>
              <textarea
                style={{ ...inputStyle, minHeight: "80px" }}
                value={formData.pharmacyNotes}
                onChange={(e) => setFormData({ ...formData, pharmacyNotes: e.target.value })}
                placeholder="Additional notes for pharmacist..."
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Prescription"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  );
}
