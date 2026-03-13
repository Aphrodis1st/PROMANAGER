import { createContext, useEffect, useState } from "react";
import hospitalService from "../../services/hospitalService";
import { INSURANCE_PROVIDERS, PAYMENT_METHODS } from "../../constants/insuranceProviders";

export const BillingContext = createContext();

const MOCK_INVOICES = [
  { id: 1, invoiceNumber: "INV-2024-001", patientId: "P001", patientName: "John Doe", amount: 5500, paid: 5500, balance: 0, status: "Paid", date: "2024-01-15", dueDate: "2024-01-30", paymentMethod: "Insurance", insuranceProvider: "Blue Cross Blue Shield" },
  { id: 2, invoiceNumber: "INV-2024-002", patientId: "P002", patientName: "Jane Smith", amount: 12000, paid: 8000, balance: 4000, status: "Partial", date: "2024-01-18", dueDate: "2024-02-02", paymentMethod: "Cash", insuranceProvider: null },
  { id: 3, invoiceNumber: "INV-2024-003", patientId: "P003", patientName: "Bob Johnson", amount: 3200, paid: 0, balance: 3200, status: "Pending", date: "2024-01-20", dueDate: "2024-02-05", paymentMethod: null, insuranceProvider: null },
  { id: 4, invoiceNumber: "INV-2024-004", patientId: "P004", patientName: "Alice Brown", amount: 8500, paid: 8500, balance: 0, status: "Paid", date: "2024-01-22", dueDate: "2024-02-07", paymentMethod: "Credit Card", insuranceProvider: null },
];

const MOCK_INSURANCE_CLAIMS = [
  { id: 1, claimNumber: "CLM-2024-001", patientName: "John Doe", provider: "Blue Cross Blue Shield", amount: 5500, approved: 5500, status: "Approved", submittedDate: "2024-01-16", processedDate: "2024-01-20" },
  { id: 2, claimNumber: "CLM-2024-002", patientName: "Sarah Wilson", provider: "Aetna", amount: 7200, approved: 0, status: "Pending", submittedDate: "2024-01-21", processedDate: null },
  { id: 3, claimNumber: "CLM-2024-003", patientName: "Mike Davis", provider: "United Healthcare", amount: 4500, approved: 3800, status: "Partial", submittedDate: "2024-01-18", processedDate: "2024-01-23" },
];

