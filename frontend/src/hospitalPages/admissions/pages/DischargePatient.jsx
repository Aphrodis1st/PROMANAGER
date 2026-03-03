import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { Form, Input, TextArea, Select } from "../../../components/hospital/Form";
import { useAdmissions } from "../../../hooks/useAdmissions";

export default function DischargePatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dischargePatient } = useAdmissions();

  const handleSubmit = async (values) => {
    await dischargePatient(id, values);
    navigate("/hospital/admissions");
  };

  return (
    <>
      <PageHeader title="Discharge Patient" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <Input name="dischargeDate" type="date" label="Discharge Date" required />
          <Select
            name="dischargeType"
            label="Discharge Type"
            options={[
              { label: "Normal", value: "Normal" },
              { label: "Against Medical Advice", value: "AMA" },
              { label: "Transfer", value: "Transfer" },
              { label: "Deceased", value: "Deceased" },
            ]}
            required
          />
          <TextArea name="dischargeSummary" label="Discharge Summary" required />
          <TextArea name="followUpInstructions" label="Follow-up Instructions" />
          <Input name="followUpDate" type="date" label="Follow-up Date" />
        </Form>
      </Card>
    </>
  );
}
