import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";

export default function HospitalReportDashboard() {
  const navigate = useNavigate();

  const reportCategories = [
    { title: "Patient Reports", path: "/hospital/reports/patients", icon: "👥", description: "Patient statistics and demographics" },
    { title: "Financial Reports", path: "/hospital/reports/financial", icon: "💰", description: "Revenue and billing analytics" },
    { title: "Department Reports", path: "/hospital/reports/departments", icon: "🏥", description: "Department performance metrics" },
    { title: "Lab Reports", path: "/hospital/reports/lab", icon: "🔬", description: "Laboratory test statistics" },
    { title: "Audit Logs", path: "/hospital/reports/audit", icon: "📋", description: "System activity and changes" },
  ];

  return (
    <>
      <PageHeader title="Hospital Reports Dashboard" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {reportCategories.map((category) => (
          <Card key={category.path} style={{ cursor: "pointer" }} onClick={() => navigate(category.path)}>
            <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: "1rem" }}>{category.icon}</div>
            <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>{category.title}</h3>
            <p style={{ textAlign: "center", color: "#666" }}>{category.description}</p>
            <Button onClick={() => navigate(category.path)} style={{ width: "100%", marginTop: "1rem" }}>
              View Report
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}
