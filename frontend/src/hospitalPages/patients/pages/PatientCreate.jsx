import React, { useState } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Input from "../../../components/hospital/Input";
import Select from "../../../components/hospital/Select";
import { usePatients } from "../../../hooks/usePatients";
import { useNavigate } from "react-router-dom";

export default function PatientCreate() {
  const { createPatient } = usePatients();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPatient(formData);
    navigate("/hospital/patients");
  };

  return (
    <>
      <PageHeader title="Register New Patient" />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <Select
            name="gender"
            label="Gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { label: "Select Gender", value: "" },
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
          />
          <Input
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <Input
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <Select
            name="bloodGroup"
            label="Blood Group"
            value={formData.bloodGroup}
            onChange={handleChange}
            options={[
              { label: "Select Blood Group", value: "" },
              { label: "A+", value: "A+" },
              { label: "A-", value: "A-" },
              { label: "B+", value: "B+" },
              { label: "B-", value: "B-" },
              { label: "O+", value: "O+" },
              { label: "O-", value: "O-" },
              { label: "AB+", value: "AB+" },
              { label: "AB-", value: "AB-" },
            ]}
          />

          <div className="flex gap-2">
            <Button type="submit">Save Patient</Button>
            <Button variant="secondary" onClick={() => navigate("/hospital/patients")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}