import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const LabContext = createContext();

export const LabProvider = ({ children }) => {
  const [tests, setTests] = useState([]);

  const fetchTests = async () => {
    const res = await hospitalService.getLabTests();
    setTests(res.data);
  };

  const createTest = async (data) => {
    await hospitalService.createLabTest(data);
    fetchTests();
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <LabContext.Provider value={{ tests, fetchTests, createTest }}>
      {children}
    </LabContext.Provider>
  );
};