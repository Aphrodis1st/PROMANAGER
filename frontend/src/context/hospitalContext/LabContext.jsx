import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const LabContext = createContext();

export const LabProvider = ({ children }) => {
  const [tests, setTests] = useState([]);
  const [stats, setStats] = useState(null);
  const [labOrders, setLabOrders] = useState([]);
  const [labOrder, setLabOrder] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const fetchLabOrders = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getLabOrders();
      setLabOrders(res.data || res || []);
    } catch (error) {
      console.error("Failed to fetch lab orders:", error);
      setLabOrders([]);
    }
    setLoading(false);
  };

  const fetchLabOrderById = async (id) => {
    try {
      const res = await hospitalService.getLabOrderById(id);
      setLabOrder(res.data || res || null);
      return res.data || res || null;
    } catch (error) {
      console.error("Failed to fetch lab order:", error);
      setLabOrder(null);
      return null;
    }
  };

  const createLabOrder = async (data) => {
    try {
      const result = await hospitalService.createLabOrder(data);
      await fetchLabOrders();
      return result;
    } catch (error) {
      console.error("Failed to create lab order:", error);
      throw error;
    }
  };

  const submitLabResults = async (orderId, data) => {
    try {
      const result = await hospitalService.submitLabResults(orderId, data);
      await fetchLabOrders();
      return result;
    } catch (error) {
      console.error("Failed to submit lab results:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <LabContext.Provider value={{ tests, stats, labOrders, labOrder, loading, fetchTests, fetchLabStats, createTest, fetchLabOrders, fetchLabOrderById, createLabOrder, submitLabResults }}>
      {children}
    </LabContext.Provider>
  );
};