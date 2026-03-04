// /hospital/medical-records/MedicalRecordList.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import DataTable from "../../components/hospital/DataTable";
import Button from "../../components/hospital/Button";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";

export default function MedicalRecordList() {
  const { records, loading } = useMedicalRecords();
  const navigate = useNavigate();

  const columns = [
    { key: "patientName", label: "Patient" },
    { key: "recordNumber", label: "Record #" },
    { key: "doctorName", label: "Primary Doctor" },
    { key: "lastVisit", label: "Last Visit" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button size="sm" onClick={() => navigate(`${row.id}`)}>
          View Record
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Electronic Medical Records"
        action={
          <Button onClick={() => navigate("create")}>
            Create Medical Record
          </Button>
        }
      />
      <Card>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ marginBottom: "1rem" }}>Medical records are patient-specific. View them from:</p>
          <Button onClick={() => navigate("/hospital/patients")}>
            Go to Patients
          </Button>
        </div>
      </Card>
    </>
  );
}
