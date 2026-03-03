import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import { useWards } from "../../../hooks/useWards";

export default function WardDetails() {
  const { id } = useParams();
  const { ward, loading, fetchWardById } = useWards();

  useEffect(() => {
    fetchWardById(id);
  }, [id]);

  const bedColumns = [
    { key: "bedNumber", label: "Bed Number" },
    { key: "patientName", label: "Patient" },
    { key: "status", label: "Status" },
    { key: "admissionDate", label: "Admission Date" },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <PageHeader title={`Ward: ${ward?.name}`} />
      <Card>
        <h3>Ward Information</h3>
        <p><strong>Type:</strong> {ward?.type}</p>
        <p><strong>Floor:</strong> {ward?.floor}</p>
        <p><strong>Total Beds:</strong> {ward?.totalBeds}</p>
        <p><strong>Available Beds:</strong> {ward?.availableBeds}</p>
        <p><strong>Head Nurse:</strong> {ward?.headNurse}</p>
      </Card>

      <Card>
        <h3>Bed Allocation</h3>
        <DataTable data={ward?.beds || []} columns={bedColumns} />
      </Card>
    </>
  );
}
