import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";

export const LabContext = createContext();

export const LabProvider = ({ children }) => {
  const [labOrders, setLabOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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
      return res.data || res || null;
    } catch (error) {
      console.error("Failed to fetch lab order:", error);
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

  const deleteLabOrder = async (id) => {
    try {
      setLabOrders(labOrders.filter(o => o.id !== id));
      try {
        await hospitalService.deleteLabTest(id);
      } catch (err) {
        console.warn("Backend delete failed, using local state");
      }
    } catch (error) {
      console.error("Failed to delete lab order:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchLabOrders();
  }, []);

  return (
    <LabContext.Provider value={{ labOrders, loading, fetchLabOrders, fetchLabOrderById, createLabOrder, submitLabResults, deleteLabOrder }}>
      {children}
    </LabContext.Provider>
  );
};
