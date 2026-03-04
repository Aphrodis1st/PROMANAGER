import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getAppointments();
      console.log("Fetched appointments:", res);
      const appointmentsList = res.data || res || [];
      
      // Fetch patients and doctors to map names
      const [patientsRes, doctorsRes] = await Promise.all([
        hospitalService.getPatients().catch(() => ({ data: [] })),
        hospitalService.getDoctors().catch(() => ({ data: [] }))
      ]);
      
      const patients = patientsRes.data || patientsRes || [];
      const doctors = doctorsRes.data || doctorsRes || [];
      
      // Enrich appointments with names
      const enrichedAppointments = appointmentsList.map(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        const doctor = doctors.find(d => d.id === apt.doctorId);
        
        return {
          ...apt,
          patientName: patient?.fullName || patient?.name || 'Unknown Patient',
          doctorName: doctor?.fullName || doctor?.name || 'Unknown Doctor'
        };
      });
      
      setAppointments(enrichedAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      setAppointments([]);
    }
    setLoading(false);
  };

  const createAppointment = async (data) => {
    try {
      const result = await hospitalService.createAppointment(data);
      await fetchAppointments();
      return result;
    } catch (error) {
      console.error("Failed to create appointment:", error);
      throw error;
    }
  };

  const updateAppointment = async (id, data) => {
    await hospitalService.updateAppointment(id, data);
    fetchAppointments();
  };

  const deleteAppointment = async (id) => {
    await hospitalService.deleteAppointment(id);
    fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <AppointmentContext.Provider
      value={{ appointments, loading, fetchAppointments, createAppointment, updateAppointment, deleteAppointment }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};