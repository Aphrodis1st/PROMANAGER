import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const WardContext = createContext();

export const WardProvider = ({ children }) => {
  const [wards, setWards] = useState([]);

  const fetchWards = async () => {
    const res = await hospitalService.getWards();
    setWards(res.data);
  };

  const assignBed = async (data) => {
    await hospitalService.assignBed(data);
    fetchWards();
  };

  useEffect(() => {
    fetchWards();
  }, []);

  return (
    <WardContext.Provider value={{ wards, fetchWards, assignBed }}>
      {children}
    </WardContext.Provider>
  );
};