import { createContext, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const HospitalReportContext = createContext();

export const HospitalReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const res = await hospitalService.getReports();
    setReports(res.data);
  };

  return (
    <HospitalReportContext.Provider value={{ reports, fetchReports }}>
      {children}
    </HospitalReportContext.Provider>
  );
};