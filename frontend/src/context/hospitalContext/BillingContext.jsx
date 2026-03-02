import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const BillingContext = createContext();

export const BillingProvider = ({ children }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBills = async () => {
    setLoading(true);
    const res = await hospitalService.getBills();
    setBills(res.data);
    setLoading(false);
  };

  const createBill = async (data) => {
    await hospitalService.createBill(data);
    fetchBills();
  };

  const payBill = async (id) => {
    await hospitalService.payBill(id);
    fetchBills();
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <BillingContext.Provider value={{ bills, loading, fetchBills, createBill, payBill }}>
      {children}
    </BillingContext.Provider>
  );
};