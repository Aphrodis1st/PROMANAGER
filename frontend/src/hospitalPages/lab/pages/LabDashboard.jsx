import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useLab } from "../../../hooks/useLab";

export default function LabDashboard() {
  const navigate = useNavigate();
  const { labOrders, loading, fetchLabOrders } = useLab();

  useEffect(() => {
    fetchLabOrders();
  }, []);

  const stats = useMemo(() => {
    const pending = labOrders.filter(o => o.status === "Pending").length;
    const inProgress = labOrders.filter(o => o.status === "In Progress" || o.status === "Sample Collected").length;
    const completed = labOrders.filter(o => o.status === "Completed").length;
    const stat = labOrders.filter(o => o.priority === "STAT").length;
    const urgent = labOrders.filter(o => o.priority === "Urgent").length;
    
    return { pending, inProgress, completed, stat, urgent, total: labOrders.length };
  }, [labOrders]);

  return (
    <>
      <PageHeader 
        title="Laboratory Dashboard" 
        action={
          <Button onClick={() => navigate("/hospital/lab/create")}>
            + Order Lab Tests
          </Button>
        }
      />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#f59e0b" }}>{stats.pending}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Pending Orders</div>
            <Button size="sm" onClick={() => navigate("/hospital/lab/orders")} style={{ marginTop: "0.75rem" }}>
              View All
            </Button>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#3b82f6" }}>{stats.inProgress}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>In Progress</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#10b981" }}>{stats.completed}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Completed</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#ef4444" }}>{stats.stat}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>STAT Orders</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#8b5cf6" }}>{stats.urgent}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Urgent Orders</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#6b7280" }}>{stats.total}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Orders</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Button onClick={() => navigate("/hospital/lab/create")}>Order Lab Tests</Button>
            <Button variant="secondary" onClick={() => navigate("/hospital/lab/orders")}>View All Orders</Button>
            <Button variant="secondary" onClick={() => navigate("/hospital/patients")}>Select Patient</Button>
            <Button variant="secondary" onClick={() => navigate("/hospital/reports/lab")}>
              📊 Lab Analytics
            </Button>
          </div>
        </Card>
        
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Recent Activity</h3>
          {loading ? (
            <p style={{ color: "#6b7280" }}>Loading...</p>
          ) : labOrders.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {labOrders.slice(0, 5).map((order) => (
                <div key={order.id} style={{ padding: "0.5rem", borderLeft: "3px solid #3b82f6", backgroundColor: "#f9fafb" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600" }}>{order.patientName}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    {order.tests?.length || 0} test(s) - {order.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#6b7280" }}>No recent orders</p>
          )}
        </Card>
      </div>
    </>
  );
}