export const BillingProvider = ({ children }) => {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [insuranceClaims, setInsuranceClaims] = useState(MOCK_INSURANCE_CLAIMS);
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS.map(m => ({ ...m, status: "Active" })));
  const [loading, setLoading] = useState(false);

  const fetchInsuranceProviders = async () => {
    try {
      const res = await hospitalService.getInsuranceProviders();
      if (res.data && res.data.length > 0) {
        setInsuranceProviders(res.data);
      } else {
        setInsuranceProviders(INSURANCE_PROVIDERS);
      }
    } catch (error) {
      console.error("Failed to fetch insurance providers:", error);
      setInsuranceProviders(INSURANCE_PROVIDERS);
    }
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getBills();
      if (res.data && res.data.length > 0) {
        setInvoices(res.data);
      } else {
        setInvoices(MOCK_INVOICES);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      setInvoices(MOCK_INVOICES);
    }
    setLoading(false);
  };

  const getInvoiceById = (id) => {
    return invoices.find(inv => inv.id === parseInt(id)) || null;
  };

  const createInvoice = async (data) => {
    try {
      const newInvoice = {
        id: invoices.length + 1,
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        ...data,
        balance: data.amount - (data.paid || 0),
        status: data.paid >= data.amount ? "Paid" : data.paid > 0 ? "Partial" : "Pending",
        date: new Date().toISOString().split('T')[0]
      };
      
      setInvoices([newInvoice, ...invoices]);

      try {
        await hospitalService.createBill(data);
      } catch (err) {
        console.warn("Backend create failed, using local state");
      }
    } catch (error) {
      console.error("Failed to create invoice:", error);
      throw error;
    }
  };

  const processPayment = async (invoiceId, paymentData) => {
    try {
      const updatedInvoices = invoices.map(inv => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paid + paymentData.amount;
          const newBalance = inv.amount - newPaid;
          return {
            ...inv,
            paid: newPaid,
            balance: newBalance,
            status: newBalance === 0 ? "Paid" : "Partial",
            paymentMethod: paymentData.method,
            insuranceProvider: paymentData.insuranceProvider || inv.insuranceProvider,
            lastPaymentDate: new Date().toISOString().split('T')[0]
          };
        }
        return inv;
      });
      
      setInvoices(updatedInvoices);

      try {
        await hospitalService.payBill(invoiceId);
      } catch (err) {
        console.warn("Backend payment failed, using local state");
      }
    } catch (error) {
      console.error("Failed to process payment:", error);
      throw error;
    }
  };

  const deleteInvoice = async (id) => {
    try {
      setInvoices(invoices.filter(inv => inv.id !== id));
      try {
        await hospitalService.deleteBill(id);
      } catch (err) {
        console.warn("Backend delete failed, using local state");
      }
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      throw error;
    }
  };

  const submitInsuranceClaim = async (data) => {
    try {
      const newClaim = {
        id: insuranceClaims.length + 1,
        claimNumber: `CLM-2024-${String(insuranceClaims.length + 1).padStart(3, '0')}`,
        ...data,
        status: "Pending",
        approved: 0,
        submittedDate: new Date().toISOString().split('T')[0],
        processedDate: null
      };
      
      setInsuranceClaims([newClaim, ...insuranceClaims]);
    } catch (error) {
      console.error("Failed to submit claim:", error);
      throw error;
    }
  };

  const updateClaimStatus = async (claimId, status, approvedAmount) => {
    try {
      const updatedClaims = insuranceClaims.map(claim => {
        if (claim.id === claimId) {
          return {
            ...claim,
            status,
            approved: approvedAmount || claim.approved,
            processedDate: new Date().toISOString().split('T')[0]
          };
        }
        return claim;
      });
      
      setInsuranceClaims(updatedClaims);
    } catch (error) {
      console.error("Failed to update claim:", error);
      throw error;
    }
  };

  const addInsuranceProvider = async (provider) => {
    try {
      const res = await hospitalService.createInsuranceProvider(provider);
      if (res.data) {
        setInsuranceProviders([...insuranceProviders, res.data]);
      } else {
        const newProvider = {
          id: insuranceProviders.length + 1,
          ...provider,
          status: "Active"
        };
        setInsuranceProviders([...insuranceProviders, newProvider]);
      }
    } catch (error) {
      console.error("Failed to add insurance provider:", error);
      const newProvider = {
        id: insuranceProviders.length + 1,
        ...provider,
        status: "Active"
      };
      setInsuranceProviders([...insuranceProviders, newProvider]);
    }
  };

  const updateInsuranceProvider = async (id, updates) => {
    try {
      const res = await hospitalService.updateInsuranceProvider(id, updates);
      if (res.data) {
        setInsuranceProviders(insuranceProviders.map(p => 
          p.id === id ? res.data : p
        ));
      } else {
        setInsuranceProviders(insuranceProviders.map(p => 
          p.id === id ? { ...p, ...updates } : p
        ));
      }
    } catch (error) {
      console.error("Failed to update insurance provider:", error);
      setInsuranceProviders(insuranceProviders.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ));
    }
  };

  const deleteInsuranceProvider = async (id) => {
    try {
      await hospitalService.deleteInsuranceProvider(id);
      setInsuranceProviders(insuranceProviders.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete insurance provider:", error);
      setInsuranceProviders(insuranceProviders.filter(p => p.id !== id));
    }
  };

  const updatePaymentMethod = (idOrData, updates) => {
    if (typeof idOrData === 'object') {
      // Adding new payment method
      const newMethod = {
        id: paymentMethods.length + 1,
        ...idOrData
      };
      setPaymentMethods([...paymentMethods, newMethod]);
    } else {
      // Updating existing payment method
      setPaymentMethods(paymentMethods.map(m => 
        m.id === idOrData ? { ...m, ...updates } : m
      ));
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchInsuranceProviders();
  }, []);

  return (
    <BillingContext.Provider value={{ 
      invoices, 
      insuranceClaims,
      insuranceProviders,
      paymentMethods,
      loading, 
      fetchInvoices, 
      getInvoiceById,
      createInvoice, 
      processPayment,
      deleteInvoice,
      submitInsuranceClaim,
      updateClaimStatus,
      addInsuranceProvider,
      updateInsuranceProvider,
      deleteInsuranceProvider,
      updatePaymentMethod
    }}>
      {children}
    </BillingContext.Provider>
  );
};
