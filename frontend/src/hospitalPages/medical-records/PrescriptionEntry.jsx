// /hospital/medical-records/PrescriptionEntry.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, Input, Select, TextArea } from "../../components/hospital/Form";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";

export default function PrescriptionEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addPrescription } = useMedicalRecords();

  const handleSubmit = async (values) => {
    await addPrescription(id, values);
    navigate(`/hospital/medical-records/${id}`);
  };

  return (
    <>
      <PageHeader title="Prescription Entry" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <Input name="medicationName" label="Medication Name" required />
          <Input name="dosage" label="Dosage (e.g. 500mg)" required />
          <Input name="frequency" label="Frequency (e.g. Twice daily)" required />
          <Input name="duration" label="Duration (e.g. 7 days)" required />
          <Select
            name="route"
            label="Administration Route"
            options={[
              { label: "Oral", value: "Oral" },
              { label: "IV", value: "IV" },
              { label: "IM", value: "IM" },
              { label: "Topical", value: "Topical" },
            ]}
          />
          <TextArea name="instructions" label="Special Instructions" />
        </Form>
      </Card>
    </>
  );
}
