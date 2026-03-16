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
      return [];
    }
    setLoading(true);
    try {
      console.log('MedicalRecordContext: Fetching records for patient:', patientId);
      const res = await hospitalService.getMedicalRecords(patientId);
      const recordsData = res.data || res || [];
      console.log('MedicalRecordContext: Received records:', recordsData);
      setRecords(recordsData);
      setLoading(false);
      return recordsData;
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
      setRecords([]);
      setLoading(false);
      return [];
    }
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
      // Refetch records after successful creation
      if (data.patientId) {
        await fetchRecords(data.patientId);
      }
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
    try {
      console.log('Adding prescription for medical record:', id, 'with data:', data);
      const result = await hospitalService.createPrescription({
        medicalRecordId: id,
        ...data,
        createdAt: new Date().toISOString()
      });
      console.log('Prescription added successfully:', result);
      return result;
    } catch (error) {
      console.error("Failed to add prescription:", error);
      throw error;
    }
  };

  const addSurgeryRecord = async (patientId, data) => {
    try {
      console.log('Adding surgery record for patient:', patientId, 'with data:', data);
      const result = await hospitalService.addSurgeryRecord(patientId, data);
      // Refetch records after successful creation
      await fetchRecords(patientId);
      return result;
    } catch (error) {
      console.error("Failed to add surgery record:", error);
      throw error;
    }
  };

  const addTreatmentPlan = async (id, data) => {
    try {
      console.log('Adding treatment plan for medical record:', id, 'with data:', data);
      // For now, return success - can be implemented later
      return { success: true };
    } catch (error) {
      console.error("Failed to add treatment plan:", error);
      throw error;
    }
  };

  // Don't fetch on mount

  return (
    <MedicalRecordContext.Provider value={{ records, record, loading, fetchRecords, fetchAllRecords, fetchRecordById, getRecordById, createRecord, addDiagnosis, addPrescription, addSurgeryRecord, addTreatmentPlan }}>
      {children}
    </MedicalRecordContext.Provider>
  );
};