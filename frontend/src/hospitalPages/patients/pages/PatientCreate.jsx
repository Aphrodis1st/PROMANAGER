import React from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { Form, Input, Select, DatePicker } from "../../../components/hospital/Form";
import Button from "../../../components/hospital/Button";
import { usePatients } from "../../../hooks/usePatients";
import { useNavigate } from "react-router-dom";

export default function PatientCreate() {
  const { createPatient } = usePatients();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await createPatient(values);
    navigate("/hospital/patients");
  };

  return (
    <>
      <PageHeader title="Register Patient" />

      <Card>
        <Form onSubmit={handleSubmit}>
          <Input name="fullName" label="Full Name" required />
          <Select
            name="gender"
            label="Gender"
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
          />
          <DatePicker name="dateOfBirth" label="Date of Birth" />
          <Input name="phone" label="Phone Number" />
          <Input name="email" label="Email" />

          <Button type="submit">Save Patient</Button>
        </Form>
      </Card>
    </>
  );
}