import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import Card from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { usePatients } from "../../../hooks/usePatients";

export default function PatientDocuments() {
  const { id } = useParams();
  const { documents, uploadDocument } = usePatients();
  const [open, setOpen] = useState(false);

  const docColumns = [
    { key: "fileName", label: "Document Name" },
    { key: "uploadedAt", label: "Uploaded At" },
    { key: "type", label: "Type" },
  ];

  return (
    <>
      <PageHeader
        title="Patient Documents"
        action={<Button onClick={() => setOpen(true)}>Upload Document</Button>}
      />

      <Card>
        <DataTable columns={docColumns} data={documents(id)} />
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Upload Document">
        <input type="file" />
        <Button onClick={() => uploadDocument(id)}>Upload</Button>
      </Modal>
    </>
  );
}