import { useContext } from "react";
import { AppointmentContext } from "../context/hospitalContext/AppointmentContext";

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointments must be used within AppointmentProvider");
  }
  return context;
};
