import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useLab } from "../../../hooks/useLab";

export default function LabResultsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { test, loading, fetchLabTestById } = useLab();

  useEffect(() => {
    fetchLabTestById(id);
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <PageHeader title="Lab Test Results" />
      <Card>
        <h3>Patient Information</h3>
        <p><strong>Name:</strong> {test?.patientName}</p>
        <p><strong>MRN:</strong> {test?.patientMRN}</p>
        <p><strong>Age/Gender:</strong> {test?.patientAge} / {test?.patientGender}</p>
      </Card>

      <Card>
        <h3>Test Details</h3>
        <p><strong>Test ID:</strong> {test?.testId}</p>
        <p><strong>Test Type:</strong> {test?.testType}</p>
        <p><strong>Requested By:</strong> {test?.requestedBy}</p>
        <p><strong>Request Date:</strong> {test?.requestDate}</p>
        <p><strong>Completion Date:</strong> {test?.completionDate}</p>
        <p><strong>Status:</strong> <span style={{ color: test?.status === "Completed" ? "green" : "orange" }}>{test?.status}</span></p>
      </Card>

      <Card>
        <h3>Results</h3>
        <div style={{ whiteSpace: "pre-wrap", padding: "1rem", background: "#f5f5f5", borderRadius: "4px" }}>
          {test?.results || "No results available"}
        </div>
        <p style={{ marginTop: "1rem" }}><strong>Interpretation:</strong> <span style={{ color: test?.interpretation === "Critical" ? "red" : test?.interpretation === "Abnormal" ? "orange" : "green" }}>{test?.interpretation}</span></p>
        <p><strong>Performed By:</strong> {test?.performedBy}</p>
        <p><strong>Verified By:</strong> {test?.verifiedBy}</p>
        {test?.remarks && <p><strong>Remarks:</strong> {test?.remarks}</p>}
      </Card>

      <div style={{ display: "flex", gap: "1rem" }}>
        <Button onClick={() => navigate("/hospital/lab/tests")}>Back to Tests</Button>
        {test?.status !== "Completed" && (
          <Button onClick={() => navigate(`/hospital/lab/results/entry/${id}`)}>Enter Results</Button>
        )}
      </div>
    </>
  );
}
