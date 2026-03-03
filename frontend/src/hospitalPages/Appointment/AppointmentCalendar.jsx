import React from "react";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { useAppointments } from "../../hooks/useAppointments";

export default function AppointmentCalendar() {
  const { appointments } = useAppointments();

  // Group appointments by date
  const appointmentsByDate = appointments?.reduce((acc, apt) => {
    const date = apt.date || new Date().toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(apt);
    return acc;
  }, {}) || {};

  const dates = Object.keys(appointmentsByDate).sort();

  return (
    <>
      <PageHeader title="Appointment Calendar" />

      <Card>
        <div className="space-y-4">
          {dates.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No appointments scheduled</p>
          ) : (
            dates.map((date) => (
              <div key={date} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-lg mb-2">{date}</h3>
                <div className="space-y-2">
                  {appointmentsByDate[date].map((apt, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">
                        {apt.patientName || 'Patient'} - {apt.doctorName || 'Doctor'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Time: {apt.time || 'Not specified'}
                      </p>
                      {apt.reason && (
                        <p className="text-sm text-gray-600">Reason: {apt.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}