import React, { useState } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { Form, Input, Select } from "../../../components/hospital/Form";
import { usePatients } from "../../../hooks/usePatients";
import { useNavigate } from "react-router-dom";

export default function PatientCreate() {
  const { createPatient } = usePatients();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createPatient(values);
      navigate("/hospital/patients");
    } catch (error) {
      console.error("Error creating patient:", error);
      alert("Failed to create patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Register New Patient" />
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Saving patient...</div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Input name="fullName" label="Full Name" required />
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
            <Input name="phone" label="Phone Number" required />
            <Input name="email" label="Email" type="email" />
            <Input name="address" label="Address" />
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
          </Form>
        )}
      </Card>
    </>
  );
}