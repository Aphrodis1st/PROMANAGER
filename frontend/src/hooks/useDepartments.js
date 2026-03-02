import { useContext } from "react";
import { DepartmentContext } from "../context/hospitalContext/DepartmentContext";

export const useDepartments = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error("useDepartments must be used within DepartmentProvider");
  }
  return context;
};
