import React, { useEffect } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { useReports } from "../../../hooks/useReports";

export default function LabReports() {
  const { labStats, fetchLabReports } = useReports();

  useEffect(() => {
    fetchLabReports();
  }, []);

  return (
    <>
      <PageHeader title="Laboratory Reports" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card>
          <h3>Total Tests</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2196f3" }}>{labStats?.totalTests || 0}</p>
        </Card>
        <Card>
          <h3>Completed Today</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#4caf50" }}>{labStats?.completedToday || 0}</p>
        </Card>
        <Card>
          <h3>Pending Tests</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9800" }}>{labStats?.pending || 0}</p>
        </Card>
        <Card>
          <h3>Critical Results</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f44336" }}>{labStats?.critical || 0}</p>
        </Card>
      </div>

      <Card>
        <h3>Test Type Distribution</h3>
        {labStats?.testTypes?.map((test) => (
          <div key={test.type} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <span>{test.type}</span>
            <strong>{test.count} tests</strong>
          </div>
        ))}
      </Card>

      <Card>
        <h3>Average Turnaround Time</h3>
        <p style={{ fontSize: "1.5rem", textAlign: "center", padding: "2rem" }}>
          <strong>{labStats?.avgTurnaroundTime || 0}</strong> hours
        </p>
      </Card>
    </>
  );
}
