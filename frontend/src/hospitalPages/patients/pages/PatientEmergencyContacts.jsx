import React, { useState } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Card from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { Form, Input } from "../../../components/ui/Form";
import { usePatients } from "../../../hooks/usePatients";

export default function PatientEmergencyContacts() {
  const { contacts, addContact } = usePatients();
  const [open, setOpen] = useState(false);

  const columns = [
    { key: "name", label: "Name" },
    { key: "relationship", label: "Relationship" },
    { key: "phone", label: "Phone" },
  ];

  return (
    <>
      <PageHeader
        title="Emergency Contacts"
        action={<Button onClick={() => setOpen(true)}>Add Contact</Button>}
      />

      <Card>
        <DataTable columns={columns} data={contacts} />
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Contact">
        <Form onSubmit={(v) => addContact(v)}>
          <Input name="name" label="Name" />
          <Input name="relationship" label="Relationship" />
          <Input name="phone" label="Phone" />
          <Button type="submit">Save</Button>
        </Form>
      </Modal>
    </>
  );
}