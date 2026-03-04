import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useDoctors } from "../../../hooks/useDoctors";

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors, fetchDoctorById } = useDoctors();
  const [doctor, setDoctor] = React.useState(null);

  useEffect(() => {
    if (id && doctors.length > 0) {
      const found = doctors.find(d => d.id === id);
      setDoctor(found);
    }
  }, [id, doctors]);

  if (!doctor) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>Loading doctor profile...</div>;
  }

  return (
    <>
      <PageHeader 
        title="Doctor Profile"
        action={
          <Button onClick={() => navigate(`/hospital/doctors/${id}/edit`)}>
            Edit Profile
          </Button>
        }
      />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <strong>Full Name:</strong> {doctor?.fullName}
          </div>
          <div>
            <strong>Specialization:</strong> {doctor?.specialization}
          </div>
          <div>
            <strong>Department:</strong> {doctor?.department}
          </div>
          <div>
            <strong>Email:</strong> {doctor?.email}
          </div>
          <div>
            <strong>Phone:</strong> {doctor?.phone}
          </div>
          <div>
            <strong>Experience:</strong> {doctor?.experience} years
          </div>
          <div>
            <strong>Qualification:</strong> {doctor?.qualification}
          </div>
          <div>
            <strong>License Number:</strong> {doctor?.licenseNumber}
          </div>
          <div>
            <strong>Status:</strong> {doctor?.status}
          </div>
        </div>
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <Button onClick={() => navigate(`/hospital/doctors/${id}/schedule`)}>
            View Schedule
          </Button>
          <Button onClick={() => navigate(`/hospital/appointments/create?doctorId=${id}`)}>
            Book Appointment
          </Button>
        </div>
      </Card>
    </>
  );
}
