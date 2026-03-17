import { createContext, useEffect, useState, useCallback } from "react";
import hospitalService from "../../services/hospitalService";

export const MedicalRecordContext = createContext();

export const MedicalRecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecords = useCallback(async (patientId = null) => {
    if (!patientId) {
      setRecords([]);
      return [];
    }
    setLoading(true);
    try {
      console.log('MedicalRecordContext: Fetching records for patient:', patientId);
      const res = await hospitalService.getMedicalRecords(patientId);
      const recordsData = res.data || res || [];
      console.log('MedicalRecordContext: Received records:', recordsData.length);
      setRecords(recordsData);
      setLoading(false);
      return recordsData;
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
      setRecords([]);
      setLoading(false);
      return [];
    }
  }, []);

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

  const createRecord = useCallback(async (data) => {
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
  }, [fetchRecords]);

  const addDiagnosis = async (recordId, data) => {
    try {
      console.log('Adding diagnosis to medical record:', recordId, 'with data:', data);
      
      // First try to get the current record from local state
      let currentRecord = records.find(r => r.id === recordId);
      
      // If not found in local state, fetch it directly
      if (!currentRecord) {
        console.log('Record not found in local state, fetching directly...');
        try {
          currentRecord = await hospitalService.getMedicalRecordById(recordId);
          if (!currentRecord) {
            throw new Error('Medical record not found');
          }
        } catch (fetchError) {
          console.error('Failed to fetch medical record:', fetchError);
          throw new Error('Medical record not found');
        }
      }

      // Add diagnosis to the record
      const updatedData = {
        ...currentRecord,
        diagnoses: [...(currentRecord.diagnoses || []), {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString()
        }],
        // Also update primary diagnosis if this is the first one
        diagnosis: currentRecord.diagnosis || data.description,
        updatedAt: new Date().toISOString()
      };

      console.log('Updating medical record with diagnosis:', updatedData);
      const result = await hospitalService.updateMedicalRecord(recordId, updatedData);
      
      // Update local state if the record exists there
      setRecords(prev => {
        const recordExists = prev.some(r => r.id === recordId);
        if (recordExists) {
          return prev.map(r => r.id === recordId ? { ...r, ...updatedData } : r);
        }
        return prev;
      });
      
      console.log('Diagnosis added successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to add diagnosis:', error);
      throw error;
    }
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

  const deleteRecord = async (id) => {
    try {
      console.log('Deleting medical record:', id);
      const result = await hospitalService.deleteMedicalRecord(id);
      
      // Remove from local state
      setRecords(prev => prev.filter(r => r.id !== id));
      
      console.log('Medical record deleted successfully:', result);
      return result;
    } catch (error) {
      console.error("Failed to delete medical record:", error);
      throw error;
    }
  };

  // Don't fetch on mount

  return (
    <MedicalRecordContext.Provider value={{ records, record, loading, fetchRecords, fetchAllRecords, fetchRecordById, getRecordById, createRecord, addDiagnosis, addPrescription, addSurgeryRecord, addTreatmentPlan, deleteRecord }}>
      {children}
    </MedicalRecordContext.Provider>
  );
};