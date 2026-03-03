import React, { useEffect } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { useReports } from "../../../hooks/useReports";

export default function PatientReports() {
  const { patientStats, fetchPatientReports } = useReports();

  useEffect(() => {
    fetchPatientReports();
  }, []);

  return (
    <>
      <PageHeader title="Patient Reports" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card>
          <h3>Total Patients</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2196f3" }}>{patientStats?.total || 0}</p>
        </Card>
        <Card>
          <h3>New This Month</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#4caf50" }}>{patientStats?.newThisMonth || 0}</p>
        </Card>
        <Card>
          <h3>Active Patients</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9800" }}>{patientStats?.active || 0}</p>
        </Card>
        <Card>
          <h3>Admitted</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f44336" }}>{patientStats?.admitted || 0}</p>
        </Card>
      </div>

      <Card>
        <h3>Age Distribution</h3>
        {patientStats?.ageDistribution?.map((age) => (
          <div key={age.range} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <span>{age.range}</span>
            <strong>{age.count} patients</strong>
          </div>
        ))}
      </Card>

      <Card>
        <h3>Gender Distribution</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", textAlign: "center" }}>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{patientStats?.gender?.male || 0}</p>
            <p>Male</p>
          </div>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{patientStats?.gender?.female || 0}</p>
            <p>Female</p>
          </div>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{patientStats?.gender?.other || 0}</p>
            <p>Other</p>
          </div>
        </div>
      </Card>
    </>
  );
}
