import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";
import { HOSPITAL_DEPARTMENTS } from "../../constants/hospitalDepartments";

export const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState(HOSPITAL_DEPARTMENTS);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getDepartments();
      const fetchedDepts = res.data || res || [];
      if (fetchedDepts.length > 0) {
        setDepartments(fetchedDepts);
      } else {
        setDepartments(HOSPITAL_DEPARTMENTS);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setDepartments(HOSPITAL_DEPARTMENTS);
    }
    setLoading(false);
  };

  const getDepartmentById = (id) => {
    const numId = parseInt(id);
    return departments.find(d => d.id === numId || d.id === id) || null;
  };

  const createDepartment = async (data) => {
    try {
      await hospitalService.createDepartment(data);
      await fetchDepartments();
    } catch (error) {
      console.error("Failed to create department:", error);
      throw error;
    }
  };

  const updateDepartment = async (id, data) => {
    try {
      await hospitalService.updateDepartment(id, data);
      await fetchDepartments();
    } catch (error) {
      console.error("Failed to update department:", error);
      throw error;
    }
  };

  const assignHead = async (departmentId, doctorName) => {
    try {
      const numId = parseInt(departmentId);
      const updatedDepts = departments.map(d => 
        d.id === numId ? { ...d, headOfDepartment: doctorName } : d
      );
      setDepartments(updatedDepts);
      
      // Try to update backend
      try {
        await hospitalService.updateDepartment(numId, { headOfDepartment: doctorName });
      } catch (err) {
        console.warn("Backend update failed, using local state");
      }
    } catch (error) {
      console.error("Failed to assign head:", error);
      throw error;
    }
  };

  const deleteDepartment = async (id) => {
    try {
      const numId = parseInt(id);
      setDepartments(departments.filter(d => d.id !== numId));
      
      try {
        await hospitalService.deleteDepartment(numId);
      } catch (err) {
        console.warn("Backend delete failed, using local state");
      }
    } catch (error) {
      console.error("Failed to delete department:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <DepartmentContext.Provider value={{ departments, loading, fetchDepartments, getDepartmentById, createDepartment, updateDepartment, assignHead, deleteDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
};