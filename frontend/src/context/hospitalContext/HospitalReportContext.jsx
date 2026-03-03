import { createContext, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const HospitalReportContext = createContext();

export const HospitalReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [patientStats, setPatientStats] = useState(null);

  const fetchReports = async () => {
    try {
      const res = await hospitalService.getReports();
      setReports(res.data || []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setReports([]);
    }
  };

  const fetchPatientReports = async () => {
    setPatientStats({
      total: 0,
      newThisMonth: 0,
      active: 0,
      admitted: 0,
      ageDistribution: [],
      gender: { male: 0, female: 0, other: 0 }
    });
  };

  return (
    <HospitalReportContext.Provider value={{ reports, patientStats, fetchReports, fetchPatientReports }}>
      {children}
    </HospitalReportContext.Provider>
  );
};