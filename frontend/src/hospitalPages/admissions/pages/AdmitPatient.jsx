import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { Form, Input, Select, TextArea } from "../../../components/hospital/Form";
import { useAdmissions } from "../../../hooks/useAdmissions";
import { usePatients } from "../../../hooks/usePatients";

export default function AdmitPatient() {
  const navigate = useNavigate();
  const { admitPatient } = useAdmissions();
  const { patients, fetchPatients } = usePatients();
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    console.log('AdmitPatient mounted, fetching patients...');
    fetchPatients();
  }, []);

  useEffect(() => {
    console.log('Patients updated:', patients);
  }, [patients]);

  const handleSubmit = async (values) => {
    console.log('Form submitted with values:', values);
    setLoading(true);
    try {
      await admitPatient(values);
      console.log('Patient admitted successfully, navigating to list...');
      alert("Patient admitted successfully!");
      navigate("/hospital/admissions");
    } catch (error) {
      console.error("Error admitting patient:", error);
      alert("Failed to admit patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientChange = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
  };

  return (
    <>
      <PageHeader title="Admit Patient" />
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Admitting patient...</p>
          </div>
        ) : (
          <>
            <Form onSubmit={handleSubmit}>
              <Select
                name="patientId"
                label="Select Patient"
                placeholder="-- Select a patient --"
                options={patients?.map((p) => ({ 
                  label: `${p.fullName || p.name} - ${p.phone || 'N/A'}`, 
                  value: p.id 
                })) || []}
                onChange={(e) => handlePatientChange(e.target.value)}
                required
              />
              
              {selectedPatient && (
                <div style={{ 
                  padding: "1rem", 
                  backgroundColor: "#f0f9ff", 
                  borderRadius: "8px", 
                  marginBottom: "1rem",
                  border: "1px solid #bae6fd"
                }}>
                  <h3 style={{ marginBottom: "0.5rem", color: "#0369a1" }}>Patient Information</h3>
                  <p><strong>Name:</strong> {selectedPatient.fullName || selectedPatient.name}</p>
                  <p><strong>Email:</strong> {selectedPatient.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedPatient.phone || 'N/A'}</p>
                  <p><strong>Date of Birth:</strong> {selectedPatient.dateOfBirth || 'N/A'}</p>
                  <p><strong>Gender:</strong> {selectedPatient.gender || 'N/A'}</p>
                </div>
              )}

              <Input 
                name="admitDate" 
                type="date" 
                label="Admission Date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                required 
              />
              
              <Select
                name="admissionType"
                label="Admission Type"
                placeholder="-- Select admission type --"
                options={[
                  { label: "Emergency", value: "Emergency" },
                  { label: "Planned", value: "Planned" },
                  { label: "Transfer", value: "Transfer" },
                ]}
                required
              />

              <Input name="ward" label="Ward/Department" placeholder="e.g., ICU, General Ward" required />
              <Input name="bed" label="Bed Number" placeholder="e.g., A-101" required />
              
              <TextArea 
                name="reason" 
                label="Reason for Admission" 
                placeholder="Enter detailed reason for admission..."
                rows={4}
                required 
              />
            </Form>
          </>
        )}
      </Card>
    </>
  );
}
