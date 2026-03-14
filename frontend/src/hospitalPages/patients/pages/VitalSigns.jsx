import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { usePatients } from "../../../hooks/usePatients";

export default function VitalSigns() {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const { patients } = usePatients();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [newVitals, setNewVitals] = useState({
    temperature: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: "",
    height: "",
    bmi: "",
    painLevel: "",
    notes: ""
  });

  useEffect(() => {
    const foundPatient = patients.find(p => p.id === patientId);
    setPatient(foundPatient);
    loadVitalSigns();
  }, [patientId, patients]);

  const loadVitalSigns = () => {
    // Mock vital signs data - in real app, this would come from API
    const mockVitals = [
      {
        id: "vital-1",
        date: new Date().toISOString(),
        temperature: "98.6",
        bloodPressure: "120/80",
        heartRate: "72",
        respiratoryRate: "16",
        oxygenSaturation: "98",
        weight: "70",
        height: "175",
        bmi: "22.9",
        painLevel: "2",
        recordedBy: "Dr. Smith",
        notes: "Patient stable, normal vitals"
      },
      {
        id: "vital-2", 
        date: new Date(Date.now() - 86400000).toISOString(),
        temperature: "99.1",
        bloodPressure: "125/82",
        heartRate: "78",
        respiratoryRate: "18",
        oxygenSaturation: "97",
        weight: "70.5",
        height: "175",
        bmi: "23.0",
        painLevel: "3",
        recordedBy: "Nurse Johnson",
        notes: "Slight fever, monitoring"
      }
    ];
    setVitalSigns(mockVitals);
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return "";
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const handleVitalChange = (field, value) => {
    setNewVitals(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate BMI when weight or height changes
      if (field === "weight" || field === "height") {
        updated.bmi = calculateBMI(updated.weight, updated.height);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const vitalRecord = {
        id: `vital-${Date.now()}`,
        patientId: patientId,
        date: new Date().toISOString(),
        temperature: newVitals.temperature,
        bloodPressure: `${newVitals.bloodPressureSystolic}/${newVitals.bloodPressureDiastolic}`,
        heartRate: newVitals.heartRate,
        respiratoryRate: newVitals.respiratoryRate,
        oxygenSaturation: newVitals.oxygenSaturation,
        weight: newVitals.weight,
        height: newVitals.height,
        bmi: newVitals.bmi,
        painLevel: newVitals.painLevel,
        recordedBy: "Current User", // In real app, get from auth
        notes: newVitals.notes
      };
      
      console.log('Recording vital signs for patient:', patientId, vitalRecord);
      
      // Add to existing vitals
      setVitalSigns(prev => [vitalRecord, ...prev]);
      
      // In a real application, you would save this to the backend
      // For now, we'll just store it locally
      try {
        // You can add API call here when backend is ready
        // await hospitalService.createVitalSigns(vitalRecord);
        console.log('Vital signs would be saved to backend:', vitalRecord);
      } catch (apiError) {
        console.warn('API call failed, using local storage:', apiError);
      }
      
      // Reset form
      setNewVitals({
        temperature: "",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        heartRate: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        weight: "",
        height: "",
        bmi: "",
        painLevel: "",
        notes: ""
      });
      
      alert("Vital signs recorded successfully!");
    } catch (error) {
      console.error("Error recording vital signs:", error);
      alert("Failed to record vital signs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVitalStatus = (vital, type) => {
    const value = parseFloat(vital);
    if (isNaN(value)) return { status: "normal", color: "#16a34a" };
    
    switch (type) {
      case "temperature":
        if (value < 97.0 || value > 99.5) return { status: "abnormal", color: "#ef4444" };
        return { status: "normal", color: "#16a34a" };
      case "heartRate":
        if (value < 60 || value > 100) return { status: "abnormal", color: "#ef4444" };
        return { status: "normal", color: "#16a34a" };
      case "respiratoryRate":
        if (value < 12 || value > 20) return { status: "abnormal", color: "#ef4444" };
        return { status: "normal", color: "#16a34a" };
      case "oxygenSaturation":
        if (value < 95) return { status: "abnormal", color: "#ef4444" };
        return { status: "normal", color: "#16a34a" };
      default:
        return { status: "normal", color: "#16a34a" };
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

  if (!patient) {
    return (
      <>
        <PageHeader title="Vital Signs" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Patient not found</p>
            <Button onClick={() => navigate("/hospital/patients")} style={{ marginTop: "1rem" }}>
              Back to Patients
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title={`Vital Signs - ${patient.fullName}`}
        action={
          <Button variant="secondary" onClick={() => navigate(`/hospital/patients/${patientId}`)}>
            Back to Patient
          </Button>
        }
      />

      {/* Patient Info */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <div style={{ padding: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Patient</div>
              <div style={{ fontWeight: "600" }}>{patient.fullName}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Age</div>
              <div style={{ fontWeight: "600" }}>
                {patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : "N/A"} years
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Gender</div>
              <div style={{ fontWeight: "600" }}>{patient.gender}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>MRN</div>
              <div style={{ fontWeight: "600" }}>{patient.id}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Medical History & Preferences */}
      <Card style={{ marginBottom: "1.5rem", border: "2px solid #3b82f6" }}>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ 
            fontSize: "1.125rem", 
            fontWeight: "600", 
            marginBottom: "1.5rem",
            color: "#1f2937",
            backgroundColor: "#eff6ff",
            padding: "0.5rem",
            borderRadius: "0.375rem"
          }}>
            📋 Medical History & Preferences
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={labelStyle}>Known Allergies</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="List any known allergies"
                defaultValue={patient.allergies || ""}
              />
            </div>
            <div>
              <label style={labelStyle}>Current Medications</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="List current medications"
                defaultValue={patient.currentMedications || ""}
              />
            </div>
            <div>
              <label style={labelStyle}>Medical Conditions</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="List existing conditions"
                defaultValue={patient.medicalConditions || ""}
              />
            </div>
            <div>
              <label style={labelStyle}>Preferred Language</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="English, Spanish, etc."
                defaultValue={patient.preferredLanguage || ""}
              />
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Primary Care Physician</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Doctor's name"
                defaultValue={patient.primaryPhysician || ""}
              />
            </div>
            <div>
              <label style={labelStyle}>Referring Physician</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Doctor who referred patient"
                defaultValue={patient.referringPhysician || ""}
              />
            </div>
            <div>
              <label style={labelStyle}>Patient Type</label>
              <select
                style={inputStyle}
                defaultValue={patient.patientType || "Outpatient"}
              >
                <option value="Outpatient">Outpatient</option>
                <option value="Inpatient">Inpatient</option>
                <option value="Emergency">Emergency</option>
                <option value="Observation">Observation</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Admission Type</label>
              <select
                style={inputStyle}
                defaultValue={patient.admissionType || "Elective"}
              >
                <option value="Elective">Elective</option>
                <option value="Emergency">Emergency</option>
                <option value="Urgent">Urgent</option>
                <option value="Routine">Routine</option>
              </select>
            </div>
          </div>
          
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <Button variant="secondary" size="sm">
              Update Medical History
            </Button>
          </div>
        </div>
      </Card>

      {/* Record New Vitals */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1.5rem" }}>
            Record New Vital Signs
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Temperature (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newVitals.temperature}
                  onChange={(e) => handleVitalChange("temperature", e.target.value)}
                  style={inputStyle}
                  placeholder="98.6"
                />
              </div>
              
              <div>
                <label style={labelStyle}>Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={newVitals.heartRate}
                  onChange={(e) => handleVitalChange("heartRate", e.target.value)}
                  style={inputStyle}
                  placeholder="72"
                />
              </div>
              
              <div>
                <label style={labelStyle}>Respiratory Rate</label>
                <input
                  type="number"
                  value={newVitals.respiratoryRate}
                  onChange={(e) => handleVitalChange("respiratoryRate", e.target.value)}
                  style={inputStyle}
                  placeholder="16"
                />
              </div>
              
              <div>
                <label style={labelStyle}>Oxygen Saturation (%)</label>
                <input
                  type="number"
                  value={newVitals.oxygenSaturation}
                  onChange={(e) => handleVitalChange("oxygenSaturation", e.target.value)}
                  style={inputStyle}
                  placeholder="98"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Systolic BP</label>
                <input
                  type="number"
                  value={newVitals.bloodPressureSystolic}
                  onChange={(e) => handleVitalChange("bloodPressureSystolic", e.target.value)}
                  style={inputStyle}
                  placeholder="120"
                />
              </div>
              
              <div>
                <label style={labelStyle}>Diastolic BP</label>
                <input
                  type="number"
                  value={newVitals.bloodPressureDiastolic}
                  onChange={(e) => handleVitalChange("bloodPressureDiastolic", e.target.value)}
                  style={inputStyle}
                  placeholder="80"
                />
              </div>
              
              <div>
                <label style={labelStyle}>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newVitals.weight}
                  onChange={(e) => handleVitalChange("weight", e.target.value)}
                  style={inputStyle}
                  placeholder="70"
                />
              </div>
              
              <div>
                <label style={labelStyle}>Height (cm)</label>
                <input
                  type="number"
                  value={newVitals.height}
                  onChange={(e) => handleVitalChange("height", e.target.value)}
                  style={inputStyle}
                  placeholder="175"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>BMI (auto-calculated)</label>
                <input
                  type="text"
                  value={newVitals.bmi}
                  style={{ ...inputStyle, backgroundColor: "#f9fafb" }}
                  readOnly
                  placeholder="Auto-calculated"
                />
              </div>
              
              <div>
                <label style={labelStyle}>Pain Level (0-10)</label>
                <select
                  value={newVitals.painLevel}
                  onChange={(e) => handleVitalChange("painLevel", e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select Pain Level</option>
                  {[0,1,2,3,4,5,6,7,8,9,10].map(level => (
                    <option key={level} value={level}>{level} - {level === 0 ? "No Pain" : level <= 3 ? "Mild" : level <= 6 ? "Moderate" : "Severe"}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Notes</label>
              <textarea
                value={newVitals.notes}
                onChange={(e) => handleVitalChange("notes", e.target.value)}
                style={{ ...inputStyle, minHeight: "80px" }}
                placeholder="Additional observations or notes..."
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <Button type="submit" disabled={loading}>
                {loading ? "Recording..." : "Record Vital Signs"}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Vital Signs History */}
      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1.5rem" }}>
            Vital Signs History
          </h3>
          
          {vitalSigns.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
              No vital signs recorded yet.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Date/Time</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Temp (°F)</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>BP</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>HR</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>RR</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>O2 Sat</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Weight</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>BMI</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Pain</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Recorded By</th>
                  </tr>
                </thead>
                <tbody>
                  {vitalSigns.map((vital) => (
                    <tr key={vital.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                        {new Date(vital.date).toLocaleDateString()}<br/>
                        <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                          {new Date(vital.date).toLocaleTimeString()}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem", color: getVitalStatus(vital.temperature, "temperature").color }}>
                        {vital.temperature}
                      </td>
                      <td style={{ padding: "0.75rem" }}>{vital.bloodPressure}</td>
                      <td style={{ padding: "0.75rem", color: getVitalStatus(vital.heartRate, "heartRate").color }}>
                        {vital.heartRate}
                      </td>
                      <td style={{ padding: "0.75rem", color: getVitalStatus(vital.respiratoryRate, "respiratoryRate").color }}>
                        {vital.respiratoryRate}
                      </td>
                      <td style={{ padding: "0.75rem", color: getVitalStatus(vital.oxygenSaturation, "oxygenSaturation").color }}>
                        {vital.oxygenSaturation}%
                      </td>
                      <td style={{ padding: "0.75rem" }}>{vital.weight} kg</td>
                      <td style={{ padding: "0.75rem" }}>{vital.bmi}</td>
                      <td style={{ padding: "0.75rem" }}>{vital.painLevel}/10</td>
                      <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>{vital.recordedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}