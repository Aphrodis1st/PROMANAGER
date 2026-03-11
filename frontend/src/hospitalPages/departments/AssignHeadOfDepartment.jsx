import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { Form, Select } from "../../components/hospital/Form";
import Button from "../../components/hospital/Button";
import { useDepartments } from "../../hooks/useDepartments";
import { useDoctors } from "../../hooks/useDoctors";

export default function AssignHeadOfDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assignHead, getDepartmentById } = useDepartments();
  const { doctors } = useDoctors();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState(null);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    const dept = getDepartmentById(parseInt(id));
    setDepartment(dept);
    
    if (dept) {
      const deptDoctors = doctors.filter(d => 
        d.department === dept.name || 
        d.departmentId === parseInt(id) ||
        d.departmentId === id ||
        d.specialization
      );
      setFilteredDoctors(deptDoctors);
    }
  }, [id, doctors]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const selectedDoctor = doctors.find(d => d.id === values.doctorId);
      await assignHead(parseInt(id), `Dr. ${selectedDoctor.fullName || selectedDoctor.name}`);
      alert("Head of Department assigned successfully!");
      navigate(`/hospital/departments/${id}`);
    } catch (error) {
      console.error("Error assigning head:", error);
      alert("Failed to assign head. Please try again.");
      setLoading(false);
    }
  };

  if (!department) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Department not found</p>
        <Button onClick={() => navigate("/hospital/departments")}>Back to Departments</Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title={`Assign Head of Department - ${department.name}`}
        action={
          <Button variant="secondary" onClick={() => navigate(`/hospital/departments/${id}`)}>
            Cancel
          </Button>
        }
      />
      
      <Card>
        <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>Department Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", fontSize: "0.875rem" }}>
            <div>
              <strong>Name:</strong> {department.name}
            </div>
            <div>
              <strong>Code:</strong> {department.code}
            </div>
            <div>
              <strong>Location:</strong> {department.location || "N/A"}
            </div>
          </div>
          {department.headOfDepartment && (
            <div style={{ marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "#fef3c7", borderRadius: "0.25rem" }}>
              <strong>Current Head:</strong> {department.headOfDepartment}
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Assigning head...</div>
        ) : filteredDoctors.length > 0 ? (
          <>
            <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#dbeafe", borderRadius: "0.5rem", fontSize: "0.875rem" }}>
              <strong>ℹ️ Note:</strong> Select a qualified doctor from this department to be the Head of Department (HOD).
            </div>
            
            <Form onSubmit={handleSubmit}>
              <Select
                name="doctorId"
                label="Select Doctor"
                options={filteredDoctors.map(d => ({
                  label: `Dr. ${d.fullName || d.name} - ${d.specialization} (${d.experience || 0} years exp)`,
                  value: d.id,
                }))}
                required
              />
              
              <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>Responsibilities of HOD:</h4>
                <ul style={{ fontSize: "0.875rem", color: "#6b7280", paddingLeft: "1.5rem" }}>
                  <li>Oversee department operations</li>
                  <li>Manage department staff</li>
                  <li>Coordinate with hospital administration</li>
                  <li>Ensure quality patient care</li>
                  <li>Handle department budget and resources</li>
                </ul>
              </div>
            </Form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ marginBottom: "1rem", color: "#6b7280" }}>No doctors available in this department.</p>
            <Button onClick={() => navigate("/hospital/doctors/create")}>
              Add Doctor
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}
