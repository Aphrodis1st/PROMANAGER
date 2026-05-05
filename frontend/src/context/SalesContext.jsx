import React, { createContext, useContext, useState } from "react";
import { stockService } from "../services/stock.service";

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);

  const addCustomer = async (data) => {
    const newCustomer = await stockService.add("customer", data);
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = async (id, data) => {
    const updated = await stockService.update("customer", id, data);
    setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteCustomer = async (id) => {
    await stockService.remove("customer", id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const addSale = async (data) => {
    console.log('📥 Adding sale with data:', data);
    const saved = await stockService.add("sales", data);
    console.log('✅ Sale saved:', saved);

    const normalizedSale = {
      ...saved,
      items: Array.isArray(saved.items)
        ? saved.items.map((item) => ({
            productId: item.productId || '',
            productName: item.productName || '',
            description: item.description || '',
            quantity: Number(item.quantity) || 0,
            unit: item.unit || '',
            unitPrice: Number(item.unitPrice) || 0,
            discount: Number(item.discount) || 0,
            tax: Number(item.tax) || 0,
            totalPrice: Number(item.totalPrice) || 0,
            batchNumber: item.batchNumber || '',
            expirationDate: item.expirationDate || '',
            qualityGrade: item.qualityGrade || '',
            warranty: item.warranty || '',
            serialNumber: item.serialNumber || '',
            storeLocation: item.storeLocation || '',
            productCategory: item.productCategory || '',
          }))
        : [],
      totalPrice: Number(saved.totalPrice) || 0,
    };

    console.log('✅ Normalized sale:', normalizedSale);
    setSales((prev) => [...prev, normalizedSale]);
    return normalizedSale;
  };



  return (
    <SalesContext.Provider
      value={{
        sales,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addSale,
        setSales,
        setCustomers,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
