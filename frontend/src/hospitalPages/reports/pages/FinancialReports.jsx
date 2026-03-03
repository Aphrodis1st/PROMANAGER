import React, { useEffect } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { useReports } from "../../../hooks/useReports";

export default function FinancialReports() {
  const { financialStats, fetchFinancialReports } = useReports();

  useEffect(() => {
    fetchFinancialReports();
  }, []);

  return (
    <>
      <PageHeader title="Financial Reports" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card>
          <h3>Today's Revenue</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#4caf50" }}>₹{financialStats?.todayRevenue || 0}</p>
        </Card>
        <Card>
          <h3>This Month</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2196f3" }}>₹{financialStats?.monthRevenue || 0}</p>
        </Card>
        <Card>
          <h3>This Year</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#9c27b0" }}>₹{financialStats?.yearRevenue || 0}</p>
        </Card>
        <Card>
          <h3>Outstanding</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9800" }}>₹{financialStats?.outstanding || 0}</p>
        </Card>
      </div>

      <Card>
        <h3>Revenue by Department</h3>
        {financialStats?.departmentRevenue?.map((dept) => (
          <div key={dept.name} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <span>{dept.name}</span>
            <strong>₹{dept.revenue}</strong>
          </div>
        ))}
      </Card>

      <Card>
        <h3>Payment Methods</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{financialStats?.paymentMethods?.cash || 0}</p>
            <p>Cash</p>
          </div>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{financialStats?.paymentMethods?.card || 0}</p>
            <p>Card</p>
          </div>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{financialStats?.paymentMethods?.upi || 0}</p>
            <p>UPI</p>
          </div>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{financialStats?.paymentMethods?.insurance || 0}</p>
            <p>Insurance</p>
          </div>
        </div>
      </Card>
    </>
  );
}
