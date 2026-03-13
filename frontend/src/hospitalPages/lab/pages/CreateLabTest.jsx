import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useLab } from "../../../hooks/useLab";
import { usePatients } from "../../../hooks/usePatients";
import { useDoctors } from "../../../hooks/useDoctors";

export default function CreateLabTest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createLabOrder } = useLab();
  const { patients, fetchPatients } = usePatients();
  const { doctors, fetchDoctors } = useDoctors();
  const [loading, setLoading] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [priority, setPriority] = useState("Routine");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    const patientId = searchParams.get("patientId");
    if (patientId) {
      setSelectedPatient(patientId);
      console.log('Pre-selected patient:', patientId);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }
    if (!selectedDoctor) {
      alert("Please select a doctor");
      return;
    }
    if (selectedTests.length === 0) {
      alert("Please select at least one test");
      return;
    }

    setLoading(true);
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      const doctor = doctors.find(d => d.id === selectedDoctor);
      
      await createLabOrder({
        patientId: selectedPatient,
        patientName: patient?.fullName || patient?.name || "Unknown",
        doctorId: selectedDoctor,
        orderedBy: `Dr. ${doctor?.fullName || doctor?.name || "Unknown"}`,
        tests: selectedTests,
        priority,
        clinicalNotes: notes,
        status: "Pending",
        orderedAt: new Date().toISOString(),
      });
      
      alert(`Lab order created successfully! ${selectedTests.length} test(s) ordered.`);
      const patientId = searchParams.get("patientId");
      if (patientId) {
        navigate(`/hospital/patients/${patientId}`);
      } else {
        navigate("/hospital/lab/orders");
      }
    } catch (error) {
      console.error("Error creating lab order:", error);
      alert("Failed to create lab order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const testTypes = [
    { label: "Complete Blood Count (CBC)", value: "CBC", category: "Hematology" },
    { label: "Blood Glucose (Fasting)", value: "Blood Glucose", category: "Chemistry" },
    { label: "HbA1c (Glycated Hemoglobin)", value: "HbA1c", category: "Chemistry" },
    { label: "Lipid Profile", value: "Lipid Profile", category: "Chemistry" },
    { label: "Liver Function Test (LFT)", value: "LFT", category: "Chemistry" },
    { label: "Kidney Function Test (KFT)", value: "KFT", category: "Chemistry" },
    { label: "Thyroid Function Test (TFT)", value: "TFT", category: "Endocrinology" },
    { label: "Electrolytes Panel", value: "Electrolytes", category: "Chemistry" },
    { label: "Urinalysis", value: "Urinalysis", category: "Microbiology" },
    { label: "Urine Culture", value: "Urine Culture", category: "Microbiology" },
    { label: "Blood Culture", value: "Blood Culture", category: "Microbiology" },
    { label: "C-Reactive Protein (CRP)", value: "CRP", category: "Immunology" },
    { label: "Erythrocyte Sedimentation Rate (ESR)", value: "ESR", category: "Hematology" },
    { label: "Prothrombin Time (PT/INR)", value: "PT/INR", category: "Coagulation" },
    { label: "Vitamin D", value: "Vitamin D", category: "Chemistry" },
    { label: "Vitamin B12", value: "Vitamin B12", category: "Chemistry" },
    { label: "Iron Studies", value: "Iron Studies", category: "Hematology" },
    { label: "Hepatitis Panel", value: "Hepatitis Panel", category: "Serology" },
    { label: "HIV Test", value: "HIV Test", category: "Serology" },
    { label: "Pregnancy Test (hCG)", value: "Pregnancy Test", category: "Endocrinology" },
  ];

  const groupedTests = testTypes.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {});

  const toggleTest = (testValue) => {
    if (selectedTests.includes(testValue)) {
      setSelectedTests(selectedTests.filter(t => t !== testValue));
    } else {
      setSelectedTests([...selectedTests, testValue]);
    }
  };

  const selectAllInCategory = (category) => {
    const categoryTests = groupedTests[category].map(t => t.value);
    const allSelected = categoryTests.every(t => selectedTests.includes(t));
    
    if (allSelected) {
      setSelectedTests(selectedTests.filter(t => !categoryTests.includes(t)));
    } else {
      const newTests = [...new Set([...selectedTests, ...categoryTests])];
      setSelectedTests(newTests);
    }
  };

  if (!patients || patients.length === 0 || !doctors || doctors.length === 0) {
    return (
      <>
        <PageHeader title="Order Laboratory Tests" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ marginBottom: "1rem" }}>
              {!patients || patients.length === 0 ? "No patients found. " : ""}
              {!doctors || doctors.length === 0 ? "No doctors found." : ""}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              {(!patients || patients.length === 0) && (
                <Button onClick={() => navigate("/hospital/patients/create")}>
                  Add Patient
                </Button>
              )}
              {(!doctors || doctors.length === 0) && (
                <Button onClick={() => navigate("/hospital/doctors/create")}>
                  Add Doctor
                </Button>
              )}
            </div>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Order Laboratory Tests" 
        subtitle={selectedPatient && patients ? 
          `Patient: ${patients.find(p => p.id === selectedPatient)?.fullName || 'Loading...'} • Professional lab test ordering` : 
          'Select patient and tests for laboratory analysis'
        }
        action={
          <Button 
            variant="secondary" 
            onClick={() => {
              const patientId = searchParams.get("patientId");
              if (patientId) {
                navigate(`/hospital/patients/${patientId}`);
              } else {
                navigate("/hospital/lab/orders");
              }
            }}
          >
            {searchParams.get("patientId") ? "Back to Patient" : "Cancel"}
          </Button>
        }
      />
      
      <Card>
        {selectedPatient && patients && (
          <div style={{ 
            marginBottom: '1.5rem', 
            padding: '1rem', 
            backgroundColor: '#f0f9ff', 
            border: '1px solid #3b82f6', 
            borderRadius: '0.5rem' 
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
              Patient Information
            </h3>
            {(() => {
              const patient = patients.find(p => p.id === selectedPatient);
              return patient ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
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
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>MRN</div>
                    <div style={{ fontWeight: '600' }}>{patient.patientId || patient.id}</div>
                  </div>
                </div>
              ) : (
                <div>Loading patient information...</div>
              );
            })()} 
          </div>
        )}
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Creating lab order...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Patient *
              </label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
                required
              >
                <option value="">Select Patient</option>
                {patients?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName || p.name} - MRN: {p.mrn || p.id}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Ordering Doctor *
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
                required
              >
                <option value="">Select Doctor</option>
                {doctors?.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.fullName || d.name} - {d.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontWeight: "600" }}>Select Tests * ({selectedTests.length} selected)</label>
                {selectedTests.length > 0 && (
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="secondary"
                    onClick={() => setSelectedTests([])}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              
              <div style={{ border: "1px solid #d1d5db", borderRadius: "0.5rem", padding: "1rem", maxHeight: "400px", overflowY: "auto" }}>
                {Object.entries(groupedTests).map(([category, tests]) => (
                  <div key={category} style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <h4 style={{ fontWeight: "600", color: "#374151" }}>{category}</h4>
                      <button
                        type="button"
                        onClick={() => selectAllInCategory(category)}
                        style={{ 
                          fontSize: "0.75rem", 
                          color: "#2563eb", 
                          background: "none", 
                          border: "none", 
                          cursor: "pointer",
                          textDecoration: "underline"
                        }}
                      >
                        {tests.every(t => selectedTests.includes(t.value)) ? "Deselect All" : "Select All"}
                      </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "0.5rem" }}>
                      {tests.map((test) => (
                        <label 
                          key={test.value} 
                          style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "0.5rem",
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            backgroundColor: selectedTests.includes(test.value) ? "#dbeafe" : "transparent",
                            border: selectedTests.includes(test.value) ? "1px solid #3b82f6" : "1px solid transparent"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTests.includes(test.value)}
                            onChange={() => toggleTest(test.value)}
                            style={{ cursor: "pointer" }}
                          />
                          <span style={{ fontSize: "0.875rem" }}>{test.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Priority *
              </label>
              <div style={{ display: "flex", gap: "1rem" }}>
                {["Routine", "Urgent", "STAT"].map((p) => (
                  <label key={p} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={priority === p}
                      onChange={(e) => setPriority(e.target.value)}
                      style={{ cursor: "pointer" }}
                    />
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "1rem", 
                      fontSize: "0.875rem",
                      backgroundColor: p === "Routine" ? "#dcfce7" : p === "Urgent" ? "#fed7aa" : "#fecaca",
                      color: p === "Routine" ? "#166534" : p === "Urgent" ? "#9a3412" : "#991b1b"
                    }}>
                      {p}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Clinical Notes / Indication
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Enter clinical indication, symptoms, or special instructions..."
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  const patientId = searchParams.get("patientId");
                  if (patientId) {
                    navigate(`/hospital/patients/${patientId}`);
                  } else {
                    navigate("/hospital/lab/orders");
                  }
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || selectedTests.length === 0}>
                Order {selectedTests.length} Test{selectedTests.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </>
  );
}
