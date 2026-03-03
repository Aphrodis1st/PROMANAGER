import React from "react";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import DataTable from "../../components/hospital/DataTable";
import { useAppointments } from "../../hooks/useAppointments";

export default function QueueManagement() {
  const { appointments } = useAppointments();

  const queue = appointments.filter(
    (a) => a.status === "Scheduled"
  );

  return (
    <>
      <PageHeader title="Queue Management" />

      <Card>
        <DataTable
          columns={[
            { key: "patientName", label: "Patient" },
            { key: "doctorName", label: "Doctor" },
            { key: "date", label: "Time" },
          ]}
          data={queue}
        />
      </Card>
    </>
  );
}
