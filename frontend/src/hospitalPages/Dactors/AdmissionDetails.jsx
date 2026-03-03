import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { useAdmissions } from "../../hooks/useAdmissions";

export default function AdmissionDetails() {
  const { id } = useParams();
  const { getAdmissionById } = useAdmissions();
  const admission = getAdmissionById(id);

  return (
    <>
      <PageHeader title="Admission Details" />
      <Card>
        <p><strong>Patient:</strong> {admission?.patientName}</p>
        <p><strong>Ward:</strong> {admission?.ward}</p>
        <p><strong>Bed:</strong> {admission?.bed}</p>
        <p><strong>Admit Date:</strong> {admission?.admitDate}</p>
        <p><strong>Status:</strong> {admission?.status}</p>
        <p><strong>Notes:</strong> {admission?.notes}</p>
      </Card>
    </>
  );
}
