import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import DataTable from "../../../components/hospital/DataTable";
import { usePatients } from "../../../hooks/usePatients";
import { useAppointments } from "../../../hooks/useAppointments";
import { useMedicalRecords } from "../../../hooks/useMedicalRecords";

export default function PatientHistory() {
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

  // Combine appointments and records into history
  const history = [
    ...patientAppointments.map(apt => ({
      id: `apt-${apt.id}`,
      date: apt.date,
      type: "Appointment",
      doctor: apt.doctorName,
      department: apt.department || "N/A",
      notes: apt.reason || "Regular checkup"
    })),
    ...patientRecords.map(rec => ({
      id: `rec-${rec.id}`,
      date: rec.lastVisit || rec.createdAt || "N/A",
      type: "Medical Record",
      doctor: rec.primaryDoctor || "N/A",
      department: "N/A",
      notes: `Record #${rec.recordNumber}`
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const columns = [
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "doctor", label: "Doctor" },
    { key: "department", label: "Department" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <>
      <PageHeader 
        title={`Medical History - ${patient?.fullName || 'Patient'}`}
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
