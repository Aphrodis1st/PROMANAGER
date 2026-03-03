import React, { useEffect } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import { useReports } from "../../../hooks/useReports";

export default function DepartmentReports() {
  const { departmentStats, fetchDepartmentReports } = useReports();

  useEffect(() => {
    fetchDepartmentReports();
  }, []);

  const columns = [
    { key: "name", label: "Department" },
    { key: "patients", label: "Patients" },
    { key: "doctors", label: "Doctors" },
    { key: "appointments", label: "Appointments" },
    { key: "revenue", label: "Revenue" },
    { key: "occupancy", label: "Occupancy %" },
  ];

  return (
    <>
      <PageHeader title="Department Reports" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card>
          <h3>Total Departments</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2196f3" }}>{departmentStats?.total || 0}</p>
        </Card>
        <Card>
          <h3>Active Doctors</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#4caf50" }}>{departmentStats?.totalDoctors || 0}</p>
        </Card>
        <Card>
          <h3>Total Patients</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9800" }}>{departmentStats?.totalPatients || 0}</p>
        </Card>
        <Card>
          <h3>Avg Occupancy</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#9c27b0" }}>{departmentStats?.avgOccupancy || 0}%</p>
        </Card>
      </div>

      <Card>
        <h3>Department Performance</h3>
        <DataTable data={departmentStats?.departments || []} columns={columns} />
      </Card>
    </>
  );
}
