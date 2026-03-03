import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import Input from "../../components/hospital/Input";
import Select from "../../components/hospital/Select";
import { useAppointments } from "../../hooks/useAppointments";
import { useDoctors } from "../../hooks/useDoctors";
import { usePatients } from "../../hooks/usePatients";

export default function AppointmentCreate() {
  const { createAppointment } = useAppointments();
  const { doctors } = useDoctors();
  const { patients } = usePatients();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAppointment(formData);
    navigate("/hospital/appointments");
  };

  return (
    <>
      <PageHeader title="Book Appointment" />

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

          <Select
            name="doctorId"
            label="Doctor"
            value={formData.doctorId}
            onChange={handleChange}
            options={[
              { label: "Select Doctor", value: "" },
              ...(doctors?.map((d) => ({
                label: d.fullName || d.name,
                value: d.id,
              })) || []),
            ]}
            required
          />

          <Input
            name="date"
            label="Appointment Date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <Input
            name="time"
            label="Appointment Time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <Input
            name="reason"
            label="Reason for Visit"
            value={formData.reason}
            onChange={handleChange}
          />

          <div className="flex gap-2">
            <Button type="submit">Book Appointment</Button>
            <Button variant="secondary" onClick={() => navigate("/hospital/appointments")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
