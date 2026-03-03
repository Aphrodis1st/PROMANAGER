// /hospital/medical-records/DiagnosisEntry.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, Input, Select, TextArea } from "../../components/hospital/Form";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";

export default function DiagnosisEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addDiagnosis } = useMedicalRecords();

  const handleSubmit = async (values) => {
    await addDiagnosis(id, values);
    navigate(`/hospital/medical-records/${id}`);
  };

  return (
    <>
      <PageHeader title="Add Diagnosis (ICD-Based)" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <Input name="code" label="ICD-10 Code" required />
          <Input name="description" label="Diagnosis Description" required />
          <Select
            name="severity"
            label="Severity"
            options={[
              { label: "Mild", value: "Mild" },
              { label: "Moderate", value: "Moderate" },
              { label: "Severe", value: "Severe" },
            ]}
          />
          <Select
            name="status"
            label="Status"
            options={[
              { label: "Active", value: "Active" },
              { label: "Chronic", value: "Chronic" },
              { label: "Resolved", value: "Resolved" },
            ]}
          />
          <TextArea name="clinicalNotes" label="Clinical Notes" />
        </Form>
      </Card>
    </>
  );
}
