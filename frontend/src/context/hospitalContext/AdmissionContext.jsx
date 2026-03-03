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
    setAdmission(null);
  };

  const admitPatient = async (data) => {
    await fetchAdmissions();
  };

  const dischargePatient = async (id, data) => {
    await fetchAdmissions();
  };

  const transferPatient = async (id, data) => {
    await fetchAdmissions();
  };

  return (
    <AdmissionContext.Provider value={{ admissions, admission, loading, fetchAdmissions, fetchAdmissionById, admitPatient, dischargePatient, transferPatient }}>
      {children}
    </AdmissionContext.Provider>
  );
};