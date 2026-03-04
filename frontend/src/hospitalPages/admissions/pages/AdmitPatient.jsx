import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await admitPatient(values);
      navigate("/hospital/admissions");
    } catch (error) {
      console.error("Error admitting patient:", error);
      alert("Failed to admit patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Admit Patient" />
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Admitting patient...</div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Select
              name="patientId"
              label="Patient"
              options={patients?.map((p) => ({ label: p.fullName || p.name, value: p.id })) || []}
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
              required
            />
          </Form>
        )}
      </Card>
    </>
  );
}
