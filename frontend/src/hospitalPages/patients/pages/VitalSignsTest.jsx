import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { usePatients } from "../../../hooks/usePatients";

export default function VitalSignsTest() {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const { patients } = usePatients();
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    weight: ''
  });

  useEffect(() => {
    const foundPatient = patients.find(p => p.id === patientId);
    setPatient(foundPatient);
  }, [patientId, patients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Recording vitals for patient:', patientId, vitals);
    alert(`Vital signs recorded for ${patient?.fullName}!`);
    setVitals({ temperature: '', bloodPressure: '', heartRate: '', weight: '' });
  };

  return (
    <>
      <PageHeader 
        title={`Record Vital Signs - ${patient?.fullName || 'Patient'}`}
        action={
          <Button variant="secondary" onClick={() => navigate(`/hospital/patients/${patientId}`)}>
            Back to Patient
          </Button>
        }
      />

      <Card>
        <div style={{ padding: '2rem' }}>
          <h3>Debug Information:</h3>
          <p><strong>Patient ID from URL:</strong> {patientId}</p>
          <p><strong>Patients loaded:</strong> {patients ? patients.length : 'Loading...'}</p>
          <p><strong>Current patient:</strong> {patient ? patient.fullName : 'Not found'}</p>
          
          {patient && (
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
              <h4>Patient Information:</h4>
              <p>Name: {patient.fullName}</p>
              <p>ID: {patient.id}</p>
              <p>Gender: {patient.gender}</p>
              <p>Age: {patient.age || 'N/A'}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            <h4>Record Vital Signs:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.5rem' 
                  }}
                  placeholder="98.6"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Blood Pressure
                </label>
                <input
                  type="text"
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.5rem' 
                  }}
                  placeholder="120/80"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.5rem' 
                  }}
                  placeholder="72"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={vitals.weight}
                  onChange={(e) => setVitals({...vitals, weight: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.5rem' 
                  }}
                  placeholder="70"
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <Button type="submit">
                Record Vital Signs
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(`/hospital/patients/${patientId}`)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  );
}