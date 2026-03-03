import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const LabContext = createContext();

export const LabProvider = ({ children }) => {
  const [tests, setTests] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchTests = async () => {
    try {
      const res = await hospitalService.getLabTests();
      setTests(res.data || []);
    } catch (error) {
      console.error("Failed to fetch lab tests:", error);
      setTests([]);
    }
  };

  const fetchLabStats = async () => {
    setStats({ pending: 0, completedToday: 0, total: 0, critical: 0 });
  };

  const createTest = async (data) => {
    await hospitalService.createLabTest(data);
    fetchTests();
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <LabContext.Provider value={{ tests, stats, fetchTests, fetchLabStats, createTest }}>
      {children}
    </LabContext.Provider>
  );
};