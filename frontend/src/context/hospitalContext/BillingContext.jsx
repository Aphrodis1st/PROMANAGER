import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const BillingContext = createContext();

export const BillingProvider = ({ children }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getBills();
      setBills(res.data || []);
    } catch (error) {
      console.error("Failed to fetch bills:", error);
      setBills([]);
    }
    setLoading(false);
  };

  const fetchBillingStats = async () => {
    setStats({ todayRevenue: 0, pendingPayments: 0, monthlyRevenue: 0, insuranceClaims: 0 });
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
    <BillingContext.Provider value={{ bills, stats, loading, fetchBills, fetchBillingStats, createBill, payBill }}>
      {children}
    </BillingContext.Provider>
  );
};