import { useContext } from "react";
import { AdmissionContext } from "../context/hospitalContext/AdmissionContext";

export const useAdmissions = () => {
  const context = useContext(AdmissionContext);
  if (!context) {
    throw new Error("useAdmissions must be used within AdmissionProvider");
  }
  return context;
};
