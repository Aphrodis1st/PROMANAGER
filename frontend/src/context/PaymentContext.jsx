import React, { createContext, useContext, useState } from "react";
import { stockService, journalService } from "../services/stock.service";

const PaymentContext = createContext();

export const PaymentProvider = ({ children, accountSettings, updateInvoice }) => {
  const [payments, setPayments] = useState([]);

  const getAccountName = (id) => {
    const acc = accountSettings?.find((a) => a.id === id);
    return acc ? acc.name : id;
  };

  const createJournalEntry = async (entry) => {
    if (!Array.isArray(entry.lines) || entry.lines.length < 2) {
      throw new Error("Journal entry must have at least 2 lines");
    }
    const data = {
      date: entry.date,
      description: entry.description,
      referenceId: entry.referenceId,
      type: entry.type,
      lines: entry.lines.map((l) => ({
        accountId: l.accountId,
        accountName: l.accountName || getAccountName(l.accountId) || l.accountId,
        type: l.type,
        amount: Number(l.amount),
        note: l.note || "",
      })),
    };
    return await journalService.create(data);
  };

  const addPayment = async (data) => {
    const saved = await stockService.add("payment", data);
    setPayments((prev) => [...prev, saved]);

    await createJournalEntry({
      type: "payment",
      date: data.date || new Date().toISOString(),
      description: data.description || `Payment ${saved.id}`,
      referenceId: saved.id,
      lines: [
        {
          accountId: data.paymentType === "supplier" ? "accounts_payable" : "accounts_receivable",
          type: "debit",
          amount: Number(data.amount),
        },
        {
          accountId: data.cashOrBankAccountId,
          type: "credit",
          amount: Number(data.amount),
        },
      ],
    });

    const invoiceId = data.relatedInvoiceId || data.invoiceId;
    if (invoiceId && updateInvoice) {
      await updateInvoice(invoiceId, { status: "paid" });
    }

    return saved;
  };

  const updatePayment = async (id, data) => {
    const updated = await stockService.update("payment", id, data);
    setPayments((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deletePayment = async (id) => {
    await stockService.remove("payment", id);
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const getPaymentsBySupplier = (supplierId) =>
    payments.filter((p) => p.paymentType === "supplier" && p.relatedId === supplierId);

  const getPaymentsByCustomer = (customerId) =>
    payments.filter((p) => p.paymentType === "customer" && p.relatedId === customerId);

  return (
    <PaymentContext.Provider
      value={{
        payments,
        addPayment,
        updatePayment,
        deletePayment,
        getPaymentsBySupplier,
        getPaymentsByCustomer,
        setPayments,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
