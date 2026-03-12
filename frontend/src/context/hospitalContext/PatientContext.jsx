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
      // Add mock patients for testing when API fails
      setPatients([
        {
          id: 'qwCCVRquMhl6BnhFoVTy',
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '123-456-7890',
          dateOfBirth: '1990-01-15',
          gender: 'Male',
          address: '123 Main St, City, State'
        },
        {
          id: 'vLiQLk1oboJIfbK0fJeI', 
          fullName: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '098-765-4321',
          dateOfBirth: '1985-05-20',
          gender: 'Female',
          address: '456 Oak Ave, City, State'
        },
        {
          id: 'patient-3',
          fullName: 'Mike Johnson',
          email: 'mike.johnson@email.com', 
          phone: '555-123-4567',
          dateOfBirth: '1978-12-03',
          gender: 'Male',
          address: '789 Pine Rd, City, State'
        }
      ]);
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