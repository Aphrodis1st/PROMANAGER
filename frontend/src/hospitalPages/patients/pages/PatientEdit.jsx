import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Input from "../../../components/hospital/Input";
import Select from "../../../components/hospital/Select";
import { usePatients } from "../../../hooks/usePatients";

export default function PatientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient } = usePatients();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const found = patients?.find(p => p.id === id);
    if (found) {
      setFormData(found);
    }
  }, [id, patients]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updatePatient(id, formData);
    navigate(`/hospital/patients/${id}`);
  };

  if (!formData) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <PageHeader title="Edit Patient" />

      <Card>
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            name="fullName"
            label="Full Name"
            value={formData.fullName || ""}
            onChange={handleChange}
            required
          />
          <Select
            name="gender"
            label="Gender"
            value={formData.gender || ""}
            onChange={handleChange}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
          />
          <Input
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={handleChange}
          />
          <Input
            name="phone"
            label="Phone Number"
            value={formData.phone || ""}
            onChange={handleChange}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
          <Input
            name="address"
            label="Address"
            value={formData.address || ""}
            onChange={handleChange}
          />

          <div className="flex gap-2">
            <Button type="submit">Update Patient</Button>
            <Button variant="secondary" onClick={() => navigate(`/hospital/patients/${id}`)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
