import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import DataTable from "../../../components/hospital/DataTable";
import { useDoctors } from "../../../hooks/useDoctors";

export default function DoctorList() {
  const { doctors, loading, fetchDoctors } = useDoctors();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  console.log("Doctors in list:", doctors);

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "specialization", label: "Specialization" },
    { key: "department", label: "Department" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button size="sm" onClick={() => navigate(`/hospital/doctors/${row.id}`)}>
            View
          </Button>
          <Button size="sm" onClick={() => navigate(`/hospital/doctors/${row.id}/edit`)}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Doctor Directory"
        action={
          <Button onClick={() => navigate("/hospital/doctors/create")}>
            Add Doctor
          </Button>
        }
      />
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading doctors...</div>
        ) : doctors && doctors.length > 0 ? (
          <DataTable columns={columns} data={doctors} />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No doctors found.</p>
            <Button onClick={() => navigate("/hospital/doctors/create")} style={{ marginTop: "1rem" }}>
              Add First Doctor
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}
