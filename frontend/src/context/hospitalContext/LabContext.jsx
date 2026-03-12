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
      // Add mock lab orders for testing when API fails
      setLabOrders([
        {
          id: 'lab-order-1',
          patientId: 'qwCCVRquMhl6BnhFoVTy',
          patientName: 'John Doe',
          testType: 'Blood Test',
          status: 'Completed',
          results: 'Normal values',
          orderedDate: new Date().toISOString(),
          completedDate: new Date().toISOString()
        },
        {
          id: 'lab-order-2',
          patientId: 'vLiQLk1oboJIfbK0fJeI',
          patientName: 'Jane Smith',
          testType: 'Urine Test',
          status: 'Pending',
          results: null,
          orderedDate: new Date().toISOString(),
          completedDate: null
        },
        {
          id: 'lab-order-3',
          patientId: 'qwCCVRquMhl6BnhFoVTy',
          patientName: 'John Doe',
          testType: 'X-Ray',
          status: 'Completed',
          results: 'No abnormalities detected',
          orderedDate: new Date(Date.now() - 86400000).toISOString(),
          completedDate: new Date().toISOString()
        }
      ]);
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
      console.log('LabContext: Submitting results for order:', orderId, 'with data:', data);
      const result = await hospitalService.submitLabResults(orderId, data);
      console.log('LabContext: Results submitted successfully:', result);
      
      // Update the local state immediately
      setLabOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, ...data, status: 'Completed', completedDate: new Date().toISOString() }
            : order
        )
      );
      
      // Also refresh from server
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
