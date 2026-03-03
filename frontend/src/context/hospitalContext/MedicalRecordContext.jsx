import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const MedicalRecordContext = createContext();

export const MedicalRecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getMedicalRecords();
      setRecords(res.data || []);
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
      setRecords([]);
    }
    setLoading(false);
  };

  const fetchRecordById = async (id) => {
    setRecord(null);
  };

  const createRecord = async (data) => {
    await hospitalService.createMedicalRecord(data);
    fetchRecords();
  };

  const addDiagnosis = async (id, data) => {
    await fetchRecords();
  };

  const addPrescription = async (id, data) => {
    await fetchRecords();
  };

  const addSurgeryRecord = async (id, data) => {
    await fetchRecords();
  };

  const addTreatmentPlan = async (id, data) => {
    await fetchRecords();
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <MedicalRecordContext.Provider value={{ records, record, loading, fetchRecords, fetchRecordById, createRecord, addDiagnosis, addPrescription, addSurgeryRecord, addTreatmentPlan }}>
      {children}
    </MedicalRecordContext.Provider>
  );
};