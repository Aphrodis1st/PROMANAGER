import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { useAppointments } from "../../hooks/useAppointments";

export default function AppointmentCalendar() {
  const { appointments } = useAppointments();

  return (
    <>
      <PageHeader title="Appointment Calendar" />

      <Card>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={appointments.map((a) => ({
            title: `${a.patientName} - ${a.doctorName}`,
            date: a.date,
          }))}
        />
      </Card>
    </>
  );
}