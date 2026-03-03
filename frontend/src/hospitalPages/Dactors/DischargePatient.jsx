import React, { useState } from "react";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import Input from "../../components/hospital/Input";
import TextArea from "../../components/hospital/TextArea";

export default function DischargePatient() {
  const [formData, setFormData] = useState({
    dischargeDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Discharge patient:", formData);
    alert("Patient discharged successfully!");
  };

  return (
    <>
      <PageHeader title="Discharge Patient" />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="dischargeDate"
            label="Discharge Date"
            type="date"
            value={formData.dischargeDate}
            onChange={handleChange}
            required
          />
          <TextArea
            name="notes"
            label="Discharge Notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
          />
          <Button type="submit">Discharge Patient</Button>
        </form>
      </Card>
    </>
  );
}
