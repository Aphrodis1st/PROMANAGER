import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import { useAdmissions } from "../../../hooks/useAdmissions";

export default function AdmissionList() {
  const navigate = useNavigate();
  const { admissions, loading, fetchAdmissions } = useAdmissions();

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const columns = [
    { key: "patientName", label: "Patient" },
    { key: "ward", label: "Ward" },
    { key: "bed", label: "Bed" },
    { key: "admitDate", label: "Admitted On" },
    { key: "status", label: "Status" },
  ];

  return (
    <>
      <PageHeader title="Hospital Admissions" />
      <Card>
        <div style={{ marginBottom: "1rem" }}>
          <Button onClick={() => navigate("/hospital/admissions/admit")}>
            Admit Patient
          </Button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            data={admissions}
            columns={columns}
            onRowClick={(admission) => navigate(`/hospital/admissions/${admission.id}`)}
          />
        )}
      </Card>
    </>
  );
}
