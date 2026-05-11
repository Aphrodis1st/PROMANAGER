import React, { createContext, useContext, useState } from "react";
import { customerService } from "../services/stock.service";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (data) => {
    try {
      const newCustomer = await customerService.create(data);
      setCustomers((prev) => [...prev, newCustomer]);
      return newCustomer;
    } catch (error) {
      console.error("Error adding customer:", error);
      throw error;
    }
  };

  const updateCustomer = async (id, data) => {
    try {
      const updated = await customerService.update(id, data);
      setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await customerService.remove(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        fetchCustomers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        setCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);
