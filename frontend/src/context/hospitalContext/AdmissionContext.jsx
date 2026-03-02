import { createContext, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const AdmissionContext = createContext();

export const AdmissionProvider = ({ children }) => {
  const [admissions, setAdmissions] = useState([]);

  const fetchAdmissions = async () => {
    const res = await hospitalService.getAdmissions();
    setAdmissions(res.data);
  };

  return (
    <AdmissionContext.Provider value={{ admissions, fetchAdmissions }}>
      {children}
    </AdmissionContext.Provider>
  );
};