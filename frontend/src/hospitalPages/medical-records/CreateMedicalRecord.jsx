// /hospital/medical-records/CreateMedicalRecord.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, Select, Input } from "../../components/hospital/Form";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";

export default function CreateMedicalRecord() {
  const { createRecord } = useMedicalRecords();
  const { patients } = usePatients();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await createRecord(values);
    navigate("/hospital/medical-records");
  };

  return (
    <>
      <PageHeader title="Create Medical Record" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <Select
            name="patientId"
            label="Patient"
            options={patients.map(p => ({
              label: p.fullName,
              value: p.id,
            }))}
            required
          />
          <Input name="recordNumber" label="Record Number" required />
          <Input name="primaryDoctor" label="Primary Doctor" required />
        </Form>
      </Card>
    </>
  );
}
