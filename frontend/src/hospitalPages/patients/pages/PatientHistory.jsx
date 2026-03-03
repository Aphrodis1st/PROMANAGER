import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import DataTable from "../../../components/hospital/DataTable";

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const history = [
    { id: 1, date: "2024-01-15", type: "Consultation", doctor: "Dr. Smith", department: "Cardiology", diagnosis: "Hypertension" },
    { id: 2, date: "2024-02-20", type: "Lab Test", doctor: "Dr. Johnson", department: "Laboratory", diagnosis: "Blood Test" },
  ];

  const columns = [
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "doctor", label: "Doctor" },
    { key: "department", label: "Department" },
    { key: "diagnosis", label: "Diagnosis/Notes" },
  ];

  return (
    <>
      <PageHeader 
        title="Patient Medical History"
        action={
          <Button variant="secondary" onClick={() => navigate(`/hospital/patients/${id}`)}>
            Back to Patient
          </Button>
        }
      />

      <Card>
        <DataTable columns={columns} data={history} pageSize={10} />
      </Card>
    </>
  );
}
