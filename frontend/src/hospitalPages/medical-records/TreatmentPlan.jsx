// /hospital/medical-records/TreatmentPlan.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, TextArea, Input, Select } from "../../components/hospital/Form";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";

export default function TreatmentPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addTreatmentPlan } = useMedicalRecords();

  const handleSubmit = async (values) => {
    await addTreatmentPlan(id, values);
    navigate(`/hospital/medical-records/${id}`);
  };

  return (
    <>
      <PageHeader title="Treatment & Care Plan" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <TextArea name="treatmentGoals" label="Treatment Goals" required />
          <TextArea name="therapyPlan" label="Therapy / Procedure Plan" />
          <Select
            name="careType"
            label="Care Type"
            options={[
              { label: "Inpatient", value: "Inpatient" },
              { label: "Outpatient", value: "Outpatient" },
              { label: "Rehabilitation", value: "Rehabilitation" },
            ]}
          />
          <Input name="reviewDate" type="date" label="Next Review Date" />
          <TextArea name="notes" label="Additional Notes" />
        </Form>
      </Card>
    </>
  );
}
