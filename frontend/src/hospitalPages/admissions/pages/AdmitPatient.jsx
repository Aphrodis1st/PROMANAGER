import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { Form, Input, Select } from "../../../components/hospital/Form";
import { useAdmissions } from "../../../hooks/useAdmissions";
import { usePatients } from "../../../hooks/usePatients";

export default function AdmitPatient() {
  const navigate = useNavigate();
  const { admitPatient } = useAdmissions();
  const { patients } = usePatients();

  const handleSubmit = async (values) => {
    await admitPatient(values);
    navigate("/hospital/admissions");
  };

  return (
    <>
      <PageHeader title="Admit Patient" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <Select
            name="patientId"
            label="Patient"
            options={patients?.map((p) => ({ label: p.fullName || p.name, value: p.id }))}
            required
          />
          <Input name="admitDate" type="date" label="Admit Date" required />
          <Input name="ward" label="Ward" required />
          <Input name="bed" label="Bed Number" required />
          <Input name="reason" label="Reason for Admission" required />
          <Select
            name="admissionType"
            label="Admission Type"
            options={[
              { label: "Emergency", value: "Emergency" },
              { label: "Planned", value: "Planned" },
              { label: "Transfer", value: "Transfer" },
            ]}
          />
        </Form>
      </Card>
    </>
  );
}
