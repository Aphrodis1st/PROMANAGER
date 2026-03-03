import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import { useLab } from "../../../hooks/useLab";

export default function LabTestList() {
  const navigate = useNavigate();
  const { tests, loading, fetchLabTests } = useLab();

  useEffect(() => {
    fetchLabTests();
  }, []);

  const columns = [
    { key: "testId", label: "Test ID" },
    { key: "patientName", label: "Patient" },
    { key: "testType", label: "Test Type" },
    { key: "status", label: "Status" },
    { key: "requestDate", label: "Requested" },
    { key: "completionDate", label: "Completed" },
  ];

  return (
    <>
      <PageHeader title="Laboratory Tests" />
      <Card>
        <div style={{ marginBottom: "1rem" }}>
          <Button onClick={() => navigate("/hospital/lab/create")}>Create New Test</Button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            data={tests}
            columns={columns}
            onRowClick={(test) => navigate(`/hospital/lab/results/${test.id}`)}
          />
        )}
      </Card>
    </>
  );
}
