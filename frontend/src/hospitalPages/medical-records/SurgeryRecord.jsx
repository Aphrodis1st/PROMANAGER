// /hospital/medical-records/SurgeryRecord.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, Input, TextArea, Select } from "../../components/hospital/Form";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";

export default function SurgeryRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addSurgeryRecord } = useMedicalRecords();

  const handleSubmit = async (values) => {
    await addSurgeryRecord(id, values);
    navigate(`/hospital/medical-records/${id}`);
  };

  return (
    <>
      <PageHeader title="Surgery Documentation" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <Input name="procedureName" label="Procedure Name" required />
          <Input name="surgeon" label="Lead Surgeon" required />
          <Input name="assistant" label="Assistant Surgeon" />
          <Input name="anesthesiologist" label="Anesthesiologist" />
          <Input name="surgeryDate" type="date" label="Surgery Date" required />
          <Select
            name="anesthesiaType"
            label="Anesthesia Type"
            options={[
              { label: "General", value: "General" },
              { label: "Local", value: "Local" },
              { label: "Regional", value: "Regional" },
            ]}
          />
          <TextArea name="preOpDiagnosis" label="Pre-Op Diagnosis" />
          <TextArea name="postOpDiagnosis" label="Post-Op Diagnosis" />
          <TextArea name="operativeFindings" label="Operative Findings" />
          <TextArea name="complications" label="Complications (if any)" />
          <TextArea name="postOpPlan" label="Post-Operative Plan" />
        </Form>
      </Card>
    </>
  );
}
