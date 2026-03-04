import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import DataTable from "../../components/hospital/DataTable";
import { useAppointments } from "../../hooks/useAppointments";

export default function AppointmentList() {
  const { appointments, loading, fetchAppointments } = useAppointments();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  console.log("Appointments:", appointments);

  const columns = [
    { key: "patientName", label: "Patient" },
    { key: "doctorName", label: "Doctor" },
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button size="sm" onClick={() => navigate(`/hospital/appointments/${row.id}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Appointments"
        action={
          <Button onClick={() => navigate("/hospital/appointments/create")}>
            Book Appointment
          </Button>
        }
      />
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading appointments...</div>
        ) : appointments && appointments.length > 0 ? (
          <DataTable columns={columns} data={appointments} />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No appointments found.</p>
            <Button onClick={() => navigate("/hospital/appointments/create")} style={{ marginTop: "1rem" }}>
              Book First Appointment
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}