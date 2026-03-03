import { useContext } from "react";
import { MedicalRecordContext } from "../context/hospitalContext/MedicalRecordContext";

export const useMedicalRecords = () => {
  const context = useContext(MedicalRecordContext);
  if (!context) {
    throw new Error("useMedicalRecords must be used within MedicalRecordProvider");
  }
  return context;
};
