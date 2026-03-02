import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const MedicalRecordContext = createContext();

export const MedicalRecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    const res = await hospitalService.getMedicalRecords();
    setRecords(res.data);
  };

  const createRecord = async (data) => {
    await hospitalService.createMedicalRecord(data);
    fetchRecords();
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <MedicalRecordContext.Provider value={{ records, fetchRecords, createRecord }}>
      {children}
    </MedicalRecordContext.Provider>
  );
};