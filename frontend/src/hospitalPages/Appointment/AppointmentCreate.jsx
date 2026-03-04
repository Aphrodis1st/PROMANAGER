import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, Input, Select } from "../../components/hospital/Form";
import { useAppointments } from "../../hooks/useAppointments";
import { useDoctors } from "../../hooks/useDoctors";
import { usePatients } from "../../hooks/usePatients";

export default function AppointmentCreate() {
  const { createAppointment } = useAppointments();
  const { doctors } = useDoctors();
  const { patients } = usePatients();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [defaultPatientId, setDefaultPatientId] = useState("");
  const [defaultDoctorId, setDefaultDoctorId] = useState("");

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    const doctorId = searchParams.get("doctorId");
    if (patientId) setDefaultPatientId(patientId);
    if (doctorId) setDefaultDoctorId(doctorId);
  }, [searchParams]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log("Creating appointment with:", values);
      await createAppointment(values);
      alert("Appointment booked successfully!");
      navigate("/hospital/appointments");
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Book Appointment" />
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Booking appointment...</div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Select
              name="patientId"
              label="Patient"
              defaultValue={defaultPatientId}
              options={patients?.map((p) => ({
                label: p.fullName || p.name,
                value: p.id,
              })) || []}
              required
            />
            <Select
              name="doctorId"
              label="Doctor"
              defaultValue={defaultDoctorId}
              options={doctors?.map((d) => ({
                label: `Dr. ${d.fullName || d.name} - ${d.specialization}`,
                value: d.id,
              })) || []}
              required
            />
            <Input name="date" label="Appointment Date" type="date" required />
            <Input name="time" label="Appointment Time" type="time" required />
            <Input name="reason" label="Reason for Visit" />
          </Form>
        )}
      </Card>
    </>
  );
}
