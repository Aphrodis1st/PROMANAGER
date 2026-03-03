import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await hospitalService.getPatients();
      setPatients(res.data || res || []);
      setError(null);
    } catch (err) {
      console.warn('Failed to fetch patients:', err.message);
      setError(err.message);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (data) => {
    await hospitalService.createPatient(data);
    fetchPatients();
  };

  const updatePatient = async (id, data) => {
    await hospitalService.updatePatient(id, data);
    fetchPatients();
  };

  const deletePatient = async (id) => {
    await hospitalService.deletePatient(id);
    fetchPatients();
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <PatientContext.Provider
      value={{ patients, loading, error, fetchPatients, createPatient, updatePatient, deletePatient }}
    >
      {children}
    </PatientContext.Provider>
  );
};