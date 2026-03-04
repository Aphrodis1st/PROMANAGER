import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { usePatients } from "../../../hooks/usePatients";
import { useAppointments } from "../../../hooks/useAppointments";
import { useMedicalRecords } from "../../../hooks/useMedicalRecords";

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { records, fetchRecords } = useMedicalRecords();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const found = patients?.find(p => p.id === id);
    setPatient(found);
    if (found) {
      fetchRecords(id);
    }
  }, [id, patients]);

  const patientAppointments = appointments?.filter(a => a.patientId === id) || [];
  const patientRecords = records || [];

  if (!patient) {
    return (
      <div className="text-center py-8">
        <p>Loading patient details...</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Patient Details"
        action={
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/hospital/patients/${id}/edit`)}>
              Edit
            </Button>
            <Button variant="secondary" onClick={() => navigate("/hospital/patients")}>
              Back
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Personal Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-semibold">{patient.fullName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Patient ID</p>
              <p className="font-semibold">{patient.patientId || patient.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-semibold">{patient.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-semibold">{patient.dateOfBirth || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="font-semibold">{patient.bloodGroup || 'N/A'}</p>
            </div>
          </div>
        </Card>

        <Card title="Contact Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">{patient.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{patient.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-semibold">{patient.address || 'N/A'}</p>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-2">
            <Button className="w-full" onClick={() => navigate(`/hospital/appointments/create?patientId=${id}`)}>
              Book Appointment
            </Button>
            <Button className="w-full" onClick={() => navigate(`/hospital/lab/create?patientId=${id}`)}>
              Order Lab Tests
            </Button>
            <Button className="w-full" onClick={() => navigate(`/hospital/medical-records/create?patientId=${id}`)}>
              Create Medical Record
            </Button>
            <Button className="w-full" onClick={() => navigate(`/hospital/patients/${id}/history`)}>
              View History
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card title="Recent Appointments">
          {patientAppointments.length > 0 ? (
            <div className="space-y-2">
              {patientAppointments.slice(0, 3).map(apt => (
                <div key={apt.id} className="border-b pb-2">
                  <p className="font-semibold">{apt.doctorName}</p>
                  <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                  <Badge>{apt.status || 'Scheduled'}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No appointments found</p>
          )}
        </Card>

        <Card title="Medical Records">
          {patientRecords.length > 0 ? (
            <div className="space-y-2">
              {patientRecords.slice(0, 3).map(record => (
                <div key={record.id} className="border-b pb-2">
                  <p className="font-semibold">Record #{record.recordNumber}</p>
                  <p className="text-sm text-gray-500">{record.primaryDoctor}</p>
                  <Button size="sm" onClick={() => navigate(`/hospital/medical-records/${record.id}`)}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No medical records found</p>
          )}
        </Card>
      </div>
    </>
  );
}