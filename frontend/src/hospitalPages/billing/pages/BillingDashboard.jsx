import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useBilling } from "../../../hooks/useBilling";

export default function BillingDashboard() {
  const navigate = useNavigate();
  const { stats, fetchBillingStats } = useBilling();

  useEffect(() => {
    fetchBillingStats();
  }, []);

  return (
    <>
      <PageHeader title="Billing Dashboard" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card>
          <h3>Today's Revenue</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#4caf50" }}>₹{stats?.todayRevenue || 0}</p>
        </Card>
        <Card>
          <h3>Pending Payments</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff9800" }}>₹{stats?.pendingPayments || 0}</p>
        </Card>
        <Card>
          <h3>Monthly Revenue</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2196f3" }}>₹{stats?.monthlyRevenue || 0}</p>
        </Card>
        <Card>
          <h3>Insurance Claims</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#9c27b0" }}>{stats?.insuranceClaims || 0}</p>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        <Button onClick={() => navigate("/hospital/billing/invoices")}>View Invoices</Button>
        <Button onClick={() => navigate("/hospital/billing/create")}>Create Invoice</Button>
        <Button onClick={() => navigate("/hospital/billing/reports")}>Revenue Reports</Button>
      </div>
    </>
  );
}
