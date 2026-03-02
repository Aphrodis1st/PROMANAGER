import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    const res = await hospitalService.getAppointments();
    setAppointments(res.data);
    setLoading(false);
  };

  const createAppointment = async (data) => {
    await hospitalService.createAppointment(data);
    fetchAppointments();
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