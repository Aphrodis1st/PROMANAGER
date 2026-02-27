import React, { createContext, useContext, useState } from "react";
import { stockService, journalService } from "../services/stock.service";

const PurchaseContext = createContext();

export const PurchaseProvider = ({ children, accountSettings }) => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [invoices, setInvoices] = useState([]);

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

  const addSupplier = async (data) => {
    const newSupplier = await stockService.add("supplier", data);
    setSuppliers((prev) => [...prev, newSupplier]);
    return newSupplier;
  };

  const updateSupplier = async (id, data) => {
    const updated = await stockService.update("supplier", id, data);
    setSuppliers((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const deleteSupplier = async (id) => {
    await stockService.remove("supplier", id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  const addInvoice = async (data) => {
    const response = await stockService.add("invoice", data);
    const savedInvoice = response.data || response;
    setInvoices((prev) => [...prev, savedInvoice]);
    return savedInvoice;
  };

  const updateInvoice = async (id, data) => {
    const response = await stockService.update("invoice", id, data);
    const updatedInvoice = response.data || response;
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updatedInvoice } : inv))
    );
    return updatedInvoice;
  };

  const deleteInvoice = async (id) => {
    await stockService.remove("invoice", id);
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const getInvoicesBySupplier = (supplierId) =>
    invoices.filter((inv) => inv.supplierId === supplierId);

  const addPurchase = async (data) => {
    const saved = await stockService.add("purchase", data);
    setPurchases((prev) => [...prev, saved]);

    await createJournalEntry({
      type: "purchase",
      date: new Date().toISOString(),
      description: data.description || `Purchase of ${data.productName}`,
      referenceId: saved.id,
      lines: [
        {
          accountId: data.inventoryAccountId,
          accountName: getAccountName(data.inventoryAccountId),
          type: "debit",
          amount: Number(data.totalPrice),
        },
        {
          accountId: data.paymentAccountId,
          accountName: getAccountName(data.paymentAccountId),
          type: "credit",
          amount: Number(data.totalPrice),
        },
      ],
    });

    return saved;
  };

  const approveInvoice = async (invoiceId, addPurchaseFn) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;

    for (const item of invoice.items) {
      if (!item.productId || !item.inventoryAccountId) continue;

      await addPurchaseFn({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.total,
        supplierId: invoice.supplierId,
        invoiceId: invoice.id,
        inventoryAccountId: item.inventoryAccountId,
        paymentAccountId: "accounts_payable",
        date: invoice.date,
        description: `Purchase from Invoice ${invoice.number}`,
      });
    }

    await updateInvoice(invoiceId, { status: "approved" });
  };



  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        suppliers,
        invoices,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoicesBySupplier,
        addPurchase,
        approveInvoice,
        setPurchases,
        setSuppliers,
        setInvoices,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => useContext(PurchaseContext);
