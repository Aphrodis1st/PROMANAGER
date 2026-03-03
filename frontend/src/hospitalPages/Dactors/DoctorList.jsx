import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import DataTable from "../../components/hospital/DataTable";
import { useDoctors } from "../../hooks/useDoctors";

export default function DoctorList() {
  const { doctors, loading } = useDoctors();
  const navigate = useNavigate();

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "specialization", label: "Specialization" },
    { key: "department", label: "Department" },
    { key: "phone", label: "Phone" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button size="sm" onClick={() => navigate(`/hospital/doctors/${row.id}`)}>
          View Profile
        </Button>
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
          <div className="text-center py-8">Loading doctors...</div>
        ) : (
          <DataTable columns={columns} data={doctors || []} pageSize={10} />
        )}
      </Card>
    </>
  );
}
