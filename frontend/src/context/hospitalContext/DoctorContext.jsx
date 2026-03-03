import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getDoctors();
      setDoctors(res.data || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      setDoctors([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <DoctorContext.Provider value={{ doctors, loading, fetchDoctors }}>
      {children}
    </DoctorContext.Provider>
  );
};