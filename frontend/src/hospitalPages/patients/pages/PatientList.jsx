import React from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import { usePatients } from "../../../hooks/usePatients";
import { useNavigate } from "react-router-dom";

export default function PatientList() {
  const { patients, loading } = usePatients();
  const navigate = useNavigate();

  const columns = [
    { key: "patientId", label: "Patient ID" },
    { key: "fullName", label: "Full Name" },
    { key: "gender", label: "Gender" },
    { key: "phone", label: "Phone" },
    { 
      key: "actions", 
      label: "Actions",
      render: (row) => (
        <Button 
          size="sm" 
          onClick={() => navigate(`/hospital/patients/${row.id}`)}
        >
          View
        </Button>
      )
    },
  ];

  return (
    <>
      <PageHeader
        title="Patients"
        subtitle="Manage all registered patients"
        action={
          <Button onClick={() => navigate("/hospital/patients/create")}>
            Register Patient
          </Button>
        }
      />

      <Card>
        {loading ? (
          <div className="text-center py-8">Loading patients...</div>
        ) : (
          <DataTable
            columns={columns}
            data={patients || []}
            pageSize={10}
          />
        )}
      </Card>
    </>
  );
}