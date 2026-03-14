import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import Badge from "../../components/hospital/Badge";
import { usePatients } from "../../hooks/usePatients";

export default function VitalSigns() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients } = usePatients();
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState({
    temperature: "",
    tempUnit: "C",
    systolic: "",
    diastolic: "",
    heartRate: "",
    respiratoryRate: "",
    spo2: "",
    weight: "",
    height: "",
    glucose: "",
    pain: "",
  });
  const [calculated, setCalculated] = useState({});
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Find the patient
    if (patients && id) {
      const foundPatient = patients.find(p => p.id === id);
      setPatient(foundPatient);
    }
  }, [patients, id]);

  useEffect(() => {
    calculateMetrics();
    checkAlerts();
  }, [vitals]);

  const calculateMetrics = () => {
    const { weight, height, systolic, diastolic } = vitals;
    const calc = {};

    // BMI
    if (weight && height) {
      const w = parseFloat(weight);
      const h = parseFloat(height) / 100;
      calc.bmi = (w / (h * h)).toFixed(1);
      calc.bmiCategory = getBMICategory(calc.bmi);
    }

    // MAP (Mean Arterial Pressure)
    if (systolic && diastolic) {
      const sys = parseFloat(systolic);
      const dia = parseFloat(diastolic);
      calc.map = ((sys + 2 * dia) / 3).toFixed(0);
    }

    // BSA (Body Surface Area - Mosteller formula)
    if (weight && height) {
      const w = parseFloat(weight);
      const h = parseFloat(height);
      calc.bsa = (Math.sqrt((h * w) / 3600)).toFixed(2);
    }

    setCalculated(calc);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const checkAlerts = () => {
    const newAlerts = [];
    const { temperature, tempUnit, systolic, diastolic, heartRate, respiratoryRate, spo2, glucose } = vitals;

    // Temperature
    const temp = parseFloat(temperature);
    if (temp) {
      const tempC = tempUnit === "F" ? (temp - 32) * 5/9 : temp;
      if (tempC > 38) newAlerts.push({ type: "critical", msg: "Fever detected", value: `${temp}°${tempUnit}` });
      if (tempC < 36) newAlerts.push({ type: "warning", msg: "Hypothermia risk", value: `${temp}°${tempUnit}` });
    }

    // Blood Pressure
    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);
    if (sys && dia) {
      if (sys >= 180 || dia >= 110) newAlerts.push({ type: "critical", msg: "Hypertensive Crisis", value: `${sys}/${dia}` });
      else if (sys >= 140 || dia >= 90) newAlerts.push({ type: "warning", msg: "High BP", value: `${sys}/${dia}` });
      else if (sys < 90 || dia < 60) newAlerts.push({ type: "warning", msg: "Low BP", value: `${sys}/${dia}` });
    }

    // Heart Rate
    const hr = parseFloat(heartRate);
    if (hr) {
      if (hr > 100) newAlerts.push({ type: "warning", msg: "Tachycardia", value: `${hr} bpm` });
      if (hr < 60) newAlerts.push({ type: "info", msg: "Bradycardia", value: `${hr} bpm` });
    }

    // SpO2
    const spo = parseFloat(spo2);
    if (spo) {
      if (spo < 90) newAlerts.push({ type: "critical", msg: "Critical Hypoxemia", value: `${spo}%` });
      else if (spo < 92) newAlerts.push({ type: "warning", msg: "Low Oxygen", value: `${spo}%` });
    }

    // Respiratory Rate
    const rr = parseFloat(respiratoryRate);
    if (rr) {
      if (rr > 20) newAlerts.push({ type: "warning", msg: "Tachypnea", value: `${rr}/min` });
      if (rr < 12) newAlerts.push({ type: "warning", msg: "Bradypnea", value: `${rr}/min` });
    }

    // Glucose
    const gluc = parseFloat(glucose);
    if (gluc) {
      if (gluc > 200) newAlerts.push({ type: "critical", msg: "Hyperglycemia", value: `${gluc} mg/dL` });
      if (gluc < 70) newAlerts.push({ type: "critical", msg: "Hypoglycemia", value: `${gluc} mg/dL` });
    }

    setAlerts(newAlerts);
  };

  const handleChange = (field, value) => {
    setVitals({ ...vitals, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { 
      ...vitals, 
      calculated, 
      alerts, 
      patientId: id,
      patientName: patient?.fullName,
      recordedAt: new Date().toISOString(),
      recordedBy: "Current User" // In real app, get from auth
    };
    console.log("Saving vitals for patient:", id, data);
    alert(`Vital signs recorded successfully for ${patient?.fullName || 'patient'}!`);
    navigate(`/hospital/patients/${id}`);
  };

  return (
    <>
      <PageHeader 
        title={`Record Vital Signs - ${patient?.fullName || 'Patient'}`}
        subtitle={patient ? `Patient ID: ${patient.patientId || patient.id} • ${patient.gender} • ${patient.age || 'N/A'} years` : 'Loading patient information...'}
        action={
          <Button variant="secondary" onClick={() => navigate(`/hospital/patients/${id}`)}>
            Back to Patient
          </Button>
        }
      />

      {patient && (
        <Card style={{ marginBottom: "1rem", backgroundColor: "#f0f9ff", border: "1px solid #3b82f6" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", padding: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Patient</div>
              <div style={{ fontWeight: "600" }}>{patient.fullName}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Age</div>
              <div style={{ fontWeight: "600" }}>
                {patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : patient.age || 'N/A'} years
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Gender</div>
              <div style={{ fontWeight: "600" }}>{patient.gender}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>MRN</div>
              <div style={{ fontWeight: "600" }}>{patient.patientId || patient.id}</div>
            </div>
          </div>
        </Card>
      )}

      {alerts.length > 0 && (
        <Card style={{ marginBottom: "1rem", backgroundColor: "#fef2f2", borderLeft: "4px solid #ef4444" }}>
          <h3 style={{ fontWeight: "600", marginBottom: "0.5rem", color: "#991b1b" }}>⚠️ Clinical Alerts</h3>
          {alerts.map((alert, i) => (
            <div key={i} style={{ padding: "0.5rem", marginBottom: "0.25rem", backgroundColor: alert.type === "critical" ? "#fee2e2" : "#fef3c7", borderRadius: "0.25rem" }}>
              <strong>{alert.msg}:</strong> {alert.value}
            </div>
          ))}
        </Card>
      )}

      {/* Medical History & Preferences */}
      <Card style={{ marginBottom: "1rem", backgroundColor: "#f0f9ff", border: "2px solid #3b82f6" }}>
        <h3 style={{ fontWeight: "600", marginBottom: "1rem", color: "#1f2937", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          📋 Medical History & Preferences
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Known Allergies</label>
            <input
              type="text"
              placeholder="List any known allergies"
              defaultValue={patient?.allergies || ""}
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Current Medications</label>
            <input
              type="text"
              placeholder="List current medications"
              defaultValue={patient?.currentMedications || ""}
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Medical Conditions</label>
            <input
              type="text"
              placeholder="List existing conditions"
              defaultValue={patient?.medicalConditions || ""}
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Preferred Language</label>
            <input
              type="text"
              placeholder="English, Spanish, etc."
              defaultValue={patient?.preferredLanguage || ""}
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Primary Care Physician</label>
            <input
              type="text"
              placeholder="Doctor's name"
              defaultValue={patient?.primaryPhysician || ""}
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Referring Physician</label>
            <input
              type="text"
              placeholder="Doctor who referred patient"
              defaultValue={patient?.referringPhysician || ""}
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Patient Type</label>
            <select
              defaultValue={patient?.patientType || "Outpatient"}
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
            >
              <option value="Outpatient">Outpatient</option>
              <option value="Inpatient">Inpatient</option>
              <option value="Emergency">Emergency</option>
              <option value="Observation">Observation</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Admission Type</label>
            <select
              defaultValue={patient?.admissionType || "Elective"}
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
            >
              <option value="Elective">Elective</option>
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Routine">Routine</option>
            </select>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          
          {/* Temperature */}
          <Card title="🌡️ Temperature">
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input type="number" step="0.1" placeholder="36.5" value={vitals.temperature} onChange={(e) => handleChange("temperature", e.target.value)} style={{ flex: 1, padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
              <select value={vitals.tempUnit} onChange={(e) => handleChange("tempUnit", e.target.value)} style={{ padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}>
                <option value="C">°C</option>
                <option value="F">°F</option>
              </select>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Normal: 36.5-37.5°C</p>
          </Card>

          {/* Blood Pressure */}
          <Card title="💓 Blood Pressure">
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input type="number" placeholder="120" value={vitals.systolic} onChange={(e) => handleChange("systolic", e.target.value)} style={{ width: "80px", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
              <span>/</span>
              <input type="number" placeholder="80" value={vitals.diastolic} onChange={(e) => handleChange("diastolic", e.target.value)} style={{ width: "80px", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
              <span>mmHg</span>
            </div>
            {calculated.map && <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>MAP: <strong>{calculated.map}</strong> mmHg</p>}
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Normal: 90-120 / 60-80</p>
          </Card>

          {/* Heart Rate */}
          <Card title="❤️ Heart Rate">
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input type="number" placeholder="72" value={vitals.heartRate} onChange={(e) => handleChange("heartRate", e.target.value)} style={{ flex: 1, padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
              <span>bpm</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Normal: 60-100 bpm</p>
          </Card>

          {/* Respiratory Rate */}
          <Card title="🫁 Respiratory Rate">
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input type="number" placeholder="16" value={vitals.respiratoryRate} onChange={(e) => handleChange("respiratoryRate", e.target.value)} style={{ flex: 1, padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
              <span>/min</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Normal: 12-20 /min</p>
          </Card>

          {/* SpO2 */}
          <Card title="🩺 Oxygen Saturation">
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input type="number" placeholder="98" value={vitals.spo2} onChange={(e) => handleChange("spo2", e.target.value)} style={{ flex: 1, padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
              <span>%</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Normal: ≥95%</p>
          </Card>

          {/* Weight & Height */}
          <Card title="⚖️ Anthropometrics">
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ fontSize: "0.75rem", color: "#6b7280" }}>Weight (kg)</label>
              <input type="number" step="0.1" placeholder="70" value={vitals.weight} onChange={(e) => handleChange("weight", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#6b7280" }}>Height (cm)</label>
              <input type="number" placeholder="170" value={vitals.height} onChange={(e) => handleChange("height", e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
            </div>
            {calculated.bmi && (
              <div style={{ marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "#f3f4f6", borderRadius: "0.25rem" }}>
                <p style={{ fontSize: "0.875rem" }}>BMI: <strong>{calculated.bmi}</strong> ({calculated.bmiCategory})</p>
                <p style={{ fontSize: "0.875rem" }}>BSA: <strong>{calculated.bsa}</strong> m²</p>
              </div>
            )}
          </Card>

          {/* Blood Glucose */}
          <Card title="🩸 Blood Glucose">
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input type="number" placeholder="100" value={vitals.glucose} onChange={(e) => handleChange("glucose", e.target.value)} style={{ flex: 1, padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }} />
              <span>mg/dL</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Normal: 70-100 (fasting)</p>
          </Card>

          {/* Pain Scale */}
          <Card title="😣 Pain Scale">
            <input type="range" min="0" max="10" value={vitals.pain} onChange={(e) => handleChange("pain", e.target.value)} style={{ width: "100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6b7280" }}>
              <span>0 (No pain)</span>
              <span style={{ fontWeight: "600", fontSize: "1.25rem" }}>{vitals.pain || 0}</span>
              <span>10 (Worst)</span>
            </div>
          </Card>
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <Button type="button" variant="secondary" onClick={() => navigate(`/hospital/patients/${id}`)}>Cancel</Button>
          <Button type="submit">Save Vital Signs</Button>
        </div>
      </form>
    </>
  );
}
