import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";
import Badge from "../../components/hospital/Badge";
import { useAppointments } from "../../hooks/useAppointments";
import { usePatients } from "../../hooks/usePatients";
import { useDoctors } from "../../hooks/useDoctors";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appointments } = useAppointments();
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (appointments && id) {
      const foundAppointment = appointments.find(a => a.id === id);
      setAppointment(foundAppointment);
      
      if (foundAppointment) {
        // Find patient
        if (patients && foundAppointment.patientId) {
          const foundPatient = patients.find(p => p.id === foundAppointment.patientId);
          setPatient(foundPatient);
        }
        
        // Find doctor
        if (doctors && foundAppointment.doctorId) {
          const foundDoctor = doctors.find(d => d.id === foundAppointment.doctorId);
          setDoctor(foundDoctor);
        }
      }
    }
  }, [appointments, patients, doctors, id]);

  const getStatusBadge = (status) => {
    const variants = {
      'Scheduled': 'info',
      'Confirmed': 'success',
      'In Progress': 'warning',
      'Completed': 'success',
      'Cancelled': 'danger',
      'No Show': 'secondary'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      'Routine': 'secondary',
      'Urgent': 'warning',
      'Emergency': 'danger'
    };
    return <Badge variant={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  const handleStatusUpdate = (newStatus) => {
    if (window.confirm(`Change appointment status to ${newStatus}?`)) {
      // In a real app, this would update via API
      setAppointment(prev => ({ ...prev, status: newStatus }));
      alert(`Appointment status updated to ${newStatus}`);
    }
  };

  if (!appointment) {
    return (
      <>
        <PageHeader title="Appointment Details" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Appointment not found</p>
            <Button onClick={() => navigate("/hospital/appointments")} style={{ marginTop: "1rem" }}>
              Back to Appointments
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Appointment Details"
        subtitle={`Appointment ID: ${appointment.id} • ${appointment.date} at ${appointment.time}`}
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button onClick={() => navigate(`/hospital/appointments/${id}/edit`)}>
              Edit Appointment
            </Button>
            <Button variant="secondary" onClick={() => navigate("/hospital/appointments")}>
              Back to List
            </Button>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Appointment Information */}
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            Appointment Information
          </h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Date & Time</div>
              <div style={{ fontWeight: "600" }}>{appointment.date} at {appointment.time}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Duration</div>
              <div style={{ fontWeight: "600" }}>{appointment.duration || '30'} minutes</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Status</div>
              {getStatusBadge(appointment.status)}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Priority</div>
              {getPriorityBadge(appointment.priority || 'Routine')}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Type</div>
              <div style={{ fontWeight: "600" }}>{appointment.type || 'Consultation'}</div>
            </div>
          </div>
        </Card>

        {/* Patient Information */}
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            Patient Information
          </h3>
          {patient ? (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Name</div>
                <div style={{ fontWeight: "600" }}>{patient.fullName}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Patient ID</div>
                <div style={{ fontWeight: "600" }}>{patient.patientId || patient.id}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Age & Gender</div>
                <div style={{ fontWeight: "600" }}>
                  {patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : patient.age || 'N/A'} years, {patient.gender}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Phone</div>
                <div style={{ fontWeight: "600" }}>{patient.phone}</div>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <Button size="sm" onClick={() => navigate(`/hospital/patients/${patient.id}`)}>
                  View Patient Details
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ color: "#6b7280" }}>Patient information not available</div>
          )}
        </Card>

        {/* Doctor Information */}
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            Doctor Information
          </h3>
          {doctor ? (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Name</div>
                <div style={{ fontWeight: "600" }}>Dr. {doctor.fullName || doctor.name}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Specialization</div>
                <div style={{ fontWeight: "600" }}>{doctor.specialization}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Department</div>
                <div style={{ fontWeight: "600" }}>{doctor.department || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Phone</div>
                <div style={{ fontWeight: "600" }}>{doctor.phone || 'N/A'}</div>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <Button size="sm" onClick={() => navigate(`/hospital/doctors/${doctor.id}`)}>
                  View Doctor Profile
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ color: "#6b7280" }}>Doctor information not available</div>
          )}
        </Card>
      </div>

      {/* Appointment Details */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
          Appointment Details
        </h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          {appointment.reason && (
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Reason for Visit
              </div>
              <div style={{ padding: "0.75rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
                {appointment.reason}
              </div>
            </div>
          )}
          
          {appointment.symptoms && (
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Symptoms
              </div>
              <div style={{ padding: "0.75rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
                {appointment.symptoms}
              </div>
            </div>
          )}

          {appointment.notes && (
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Additional Notes
              </div>
              <div style={{ padding: "0.75rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
                {appointment.notes}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
          Quick Actions
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {appointment.status === 'Scheduled' && (
            <Button onClick={() => handleStatusUpdate('Confirmed')}>
              ✅ Confirm Appointment
            </Button>
          )}
          
          {(appointment.status === 'Confirmed' || appointment.status === 'Scheduled') && (
            <Button onClick={() => handleStatusUpdate('In Progress')}>
              🏥 Start Consultation
            </Button>
          )}
          
          {appointment.status === 'In Progress' && (
            <Button onClick={() => handleStatusUpdate('Completed')}>
              ✅ Mark Complete
            </Button>
          )}
          
          {patient && (
            <Button 
              variant="secondary"
              onClick={() => navigate(`/hospital/patients/${patient.id}/vital-signs`)}
            >
              🩺 Record Vital Signs
            </Button>
          )}
          
          {patient && (
            <Button 
              variant="secondary"
              onClick={() => navigate(`/hospital/lab/create?patientId=${patient.id}`)}
            >
              🧪 Order Lab Tests
            </Button>
          )}
          
          {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
            <Button 
              variant="danger"
              onClick={() => handleStatusUpdate('Cancelled')}
            >
              ❌ Cancel Appointment
            </Button>
          )}
        </div>
      </Card>
    </>
  );
}