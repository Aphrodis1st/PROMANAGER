import React, { useState } from "react";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import Input from "../../components/hospital/Input";

export default function DoctorSpecialization() {
  const [specialization, setSpecialization] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Update specialization:", specialization);
    alert("Specialization updated!");
  };

  return (
    <>
      <PageHeader title="Doctor Specializations" />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="specialization"
            label="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="e.g., Cardiology, Neurology"
          />
          <Button type="submit">Update Specialization</Button>
        </form>
      </Card>
    </>
  );
}
