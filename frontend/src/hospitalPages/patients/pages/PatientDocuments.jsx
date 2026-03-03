import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import DataTable from "../../../components/hospital/DataTable";

export default function PatientDocuments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const documents = [
    { id: 1, fileName: "Lab_Report_2024.pdf", uploadedAt: "2024-01-15", type: "Lab Report", size: "2.5 MB" },
    { id: 2, fileName: "X-Ray_Chest.jpg", uploadedAt: "2024-02-10", type: "X-Ray", size: "1.8 MB" },
  ];

  const columns = [
    { key: "fileName", label: "Document Name" },
    { key: "type", label: "Type" },
    { key: "uploadedAt", label: "Uploaded Date" },
    { key: "size", label: "Size" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm">View</Button>
          <Button size="sm" variant="danger">Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Patient Documents"
        action={
          <div className="flex gap-2">
            <Button>Upload Document</Button>
            <Button variant="secondary" onClick={() => navigate(`/hospital/patients/${id}`)}>
              Back
            </Button>
          </div>
        }
      />

      <Card>
        <DataTable columns={columns} data={documents} pageSize={10} />
      </Card>
    </>
  );
}
