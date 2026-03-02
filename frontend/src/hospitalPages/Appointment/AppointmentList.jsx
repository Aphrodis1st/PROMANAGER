import React from "react";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import DataTable from "../../components/hospital/DataTable";
import { useAppointments } from "../../hooks/useAppointments";

export default function AppointmentList() {
  const { appointments } = useAppointments();

  return (
    <>
      <PageHeader title="Appointments" />

      <Card>
        <DataTable
          columns={[
            { key: "patientName", label: "Patient" },
            { key: "doctorName", label: "Doctor" },
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
          ]}
          data={appointments}
          searchable
          pagination
        />
      </Card>
    </>
  );
}