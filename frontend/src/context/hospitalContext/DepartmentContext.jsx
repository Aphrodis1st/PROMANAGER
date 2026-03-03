import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";
import { HOSPITAL_DEPARTMENTS } from "../../constants/hospitalDepartments";

export const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState(HOSPITAL_DEPARTMENTS);

  const fetchDepartments = async () => {
    try {
      const res = await hospitalService.getDepartments();
      setDepartments(res.data || HOSPITAL_DEPARTMENTS);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setDepartments(HOSPITAL_DEPARTMENTS);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <DepartmentContext.Provider value={{ departments, fetchDepartments }}>
      {children}
    </DepartmentContext.Provider>
  );
};