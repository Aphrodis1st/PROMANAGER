import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import DataTable from "../../components/hospital/DataTable";
import Badge from "../../components/hospital/Badge";
import Button from "../../components/hospital/Button";
import { useDepartments } from "../../hooks/useDepartments";

export default function DepartmentList() {
  const { departments, loading, deleteDepartment } = useDepartments();
  const navigate = useNavigate();

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDepartment(id);
      } catch (error) {
        alert("Failed to delete department");
      }
    }
  };

  const columns = [
    { 
      key: "name", 
      label: "Department",
      render: (row) => (
        <div>
          <div style={{ fontWeight: "600" }}>{row.name}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{row.description}</div>
        </div>
      )
    },
    { key: "code", label: "Code" },
    { key: "location", label: "Location" },
    { 
      key: "head", 
      label: "Head",
      render: (row) => row.headOfDepartment || <span style={{ color: "#9ca3af" }}>Not Assigned</span>
    },
    { 
      key: "doctors", 
      label: "Doctors",
      render: (row) => row.totalDoctors || 0
    },
    { 
      key: "nurses", 
      label: "Nurses",
      render: (row) => row.totalNurses || 0
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "danger"}>
          {row.status || "Active"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button size="sm" onClick={() => navigate(`/hospital/departments/${row.id}`)}>
            View
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate(`/hospital/departments/assign-head/${row.id}`)}>
            Assign Head
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate(`/hospital/departments/statistics/${row.id}`)}>
            Statistics
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id, row.name)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Department Management"
        action={
          <Button onClick={() => navigate("/hospital/departments/create")}>
            + Create Department
          </Button>
        }
      />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#3b82f6" }}>{departments.length}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Departments</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#10b981" }}>
              {departments.filter(d => d.status === "Active").length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Active</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#f59e0b" }}>
              {departments.reduce((sum, d) => sum + (d.totalDoctors || 0), 0)}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Doctors</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#8b5cf6" }}>
              {departments.reduce((sum, d) => sum + (d.totalNurses || 0), 0)}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Nurses</div>
          </div>
        </Card>
      </div>

      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading departments...</div>
        ) : departments.length > 0 ? (
          <DataTable
            columns={columns}
            data={departments}
            searchable
            sortable
            pagination
          />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No departments found.</p>
            <Button onClick={() => navigate("/hospital/departments/create")} style={{ marginTop: "1rem" }}>
              Create First Department
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}
