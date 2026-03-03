import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { useDoctors } from "../../hooks/useDoctors";

export default function DoctorProfile() {
  const { id } = useParams();
  const { getDoctorById } = useDoctors();
  const doctor = getDoctorById(id);

  return (
    <>
      <PageHeader title="Doctor Profile" />
      <Card>
        <h2 className="text-xl font-bold">{doctor?.fullName}</h2>
        <p>Specialization: {doctor?.specialization}</p>
        <p>Department: {doctor?.department}</p>
        <p>Email: {doctor?.email}</p>
        <p>Phone: {doctor?.phone}</p>
        <p>Experience: {doctor?.experience} years</p>
        <p>Qualification: {doctor?.qualification}</p>
        <p>Status: {doctor?.status}</p>
      </Card>
    </>
  );
}
