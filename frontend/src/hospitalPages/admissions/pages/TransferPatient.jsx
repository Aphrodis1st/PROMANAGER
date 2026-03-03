import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { Form, Input, Select, TextArea } from "../../../components/hospital/Form";
import { useAdmissions } from "../../../hooks/useAdmissions";

export default function TransferPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transferPatient } = useAdmissions();

  const handleSubmit = async (values) => {
    await transferPatient(id, values);
    navigate(`/hospital/admissions/${id}`);
  };

  return (
    <>
      <PageHeader title="Transfer Patient" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <Input name="transferDate" type="date" label="Transfer Date" required />
          <Select
            name="transferType"
            label="Transfer Type"
            options={[
              { label: "Ward Transfer", value: "Ward" },
              { label: "Hospital Transfer", value: "Hospital" },
              { label: "ICU Transfer", value: "ICU" },
            ]}
            required
          />
          <Input name="newWard" label="New Ward" required />
          <Input name="newBed" label="New Bed Number" required />
          <TextArea name="transferReason" label="Reason for Transfer" required />
          <Input name="transferredBy" label="Transferred By (Doctor)" required />
        </Form>
      </Card>
    </>
  );
}
