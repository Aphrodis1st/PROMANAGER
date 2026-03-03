import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const WardContext = createContext();

export const WardProvider = ({ children }) => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWards = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getWards();
      setWards(res.data || []);
    } catch (error) {
      console.error("Failed to fetch wards:", error);
      setWards([]);
    }
    setLoading(false);
  };

  const assignBed = async (data) => {
    await hospitalService.assignBed(data);
    fetchWards();
  };

  useEffect(() => {
    fetchWards();
  }, []);

  return (
    <WardContext.Provider value={{ wards, loading, fetchWards, assignBed }}>
      {children}
    </WardContext.Provider>
  );
};