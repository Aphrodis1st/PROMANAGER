import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    const res = await hospitalService.getDepartments();
    setDepartments(res.data);
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