import React, { useState } from "react";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import Input from "../../components/hospital/Input";
import Select from "../../components/hospital/Select";
import { usePatients } from "../../hooks/usePatients";

export default function AdmitPatient() {
  const { patients } = usePatients();
  const [formData, setFormData] = useState({
    patientId: "",
    admitDate: "",
    ward: "",
    bed: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admit patient:", formData);
    alert("Patient admitted successfully!");
  };

  return (
    <>
      <PageHeader title="Admit Patient" />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            name="patientId"
            label="Patient"
            value={formData.patientId}
            onChange={handleChange}
            options={[
              { label: "Select Patient", value: "" },
              ...(patients?.map((p) => ({
                label: p.fullName || p.name,
                value: p.id,
              })) || []),
            ]}
            required
          />
          <Input
            name="admitDate"
            label="Admit Date"
            type="date"
            value={formData.admitDate}
            onChange={handleChange}
            required
          />
          <Input
            name="ward"
            label="Ward"
            value={formData.ward}
            onChange={handleChange}
          />
          <Input
            name="bed"
            label="Bed Number"
            value={formData.bed}
            onChange={handleChange}
          />
          <Button type="submit">Admit Patient</Button>
        </form>
      </Card>
    </>
  );
}
