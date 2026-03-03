import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import { useLab } from "../../../hooks/useLab";

export default function PendingTests() {
  const navigate = useNavigate();
  const { pendingTests, loading, fetchPendingTests } = useLab();

  useEffect(() => {
    fetchPendingTests();
  }, []);

  const columns = [
    { key: "testId", label: "Test ID" },
    { key: "patientName", label: "Patient" },
    { key: "testType", label: "Test Type" },
    { key: "priority", label: "Priority" },
    { key: "requestDate", label: "Requested" },
    { key: "requestedBy", label: "Doctor" },
  ];

  return (
    <>
      <PageHeader title="Pending Lab Tests" />
      <Card>
        <p style={{ marginBottom: "1rem", color: "#ff9800" }}>
          <strong>{pendingTests?.length || 0}</strong> tests pending completion
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            data={pendingTests}
            columns={columns}
            onRowClick={(test) => navigate(`/hospital/lab/results/entry/${test.id}`)}
          />
        )}
      </Card>
    </>
  );
}
