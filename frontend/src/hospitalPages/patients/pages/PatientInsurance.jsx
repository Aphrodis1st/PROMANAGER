import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { Form, Input, Select } from "../../../components/ui/Form";
import { usePatients } from "../../../hooks/usePatients";

export default function PatientInsurance() {
  const { id } = useParams();
  const { insurance, updateInsurance } = usePatients();

  return (
    <>
      <PageHeader title="Insurance Details" />

      <Card>
        <Badge variant="success">{insurance(id)?.status}</Badge>

        <Form initialValues={insurance(id)} onSubmit={(v) => updateInsurance(id, v)}>
          <Input name="provider" label="Insurance Provider" />
          <Input name="policyNumber" label="Policy Number" />
          <Select
            name="status"
            label="Status"
            options={[
              { label: "Active", value: "Active" },
              { label: "Expired", value: "Expired" },
            ]}
          />
        </Form>
      </Card>
    </>
  );
}