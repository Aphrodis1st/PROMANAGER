import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, Input, TextArea, Select } from "../../components/hospital/Form";
import Button from "../../components/hospital/Button";
import { useDepartments } from "../../hooks/useDepartments";

export default function DepartmentCreate() {
  const { createDepartment } = useDepartments();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createDepartment({
        ...values,
        totalDoctors: 0,
        totalNurses: 0,
        totalStaff: 0,
        createdAt: new Date().toISOString()
      });
      alert("Department created successfully!");
      navigate("/hospital/departments");
    } catch (error) {
      console.error("Error creating department:", error);
      alert("Failed to create department. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Create New Department"
        action={
          <Button variant="secondary" onClick={() => navigate("/hospital/departments")}>
            Cancel
          </Button>
        }
      />
      
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Creating department...</div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Input name="name" label="Department Name" placeholder="e.g., Cardiology" required />
              <Input name="code" label="Department Code" placeholder="e.g., CARD" required />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Input name="location" label="Location / Floor" placeholder="e.g., Floor 3, Wing A" required />
              <Input name="contact" label="Contact Number" placeholder="e.g., +1234567890" />
            </div>

            <TextArea name="description" label="Department Description" rows={3} placeholder="Brief description of the department..." />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Input name="numberOfBeds" label="Number of Beds" type="number" placeholder="0" />
              <Input name="operatingHours" label="Operating Hours" placeholder="e.g., 24/7 or 8AM-6PM" />
            </div>

            <Select
              name="status"
              label="Status"
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              required
            />

            <TextArea name="servicesOffered" label="Services Offered" rows={2} placeholder="List of services provided by this department..." />
          </Form>
        )}
      </Card>
    </>
  );
}
