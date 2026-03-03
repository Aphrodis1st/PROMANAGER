import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import { useBilling } from "../../../hooks/useBilling";

export default function InsuranceClaims() {
  const navigate = useNavigate();
  const { claims, loading, fetchInsuranceClaims } = useBilling();

  useEffect(() => {
    fetchInsuranceClaims();
  }, []);

  const columns = [
    { key: "claimNumber", label: "Claim #" },
    { key: "patientName", label: "Patient" },
    { key: "insuranceProvider", label: "Provider" },
    { key: "claimAmount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "submissionDate", label: "Submitted" },
  ];

  return (
    <>
      <PageHeader title="Insurance Claims" />
      <Card>
        <p style={{ marginBottom: "1rem" }}>
          <strong>Total Claims:</strong> {claims?.length || 0} | 
          <strong style={{ color: "#ff9800", marginLeft: "1rem" }}>Pending:</strong> {claims?.filter(c => c.status === "Pending").length || 0}
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable data={claims} columns={columns} />
        )}
      </Card>
    </>
  );
}
