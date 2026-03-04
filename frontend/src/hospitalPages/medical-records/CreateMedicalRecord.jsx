import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, Select, Input } from "../../components/hospital/Form";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";

export default function CreateMedicalRecord() {
  const { createRecord } = useMedicalRecords();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [defaultPatientId, setDefaultPatientId] = useState("");

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    if (patientId) setDefaultPatientId(patientId);
  }, [searchParams]);

  const handleSubmit = async (values) => {
    try {
      await createRecord(values);
      alert("Medical record created successfully!");
      navigate("/hospital/medical-records");
    } catch (error) {
      console.error("Error creating medical record:", error);
      alert("Failed to create medical record. Please try again.");
    }
  };

  return (
    <>
      <PageHeader title="Create Medical Record" />
      <Card>
        <Form onSubmit={handleSubmit}>
          <Select
            name="patientId"
            label="Patient"
            defaultValue={defaultPatientId}
            options={patients.map(p => ({
              label: p.fullName,
              value: p.id,
            }))}
            required
          />
          <Select
            name="doctorId"
            label="Primary Doctor"
            options={doctors.map(d => ({
              label: `Dr. ${d.fullName || d.name}`,
              value: d.id,
            }))}
            required
          />
          <Input name="recordNumber" label="Record Number" required />
        </Form>
      </Card>
    </>
  );
}
