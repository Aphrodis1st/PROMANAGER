import React, { useState, useEffect } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Input from "../../../components/hospital/Input";
import Button from "../../../components/hospital/Button";
import { useBilling } from "../../../hooks/useBilling";

export default function RevenueReports() {
  const { revenueData, fetchRevenueReport } = useBilling();
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const handleGenerate = () => {
    fetchRevenueReport(dateRange);
  };

  return (
    <>
      <PageHeader title="Revenue Reports" />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "1rem", marginBottom: "2rem" }}>
          <Input
            type="date"
            label="Start Date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
          <Input
            type="date"
            label="End Date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
          <Button onClick={handleGenerate} style={{ alignSelf: "end" }}>Generate Report</Button>
        </div>
      </Card>

      {revenueData && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
            <Card>
              <h3>Total Revenue</h3>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#4caf50" }}>₹{revenueData.totalRevenue || 0}</p>
            </Card>
            <Card>
              <h3>Cash Payments</h3>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{revenueData.cashPayments || 0}</p>
            </Card>
            <Card>
              <h3>Card Payments</h3>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{revenueData.cardPayments || 0}</p>
            </Card>
            <Card>
              <h3>Insurance</h3>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{revenueData.insurancePayments || 0}</p>
            </Card>
          </div>

          <Card>
            <h3>Department-wise Revenue</h3>
            {revenueData.departmentRevenue?.map((dept) => (
              <div key={dept.name} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
                <span>{dept.name}</span>
                <strong>₹{dept.revenue}</strong>
              </div>
            ))}
          </Card>
        </>
      )}
    </>
  );
}
