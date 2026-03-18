import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Badge from "../../components/hospital/Badge";
import Button from "../../components/hospital/Button";
import DataTable from "../../components/hospital/DataTable";
import { useDepartments } from "../../hooks/useDepartments";
import { useDoctors } from "../../hooks/useDoctors";

export default function DepartmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDepartmentById } = useDepartments();
  const { doctors } = useDoctors();
  const [dept, setDept] = useState(null);
  const [departmentDoctors, setDepartmentDoctors] = useState([]);

  useEffect(() => {
    const department = getDepartmentById(parseInt(id));
    setDept(department);
    
    if (department) {
      const deptDoctors = doctors.filter(d => 
        d.department === department.name || 
        d.departmentId === parseInt(id) ||
        d.departmentId === id
      );
      setDepartmentDoctors(deptDoctors);
    }
  }, [id, doctors]);

  if (!dept) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Department not found</p>
        <Button onClick={() => navigate("/hospital/departments")}>Back to Departments</Button>
      </div>
    );
  }

  const doctorColumns = [
    { key: "fullName", label: "Doctor Name" },
    { key: "specialization", label: "Specialization" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge variant="success">{row.status || "Active"}</Badge>
    }
  ];

  return (
    <>
      <PageHeader 
        title={`${dept.name} Department`}
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button onClick={() => navigate(`/hospital/departments/statistics/${id}`)}>
              View Statistics
            </Button>
            <Button onClick={() => navigate(`/hospital/reports/department`)}>
              📊 Department Analytics
            </Button>
            <Button onClick={() => navigate(`/hospital/departments/assign-head/${id}`)}>
              Assign Head
            </Button>
            <Button variant="secondary" onClick={() => navigate("/hospital/departments")}>
              Back
            </Button>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Department Information</h3>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong>Code:</strong> {dept.code}
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong>Location:</strong> {dept.location || "N/A"}
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong>Contact:</strong> {dept.contact || "N/A"}
          </div>
          <div>
            <Badge variant={dept.status === "Active" ? "success" : "danger"}>
              {dept.status || "Active"}
            </Badge>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Head of Department</h3>
          {dept.headOfDepartment ? (
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                {dept.headOfDepartment}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Department Head</div>
            </div>
          ) : (
            <div>
              <p style={{ color: "#9ca3af", marginBottom: "0.5rem" }}>No head assigned</p>
              <Button size="sm" onClick={() => navigate(`/hospital/departments/assign-head/${id}`)}>
                Assign Now
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <h3 style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Operating Hours</h3>
          <div style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.25rem" }}>
            {dept.operatingHours || "24/7"}
          </div>
          <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Beds: {dept.numberOfBeds || 0}
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#3b82f6" }}>
              {departmentDoctors.length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Doctors</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#10b981" }}>
              {dept.totalNurses || 0}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Nurses</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#f59e0b" }}>
              {dept.totalStaff || 0}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Staff</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "600", color: "#8b5cf6" }}>
              {dept.numberOfBeds || 0}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Beds</div>
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.75rem" }}>Description</h3>
        <p style={{ color: "#4b5563" }}>{dept.description || "No description available"}</p>
      </Card>

      {dept.servicesOffered && (
        <Card style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.75rem" }}>Services Offered</h3>
          <p style={{ color: "#4b5563" }}>{dept.servicesOffered}</p>
        </Card>
      )}

      <Card>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Department Doctors</h3>
        {departmentDoctors.length > 0 ? (
          <DataTable columns={doctorColumns} data={departmentDoctors} />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
            No doctors assigned to this department yet
          </div>
        )}
      </Card>
    </>
  );
}
