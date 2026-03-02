import React from "react";
import { useParams } from "react-router-dom";
import { usePatients } from "../../../hooks/usePatients";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Badge from "../../../components/hospital/Badge";

export default function PatientDetails() {
  const { id } = useParams();
  const { getPatient } = usePatients();
  const patient = getPatient(id);

  return (
    <>
      <PageHeader title="Patient Details" />

      <Card>
        <h3>{patient.fullName}</h3>
        <p>ID: {patient.patientId}</p>
        <p>Gender: {patient.gender}</p>
        <p>Phone: {patient.phone}</p>
        <Badge>{patient.status}</Badge>
      </Card>
    </>
  );
}