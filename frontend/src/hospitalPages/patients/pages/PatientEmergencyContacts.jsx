import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";

export default function PatientEmergencyContacts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const contacts = [
    {
      id: 1,
      name: "John Doe",
      relationship: "Spouse",
      phone: "+1 234-567-8900",
      email: "john.doe@email.com",
      address: "123 Main St, City, State",
      isPrimary: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      relationship: "Sister",
      phone: "+1 234-567-8901",
      email: "jane.smith@email.com",
      address: "456 Oak Ave, City, State",
      isPrimary: false,
    },
  ];

  return (
    <>
      <PageHeader
        title="Emergency Contacts"
        action={
          <div className="flex gap-2">
            <Button>Add Contact</Button>
            <Button variant="secondary" onClick={() => navigate(`/hospital/patients/${id}`)}>
              Back
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contacts.map((contact) => (
          <Card
            key={contact.id}
            title={
              <div className="flex items-center justify-between">
                <span>{contact.name}</span>
                {contact.isPrimary && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    Primary
                  </span>
                )}
              </div>
            }
          >
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Relationship</p>
                <p className="font-semibold">{contact.relationship}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{contact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{contact.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold">{contact.address}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm">Edit</Button>
                <Button size="sm" variant="danger">Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
