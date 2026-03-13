import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { Form, Select, TextArea } from "../../../components/hospital/Form";
import { useLab } from "../../../hooks/useLab";
import { usePatients } from "../../../hooks/usePatients";

export default function LabOrderCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const { createLabOrder } = useLab();
  const { patients } = usePatients();
  const [loading, setLoading] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [patient, setPatient] = useState(null);

  console.log('LabOrderCreate - patientId from URL:', patientId);
  console.log('LabOrderCreate - patients:', patients);

  useEffect(() => {
    if (patientId && patients) {
      const foundPatient = patients.find(p => p.id === patientId);
      console.log('LabOrderCreate - found patient:', foundPatient);
      setPatient(foundPatient);
    }
  }, [patientId, patients]);

  const availableTests = [
    { label: "Complete Blood Count (CBC)", value: "CBC", price: 45.00 },
    { label: "Blood Glucose", value: "Blood Glucose", price: 25.00 },
    { label: "Lipid Profile", value: "Lipid Profile", price: 65.00 },
    { label: "Liver Function Test (LFT)", value: "LFT", price: 85.00 },
    { label: "Kidney Function Test (KFT)", value: "KFT", price: 75.00 },
    { label: "Thyroid Function Test (TFT)", value: "TFT", price: 95.00 },
    { label: "Urinalysis", value: "Urinalysis", price: 30.00 },
    { label: "HbA1c", value: "HbA1c", price: 55.00 },
    { label: "C-Reactive Protein (CRP)", value: "CRP", price: 40.00 },
    { label: "Electrolytes", value: "Electrolytes", price: 50.00 },
  ];

  const getTotalCost = () => {
    return selectedTests.reduce((total, testValue) => {
      const test = availableTests.find(t => t.value === testValue);
      return total + (test ? test.price : 0);
    }, 0).toFixed(2);
  };

  const handleSubmit = async (values) => {
    if (selectedTests.length === 0) {
      alert("Please select at least one test.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...values,
        patientId,
        patientName: patient?.fullName || 'Unknown Patient',
        tests: selectedTests.map(testValue => {
          const test = availableTests.find(t => t.value === testValue);
          return {
            name: test.label,
            code: testValue,
            price: test.price,
            status: 'Pending'
          };
        }),
        totalCost: parseFloat(getTotalCost()),
        status: "Pending",
        orderDate: new Date().toISOString(),
        orderedBy: "Current User" // In real app, get from auth
      };

      await createLabOrder(orderData);
      alert("Lab order created successfully!");
      navigate(patientId ? `/hospital/patients/${patientId}` : '/hospital/lab/orders');
    } catch (error) {
      console.error("Error creating lab order:", error);
      alert("Failed to create lab order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Order Laboratory Tests" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>Creating lab order...</div>
        </Card>
      </>
    );
  }

  // Show loading state while patients are being fetched
  if (!patients || patients.length === 0) {
    return (
      <>
        <PageHeader title="Order Laboratory Tests" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading patient information...</div>
        </Card>
      </>
    );
  }

  // Show error if patientId is provided but patient not found
  if (patientId && !patient) {
    return (
      <>
        <PageHeader title="Order Laboratory Tests" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Patient not found (ID: {patientId})</p>
            <Button onClick={() => navigate('/hospital/patients')} style={{ marginTop: '1rem' }}>
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
        title="Order Laboratory Tests"
        subtitle={patient ? `Patient: ${patient.fullName} (ID: ${patient.patientId || patient.id})` : 'Select tests for laboratory analysis'}
        action={
          <Button 
            variant="secondary" 
            onClick={() => navigate(patientId ? `/hospital/patients/${patientId}` : '/hospital/lab')}
          >
            {patientId ? 'Back to Patient' : 'Back to Lab'}
          </Button>
        }
      />

      {patient && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem' }}>
            <h3>Debug Information:</h3>
            <p>Patient ID from URL: {patientId || 'None'}</p>
            <p>Patients loaded: {patients ? patients.length : 'Loading...'}</p>
            <p>Current patient: {patient ? patient.fullName : 'Not found'}</p>
            <p>Selected tests: {selectedTests.length}</p>
          </div>
        </Card>
      )}

      {patient && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', padding: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Patient</div>
              <div style={{ fontWeight: '600' }}>{patient.fullName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Age</div>
              <div style={{ fontWeight: '600' }}>
                {patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : patient.age || 'N/A'} years
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Gender</div>
              <div style={{ fontWeight: '600' }}>{patient.gender}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Patient ID</div>
              <div style={{ fontWeight: '600' }}>{patient.patientId || patient.id}</div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Creating lab order...</div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                Select Laboratory Tests
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0.75rem" }}>
                {availableTests.map((test) => (
                  <label 
                    key={test.value} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.75rem",
                      padding: '0.75rem',
                      border: selectedTests.includes(test.value) ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      backgroundColor: selectedTests.includes(test.value) ? '#f0f9ff' : 'white'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTests([...selectedTests, test.value]);
                        } else {
                          setSelectedTests(selectedTests.filter(t => t !== test.value));
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{test.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>${test.price.toFixed(2)}</div>
                    </div>
                  </label>
                ))}
              </div>
              
              {selectedTests.length > 0 && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>Selected Tests: {selectedTests.length}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {selectedTests.map(testValue => {
                          const test = availableTests.find(t => t.value === testValue);
                          return test ? test.label : testValue;
                        }).join(', ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>
                        ${getTotalCost()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total Cost</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <Select
                name="priority"
                label="Priority"
                options={[
                  { label: "Routine", value: "Routine" },
                  { label: "Urgent", value: "Urgent" },
                  { label: "STAT (Immediate)", value: "STAT" },
                ]}
                required
              />
              
              <Select
                name="department"
                label="Requesting Department"
                options={[
                  { label: "Internal Medicine", value: "Internal Medicine" },
                  { label: "Cardiology", value: "Cardiology" },
                  { label: "Emergency", value: "Emergency" },
                  { label: "Surgery", value: "Surgery" },
                  { label: "Pediatrics", value: "Pediatrics" },
                  { label: "Other", value: "Other" },
                ]}
              />
            </div>

            <TextArea 
              name="clinicalNotes" 
              label="Clinical Notes / Indication" 
              placeholder="Enter clinical indication, symptoms, or special instructions for the laboratory..."
            />
          </Form>
        )}
      </Card>
    </>
  );
}
