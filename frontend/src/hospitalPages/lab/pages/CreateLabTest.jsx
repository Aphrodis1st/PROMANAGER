import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Input from "../../../components/hospital/Input";
import Select from "../../../components/hospital/Select";
import TextArea from "../../../components/hospital/TextArea";
import Button from "../../../components/hospital/Button";
import { useLab } from "../../../hooks/useLab";
import { usePatients } from "../../../hooks/usePatients";

export default function CreateLabTest() {
  const navigate = useNavigate();
  const { createLabTest } = useLab();
  const { patients, fetchPatients } = usePatients();
  const [formData, setFormData] = useState({
    patientId: "",
    testType: "",
    priority: "Normal",
    requestedBy: "",
    notes: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createLabTest(formData);
    navigate("/hospital/lab/tests");
  };

  const testTypes = [
    "Complete Blood Count (CBC)",
    "Blood Glucose",
    "Lipid Profile",
    "Liver Function Test",
    "Kidney Function Test",
    "Thyroid Function Test",
    "Urinalysis",
    "X-Ray",
    "CT Scan",
    "MRI",
    "Ultrasound",
  ];

  return (
    <>
      <PageHeader title="Create Lab Test" />
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
            label="Test Type"
            value={formData.testType}
            onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
            required
          >
            <option value="">Select Test Type</option>
            {testTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            required
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
            <option value="Emergency">Emergency</option>
          </Select>

          <Input
            label="Requested By (Doctor)"
            value={formData.requestedBy}
            onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
            required
          />

          <TextArea
            label="Clinical Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
          />

          <Button type="submit">Create Test Request</Button>
        </form>
      </Card>
    </>
  );
}
