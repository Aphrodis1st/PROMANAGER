import { createContext, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const AdmissionContext = createContext();

export const AdmissionProvider = ({ children }) => {
  const [admissions, setAdmissions] = useState([]);
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getAdmissions();
      setAdmissions(res.data || res || []);
    } catch (error) {
      console.error("Failed to fetch admissions:", error);
      setAdmissions([]);
    }
    setLoading(false);
  };

  const fetchAdmissionById = async (id) => {
    setLoading(true);
    try {
      const res = await hospitalService.getAdmissionById(id);
      setAdmission(res.data || res);
    } catch (error) {
      console.error("Failed to fetch admission:", error);
      setAdmission(null);
    }
    setLoading(false);
  };

  const admitPatient = async (data) => {
    setLoading(true);
    try {
      await hospitalService.createAdmission(data);
      await fetchAdmissions();
    } catch (error) {
      console.error("Failed to admit patient:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const dischargePatient = async (id, data) => {
    setLoading(true);
    try {
      await hospitalService.dischargeAdmission(id, data);
      await fetchAdmissions();
    } catch (error) {
      console.error("Failed to discharge patient:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const transferPatient = async (id, data) => {
    setLoading(true);
    try {
      await hospitalService.updateAdmission(id, data);
      await fetchAdmissions();
    } catch (error) {
      console.error("Failed to transfer patient:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdmissionContext.Provider value={{ admissions, admission, loading, fetchAdmissions, fetchAdmissionById, admitPatient, dischargePatient, transferPatient }}>
      {children}
    </AdmissionContext.Provider>
  );
};