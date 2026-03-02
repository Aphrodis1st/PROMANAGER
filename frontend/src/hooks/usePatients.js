import { useContext } from "react";
import { PatientContext } from "../context/hospitalContext/PatientContext";

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatients must be used within PatientProvider");
  }
  return context;
};
