import React, { createContext, useContext } from "react";

const ReportContext = createContext();

export const ReportProvider = ({ children, products, purchases, sales, invoices }) => {
  const parseDate = (d) => {
    if (!d) return null;
    if (d?._seconds !== undefined)
      return new Date(d._seconds * 1000 + (d._nanoseconds || 0) / 1000000);
    if (d?.seconds !== undefined) return new Date(d.seconds * 1000);
    if (d instanceof Date) return d;
    if (typeof d === "string") return new Date(d);
    return null;
  };

  const generateReport = (type, startDate, endDate) => {
    if (!type) return [];

    const start = startDate ? parseDate(startDate) : null;
    const end = endDate ? parseDate(endDate) : null;

    const inRange = (d) => {
      const date = parseDate(d);
      if (!date) return false;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    };

    if (type === "sale") {
      const result = [];
      sales.forEach((s) => {
        if (!Array.isArray(s.items)) return;
        s.items.forEach((i) => {
          const date = s.createdAt || s.date;
          if (!inRange(date)) return;
          result.push({
            date,
            productId: i.productId || "",
            productName: i.productName || "",
            unit: i.unit || "",
            quantity: Number(i.quantity || 0),
            unitPrice: Number(i.unitPrice || 0),
            totalPrice: Number(i.totalPrice || 0),
          });
        });
      });
      return result;
    }

    if (type === "purchase") {
      const result = [];
      invoices.forEach((inv) => {
        if (!Array.isArray(inv.items)) return;
        inv.items.forEach((i) => {
          const date = inv.createdAt || inv.date;
          if (!inRange(date)) return;
          result.push({
            date,
            productId: i.productId || "",
            productName: i.productName || "",
            unit: i.unit || "",
            quantity: Number(i.quantity || 0),
            unitPrice: Number(i.unitPrice || 0),
            totalPrice: Number(i.totalPrice || 0),
          });
        });
      });
      return result;
    }

    if (type === "opening qty") {
      return products.map((p) => {
        const openingQty = Number(p.openingStock || 0);
        const price = Number(p.buyingPrice || 0);
        return {
          productName: p.name || "",
          category: p.category || "",
          unit: p.unit || "",
          reportQty: openingQty,
          unitPrice: price,
          totalPrice: openingQty * price,
        };
      });
    }

    if (type === "closing qty") {
      const purchaseMap = {};
      invoices.forEach((inv) => {
        inv.items?.forEach((i) => {
          if (!i.productId) return;
          purchaseMap[i.productId] =
            (purchaseMap[i.productId] || 0) + Number(i.quantity || 0);
        });
      });

      const salesMap = {};
      sales.forEach((s) => {
        s.items?.forEach((i) => {
          if (!i.productId) return;
          salesMap[i.productId] =
            (salesMap[i.productId] || 0) + Number(i.quantity || 0);
        });
      });

      return products.map((p) => {
        const opening = Number(p.openingStock || 0);
        const purchased = purchaseMap[p.id] || 0;
        const sold = salesMap[p.id] || 0;
        const closing = opening + purchased - sold;
        const price = Number(p.buyingPrice || 0);
        return {
          productName: p.name || "",
          category: p.category || "",
          unit: p.unit || "",
          reportQty: closing,
          unitPrice: price,
          totalPrice: closing * price,
        };
      });
    }

    return [];
  };

  const getTotalPurchases = (startDate, endDate) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const filtered = purchases.filter((p) => {
      const d = p.date ? new Date(p.date) : null;
      if (!d) return false;
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });

    const totalQty = filtered.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
    const totalValue = filtered.reduce(
      (sum, p) => sum + (Number(p.quantity) || 0) * (Number(p.unitPrice) || 0),
      0
    );

    return { totalQty, totalValue };
  };

  const getTotalSales = (startDate, endDate) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const filtered = sales.filter((s) => {
      const d = s.date ? new Date(s.date) : null;
      if (!d) return false;
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });

    const totalQty = filtered.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    const totalValue = filtered.reduce(
      (sum, s) => sum + (Number(s.quantity) || 0) * (Number(s.unitPrice) || 0),
      0
    );

    return { totalQty, totalValue };
  };

  return (
    <ReportContext.Provider
      value={{
        generateReport,
        getTotalPurchases,
        getTotalSales,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);
