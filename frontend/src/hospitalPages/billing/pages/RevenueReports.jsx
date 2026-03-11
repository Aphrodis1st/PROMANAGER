import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useBilling } from "../../../hooks/useBilling";

export default function RevenueReports() {
  const navigate = useNavigate();
  const { invoices, insuranceClaims, loading, fetchInvoices } = useBilling();
  const [dateRange, setDateRange] = useState("thisMonth");
  const [reportType, setReportType] = useState("overview");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateRange) {
      case "today":
        return { start: today, end: new Date(today.getTime() + 86400000) };
      case "thisWeek":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return { start: weekStart, end: now };
      case "thisMonth":
        return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now };
      case "lastMonth":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start: lastMonth, end: lastMonthEnd };
      case "thisYear":
        return { start: new Date(now.getFullYear(), 0, 1), end: now };
      default:
        return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now };
    }
  };

  const filteredData = useMemo(() => {
    const { start, end } = getDateRange();
    
    const filteredInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.date);
      return invDate >= start && invDate <= end;
    });

    const filteredClaims = insuranceClaims.filter(claim => {
      const claimDate = new Date(claim.submittedDate);
      return claimDate >= start && claimDate <= end;
    });

    return { invoices: filteredInvoices, claims: filteredClaims };
  }, [invoices, insuranceClaims, dateRange]);

  const stats = useMemo(() => {
    const totalRevenue = filteredData.invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCollected = filteredData.invoices.reduce((sum, inv) => sum + inv.paid, 0);
    const totalOutstanding = filteredData.invoices.reduce((sum, inv) => sum + inv.balance, 0);
    
    const cashPayments = filteredData.invoices.filter(inv => inv.paymentMethod === "Cash").reduce((sum, inv) => sum + inv.paid, 0);
    const cardPayments = filteredData.invoices.filter(inv => inv.paymentMethod === "Credit Card" || inv.paymentMethod === "Debit Card").reduce((sum, inv) => sum + inv.paid, 0);
    const insurancePayments = filteredData.invoices.filter(inv => inv.paymentMethod === "Insurance").reduce((sum, inv) => sum + inv.paid, 0);
    const otherPayments = totalCollected - cashPayments - cardPayments - insurancePayments;

    const insuranceClaimed = filteredData.claims.reduce((sum, c) => sum + c.amount, 0);
    const insuranceApproved = filteredData.claims.reduce((sum, c) => sum + c.approved, 0);

    const collectionRate = totalRevenue > 0 ? ((totalCollected / totalRevenue) * 100).toFixed(1) : 0;

    return {
      totalRevenue,
      totalCollected,
      totalOutstanding,
      cashPayments,
      cardPayments,
      insurancePayments,
      otherPayments,
      insuranceClaimed,
      insuranceApproved,
      collectionRate,
      invoiceCount: filteredData.invoices.length,
      claimCount: filteredData.claims.length
    };
  }, [filteredData]);

  const paymentMethodData = [
    { method: "Cash", amount: stats.cashPayments, color: "#10b981" },
    { method: "Card", amount: stats.cardPayments, color: "#3b82f6" },
    { method: "Insurance", amount: stats.insurancePayments, color: "#8b5cf6" },
    { method: "Other", amount: stats.otherPayments, color: "#f59e0b" },
  ];

  const maxPayment = Math.max(...paymentMethodData.map(p => p.amount));

  return (
    <>
      <PageHeader 
        title="Revenue Reports & Analytics" 
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button variant="secondary" onClick={() => window.print()}>
              Print Report
            </Button>
            <Button onClick={() => alert("Export functionality coming soon!")}>
              Export to Excel
            </Button>
          </div>
        }
      />

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ 
              padding: "0.5rem 1rem", 
              border: "1px solid #d1d5db", 
              borderRadius: "0.5rem",
              fontSize: "0.875rem"
            }}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            style={{ 
              padding: "0.5rem 1rem", 
              border: "1px solid #d1d5db", 
              borderRadius: "0.5rem",
              fontSize: "0.875rem"
            }}
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed</option>
            <option value="comparison">Comparison</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6" }}>
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Revenue</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
              {stats.invoiceCount} invoice(s)
            </div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#10b981" }}>
              ${stats.totalCollected.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Collected</div>
            <Badge variant="success" style={{ marginTop: "0.25rem" }}>
              {stats.collectionRate}% Rate
            </Badge>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ef4444" }}>
              ${stats.totalOutstanding.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Outstanding</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#8b5cf6" }}>
              ${stats.insuranceApproved.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Insurance Approved</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
              {stats.claimCount} claim(s)
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
            Revenue by Payment Method
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {paymentMethodData.map((item) => (
              <div key={item.method}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>{item.method}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: "700", color: item.color }}>
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
                <div style={{ 
                  width: "100%", 
                  height: "24px", 
                  backgroundColor: "#e5e7eb", 
                  borderRadius: "4px",
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    width: `${maxPayment > 0 ? (item.amount / maxPayment) * 100 : 0}%`, 
                    height: "100%", 
                    backgroundColor: item.color,
                    transition: "width 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "0.5rem"
                  }}>
                    <span style={{ fontSize: "0.75rem", color: "white", fontWeight: "600" }}>
                      {stats.totalCollected > 0 ? ((item.amount / stats.totalCollected) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
            Collection Summary
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ 
              padding: "1rem", 
              backgroundColor: "#f0f9ff", 
              borderRadius: "0.5rem",
              borderLeft: "4px solid #3b82f6"
            }}>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                Collection Rate
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3b82f6" }}>
                {stats.collectionRate}%
              </div>
            </div>

            <div style={{ 
              padding: "1rem", 
              backgroundColor: "#f0fdf4", 
              borderRadius: "0.5rem",
              borderLeft: "4px solid #10b981"
            }}>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                Average Invoice
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#10b981" }}>
                ${stats.invoiceCount > 0 ? (stats.totalRevenue / stats.invoiceCount).toFixed(0) : 0}
              </div>
            </div>

            <div style={{ 
              padding: "1rem", 
              backgroundColor: "#fef3c7", 
              borderRadius: "0.5rem",
              borderLeft: "4px solid #f59e0b"
            }}>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                Pending Collection
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#f59e0b" }}>
                ${stats.totalOutstanding.toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
          Insurance Claims Analysis
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          <div style={{ 
            padding: "1rem", 
            backgroundColor: "#f9fafb", 
            borderRadius: "0.5rem",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
              Total Claimed
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#3b82f6" }}>
              ${stats.insuranceClaimed.toLocaleString()}
            </div>
          </div>

          <div style={{ 
            padding: "1rem", 
            backgroundColor: "#f9fafb", 
            borderRadius: "0.5rem",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
              Total Approved
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#10b981" }}>
              ${stats.insuranceApproved.toLocaleString()}
            </div>
          </div>

          <div style={{ 
            padding: "1rem", 
            backgroundColor: "#f9fafb", 
            borderRadius: "0.5rem",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
              Approval Rate
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#8b5cf6" }}>
              {stats.insuranceClaimed > 0 ? ((stats.insuranceApproved / stats.insuranceClaimed) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
