import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { usePatients } from "../../../hooks/usePatients";

export default function LabOrderCreateTest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const { patients } = usePatients();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (patientId && patients) {
      const foundPatient = patients.find(p => p.id === patientId);
      setPatient(foundPatient);
    }
  }, [patientId, patients]);

  return (
    <>
      <PageHeader 
        title="Order Laboratory Tests (Test Page)"
        action={
          <Button variant="secondary" onClick={() => navigate('/hospital/patients')}>
            Back to Patients
          </Button>
        }
      />

      <Card>
        <div style={{ padding: '2rem' }}>
          <h3>Debug Information:</h3>
          <p><strong>Patient ID from URL:</strong> {patientId || 'None'}</p>
          <p><strong>Patients loaded:</strong> {patients ? patients.length : 'Loading...'}</p>
          <p><strong>Current patient:</strong> {patient ? patient.fullName : 'Not found'}</p>
          
          {patient && (
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
              <h4>Patient Information:</h4>
              <p>Name: {patient.fullName}</p>
              <p>ID: {patient.id}</p>
              <p>Gender: {patient.gender}</p>
              <p>Phone: {patient.phone}</p>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h4>Available Tests:</h4>
            <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" />
                Complete Blood Count (CBC) - $45.00
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" />
                Blood Glucose - $25.00
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" />
                Lipid Profile - $65.00
              </label>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <Button onClick={() => alert('Test order created!')}>
              Create Test Order
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/hospital/patients/${patientId}`)}>
              Back to Patient
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}