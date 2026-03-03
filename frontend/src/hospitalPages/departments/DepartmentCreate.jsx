// /hospital/departments/DepartmentCreate.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, Input, TextArea, Select } from "../../components/hospital/Form";
import { useDepartments } from "../../hooks/useDepartments";

export default function DepartmentCreate() {
  const { createDepartment } = useDepartments();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await createDepartment(values);
    navigate("/hospital/departments");
  };

  return (
    <>
      <PageHeader title="Create New Department" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <Input name="name" label="Department Name" required />
          <Input name="code" label="Department Code" required />
          <Input name="location" label="Location / Floor" required />
          <TextArea name="description" label="Department Description" />
          <Select
            name="status"
            label="Status"
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
            required
          />
        </Form>
      </Card>
    </>
  );
}
