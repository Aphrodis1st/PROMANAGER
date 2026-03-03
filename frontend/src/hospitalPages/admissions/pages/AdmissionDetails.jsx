import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useAdmissions } from "../../../hooks/useAdmissions";

export default function AdmissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admission, fetchAdmissionById } = useAdmissions();

  useEffect(() => {
    if (id) fetchAdmissionById(id);
  }, [id]);

  return (
    <>
      <PageHeader title="Admission Details" />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <strong>Patient:</strong> {admission?.patientName}
          </div>
          <div>
            <strong>Ward:</strong> {admission?.ward}
          </div>
          <div>
            <strong>Bed:</strong> {admission?.bed}
          </div>
          <div>
            <strong>Admit Date:</strong> {admission?.admitDate}
          </div>
          <div>
            <strong>Status:</strong> {admission?.status}
          </div>
          <div>
            <strong>Admission Type:</strong> {admission?.admissionType}
          </div>
        </div>
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <Button onClick={() => navigate(`/hospital/admissions/${id}/discharge`)}>
            Discharge Patient
          </Button>
          <Button onClick={() => navigate(`/hospital/admissions/${id}/transfer`)}>
            Transfer Patient
          </Button>
        </div>
      </Card>
    </>
  );
}
