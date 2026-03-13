import React, { useState } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { Form, Input, Select } from "../../../components/hospital/Form";
import { usePatients } from "../../../hooks/usePatients";
import { useBilling } from "../../../hooks/useBilling";
import { useNavigate } from "react-router-dom";

export default function PatientCreate() {
  const { createPatient } = usePatients();
  const { insuranceProviders, addInsuranceProvider } = useBilling();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: "", code: "", type: "Private" });

  const activeProviders = insuranceProviders.filter(p => p.status === "Active");

  const handleAddProvider = () => {
    if (!newProvider.name || !newProvider.code) {
      alert("Please enter provider name and code");
      return;
    }
    addInsuranceProvider(newProvider);
    setShowAddProvider(false);
    setNewProvider({ name: "", code: "", type: "Private" });
    alert("Insurance provider added successfully!");
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('Submitting patient data:', values);
      await createPatient(values);
      alert('Patient registered successfully!');
      navigate("/hospital/patients");
    } catch (error) {
      console.error("Error creating patient:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create patient. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Professional Patient Registration" 
        action={
          <Button variant="secondary" onClick={() => navigate("/hospital/patients")}>
            Back to Patients
          </Button>
        }
      />
      
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Saving patient...</div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <Card>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
                Personal Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                <Input name="fullName" label="Full Name" required placeholder="Enter patient's full name" />
                <Input name="patientId" label="Patient ID" placeholder="Auto-generated if empty" />
                <Select
                  name="gender"
                  label="Gender"
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                  required
                />
                <Input name="dateOfBirth" label="Date of Birth" type="date" required />
                <Input name="age" label="Age" type="number" placeholder="Calculated from DOB" />
                <Select
                  name="maritalStatus"
                  label="Marital Status"
                  options={[
                    { label: "Single", value: "Single" },
                    { label: "Married", value: "Married" },
                    { label: "Divorced", value: "Divorced" },
                    { label: "Widowed", value: "Widowed" },
                  ]}
                />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                <Input name="phone" label="Primary Phone" required placeholder="(555) 123-4567" />
                <Input name="alternatePhone" label="Alternate Phone" placeholder="(555) 987-6543" />
                <Input name="email" label="Email Address" type="email" placeholder="patient@email.com" />
                <Select
                  name="bloodGroup"
                  label="Blood Group"
                  options={[
                    { label: "A+", value: "A+" },
                    { label: "A-", value: "A-" },
                    { label: "B+", value: "B+" },
                    { label: "B-", value: "B-" },
                    { label: "O+", value: "O+" },
                    { label: "O-", value: "O-" },
                    { label: "AB+", value: "AB+" },
                    { label: "AB-", value: "AB-" },
                  ]}
                />
              </div>
              
              <div style={{ marginTop: "1rem" }}>
                <Input name="address" label="Complete Address" placeholder="Street, City, State, ZIP Code" />
              </div>
            </Card>

            {/* Insurance Information */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937" }}>
                  Insurance Information
                </h3>
                <Button 
                  type="button"
                  size="sm" 
                  variant="secondary" 
                  onClick={() => setShowAddProvider(!showAddProvider)}
                >
                  {showAddProvider ? "Cancel" : "+ Add New Provider"}
                </Button>
              </div>

              {showAddProvider && (
                <div style={{ 
                  padding: "1rem", 
                  backgroundColor: "#f0f9ff", 
                  borderRadius: "0.5rem",
                  border: "1px solid #3b82f6",
                  marginBottom: "1rem"
                }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
                    Add New Insurance Provider
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
                        Provider Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Blue Cross Blue Shield"
                        value={newProvider.name}
                        onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                        style={{ 
                          width: "100%",
                          padding: "0.75rem", 
                          border: "1px solid #d1d5db", 
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
                        Provider Code *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., BCBS"
                        value={newProvider.code}
                        onChange={(e) => setNewProvider({ ...newProvider, code: e.target.value.toUpperCase() })}
                        style={{ 
                          width: "100%",
                          padding: "0.75rem", 
                          border: "1px solid #d1d5db", 
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
                        Type *
                      </label>
                      <select
                        value={newProvider.type}
                        onChange={(e) => setNewProvider({ ...newProvider, type: e.target.value })}
                        style={{ 
                          width: "100%",
                          padding: "0.75rem", 
                          border: "1px solid #d1d5db", 
                          borderRadius: "0.5rem",
                          fontSize: "0.875rem"
                        }}
                      >
                        <option value="Private">Private</option>
                        <option value="Government">Government</option>
                        <option value="HMO">HMO</option>
                        <option value="Military">Military</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <Button type="button" size="sm" onClick={handleAddProvider}>
                      Add Provider
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => setShowAddProvider(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                <Select
                  name="insuranceProvider"
                  label="Insurance Provider"
                  options={[
                    { label: "No Insurance", value: "" },
                    ...activeProviders.map(provider => ({
                      label: `${provider.name} (${provider.code})`,
                      value: provider.id
                    }))
                  ]}
                />
                <Input name="policyNumber" label="Policy Number" placeholder="Enter policy number" />
                <Input name="groupNumber" label="Group Number" placeholder="Enter group number" />
                <Input name="subscriberName" label="Subscriber Name" placeholder="Primary insured person" />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                <Input name="relationshipToSubscriber" label="Relationship to Subscriber" placeholder="Self, Spouse, Child, etc." />
                <Input name="copayAmount" label="Copay Amount" type="number" placeholder="0.00" />
                <Input name="deductibleAmount" label="Deductible Amount" type="number" placeholder="0.00" />
                <Input name="insuranceEffectiveDate" label="Insurance Effective Date" type="date" />
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
                Emergency Contact Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                <Input name="emergencyContactName" label="Emergency Contact Name" required placeholder="Full name" />
                <Input name="emergencyContactPhone" label="Emergency Contact Phone" required placeholder="(555) 123-4567" />
                <Input name="emergencyContactRelationship" label="Relationship" required placeholder="Spouse, Parent, Sibling, etc." />
                <Input name="emergencyContactAddress" label="Emergency Contact Address" placeholder="Complete address" />
              </div>
            </Card>

            {/* Medical History */}
            <Card>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
                Medical History & Preferences
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                <Input name="allergies" label="Known Allergies" placeholder="List any known allergies" />
                <Input name="currentMedications" label="Current Medications" placeholder="List current medications" />
                <Input name="medicalConditions" label="Medical Conditions" placeholder="List existing conditions" />
                <Input name="preferredLanguage" label="Preferred Language" placeholder="English, Spanish, etc." />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                <Input name="primaryPhysician" label="Primary Care Physician" placeholder="Doctor's name" />
                <Input name="referringPhysician" label="Referring Physician" placeholder="Doctor who referred patient" />
                <Select
                  name="patientType"
                  label="Patient Type"
                  options={[
                    { label: "Outpatient", value: "Outpatient" },
                    { label: "Inpatient", value: "Inpatient" },
                    { label: "Emergency", value: "Emergency" },
                    { label: "Observation", value: "Observation" },
                  ]}
                />
                <Select
                  name="admissionType"
                  label="Admission Type"
                  options={[
                    { label: "Elective", value: "Elective" },
                    { label: "Emergency", value: "Emergency" },
                    { label: "Urgent", value: "Urgent" },
                    { label: "Routine", value: "Routine" },
                  ]}
                />
              </div>
            </Card>
          </Form>
        )}
      </div>
    </>
  );
}