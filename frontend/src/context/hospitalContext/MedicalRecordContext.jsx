import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const MedicalRecordContext = createContext();

export const MedicalRecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async (patientId = null) => {
    if (!patientId) {
      setRecords([]);
      return;
    }
    setLoading(true);
    try {
      const res = await hospitalService.getMedicalRecords(patientId);
      setRecords(res.data || []);
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
      setRecords([]);
    }
    setLoading(false);
  };

  const fetchAllRecords = async () => {
    setLoading(true);
    setRecords([]);
    setLoading(false);
  };

  const fetchRecordById = async (id) => {
    const found = records.find(r => r.id === id);
    setRecord(found || null);
  };

  const getRecordById = (id) => {
    return records.find(r => r.id === id) || null;
  };

  const createRecord = async (data) => {
    try {
      const result = await hospitalService.createMedicalRecord(data);
      // Don't fetch records after creation to avoid 500 error
      // if (data.patientId) await fetchRecords(data.patientId);
      return result;
    } catch (error) {
      console.error("Failed to create record:", error);
      throw error;
    }
  };

  const addDiagnosis = async (id, data) => {
    return { success: true };
  };

  const addPrescription = async (id, data) => {
    return { success: true };
  };

  const addSurgeryRecord = async (id, data) => {
    return { success: true };
  };

  const addTreatmentPlan = async (id, data) => {
    return { success: true };
  };

  // Don't fetch on mount

  return (
    <MedicalRecordContext.Provider value={{ records, record, loading, fetchRecords, fetchAllRecords, fetchRecordById, getRecordById, createRecord, addDiagnosis, addPrescription, addSurgeryRecord, addTreatmentPlan }}>
      {children}
    </MedicalRecordContext.Provider>
  );
};