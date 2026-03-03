import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Input from "../../../components/hospital/Input";
import Select from "../../../components/hospital/Select";
import Button from "../../../components/hospital/Button";
import { useWards } from "../../../hooks/useWards";
import { usePatients } from "../../../hooks/usePatients";

export default function BedAllocation() {
  const navigate = useNavigate();
  const { wards, allocateBed, fetchWards } = useWards();
  const { patients, fetchPatients } = usePatients();
  const [formData, setFormData] = useState({
    patientId: "",
    wardId: "",
    bedNumber: "",
    admissionDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchWards();
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await allocateBed(formData);
    navigate("/hospital/wards");
  };

  return (
    <>
      <PageHeader title="Bed Allocation" />
      <Card>
        <form onSubmit={handleSubmit}>
          <Select
            label="Patient"
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            required
          >
            <option value="">Select Patient</option>
            {patients?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.mrn}
              </option>
            ))}
          </Select>

          <Select
            label="Ward"
            value={formData.wardId}
            onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
            required
          >
            <option value="">Select Ward</option>
            {wards?.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} - {w.availableBeds} beds available
              </option>
            ))}
          </Select>

          <Input
            label="Bed Number"
            value={formData.bedNumber}
            onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
            required
          />

          <Input
            type="date"
            label="Admission Date"
            value={formData.admissionDate}
            onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
            required
          />

          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <Button type="submit">Allocate Bed</Button>
        </form>
      </Card>
    </>
  );
}
