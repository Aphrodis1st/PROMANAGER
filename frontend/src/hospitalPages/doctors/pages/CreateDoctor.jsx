import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { Form, Input, Select } from "../../../components/hospital/Form";
import { useDoctors } from "../../../hooks/useDoctors";
import { getDepartmentOptions } from "../../../constants/hospitalDepartments";

export default function CreateDoctor() {
  const navigate = useNavigate();
  const { createDoctor } = useDoctors();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createDoctor(values);
      alert("Doctor created successfully!");
      navigate("/hospital/doctors");
    } catch (error) {
      console.error("Error creating doctor:", error);
      alert("Failed to create doctor. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Add New Doctor" />
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Saving doctor...</div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Input name="fullName" label="Full Name" required />
            <Input name="email" type="email" label="Email" required />
            <Input name="phone" label="Phone Number" required />
            <Select
              name="department"
              label="Department"
              options={getDepartmentOptions()}
              required
            />
            <Input name="specialization" label="Specialization" required />
            <Input name="qualification" label="Qualification" required />
            <Input name="experience" type="number" label="Years of Experience" required />
            <Input name="licenseNumber" label="Medical License Number" required />
            <Select
              name="status"
              label="Status"
              options={[
                { label: "Active", value: "Active" },
                { label: "On Leave", value: "On Leave" },
                { label: "Inactive", value: "Inactive" },
              ]}
              required
            />
          </Form>
        )}
      </Card>
    </>
  );
}
