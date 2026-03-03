import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useLab } from "../../../hooks/useLab";

export default function LabDashboard() {
  const navigate = useNavigate();
  const { stats, fetchLabStats } = useLab();

  useEffect(() => {
    fetchLabStats();
  }, []);

  return (
    <>
      <PageHeader title="Laboratory Dashboard" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card>
          <h3>Pending Tests</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9800" }}>{stats?.pending || 0}</p>
          <Button onClick={() => navigate("/hospital/lab/pending")}>View Pending</Button>
        </Card>
        <Card>
          <h3>Completed Today</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#4caf50" }}>{stats?.completedToday || 0}</p>
        </Card>
        <Card>
          <h3>Total Tests</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2196f3" }}>{stats?.total || 0}</p>
        </Card>
        <Card>
          <h3>Critical Results</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f44336" }}>{stats?.critical || 0}</p>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Button onClick={() => navigate("/hospital/lab/tests")}>All Tests</Button>
        <Button onClick={() => navigate("/hospital/lab/create")}>Create Test</Button>
      </div>
    </>
  );
}
