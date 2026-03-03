import { useContext } from "react";
import { DoctorContext } from "../context/hospitalContext/DoctorContext";

export const useDoctors = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctors must be used within DoctorProvider");
  }
  return context;
};
