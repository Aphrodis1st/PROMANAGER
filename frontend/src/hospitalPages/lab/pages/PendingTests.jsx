import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useLab } from "../../../hooks/useLab";

export default function PendingTests() {
  const navigate = useNavigate();
  const { labOrders, loading, fetchLabOrders } = useLab();

  useEffect(() => {
    fetchLabOrders();
  }, []);

  const pendingOrders = useMemo(() => {
    return labOrders.filter(o => 
      o.status === "Pending" || 
      o.status === "Sample Collected" || 
      o.status === "In Progress"
    );
  }, [labOrders]);

  const getPriorityBadge = (priority) => {
    const variants = {
      Routine: "success",
      Urgent: "warning",
      STAT: "danger",
    };
    return <Badge variant={variants[priority] || "secondary"}>{priority}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      Pending: "warning",
      "Sample Collected": "info",
      "In Progress": "info",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const columns = [
    { 
      key: "priority", 
      label: "Priority", 
      render: (row) => getPriorityBadge(row.priority) 
    },
    { 
      key: "patientName", 
      label: "Patient",
      render: (row) => (
        <div>
          <div style={{ fontWeight: "600" }}>{row.patientName}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>MRN: {row.patientId}</div>
        </div>
      )
    },
    { 
      key: "tests", 
      label: "Tests",
      render: (row) => (
        <div>
          <div style={{ fontWeight: "500" }}>{row.tests?.length || 0} test(s)</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            {row.tests?.slice(0, 3).join(", ")}
            {row.tests?.length > 3 && "..."}
          </div>
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status", 
      render: (row) => getStatusBadge(row.status) 
    },
    { 
      key: "orderedBy", 
      label: "Ordered By",
      render: (row) => <div style={{ fontSize: "0.875rem" }}>{row.orderedBy}</div>
    },
    { 
      key: "orderedAt", 
      label: "Order Time",
      render: (row) => {
        const date = new Date(row.orderedAt);
        return (
          <div>
            <div style={{ fontSize: "0.875rem" }}>{date.toLocaleDateString()}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{date.toLocaleTimeString()}</div>
          </div>
        );
      }
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button size="sm" onClick={() => navigate(`/hospital/lab/orders/${row.id}/results`)}>
          {row.status === "Pending" ? "Collect Sample" : "Enter Results"}
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Pending Lab Tests" />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#f59e0b" }}>
              {pendingOrders.filter(o => o.status === "Pending").length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Pending Collection</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6" }}>
              {pendingOrders.filter(o => o.status === "Sample Collected" || o.status === "In Progress").length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>In Progress</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ef4444" }}>
              {pendingOrders.filter(o => o.priority === "STAT").length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>STAT Priority</div>
          </div>
        </Card>
      </div>

      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading pending tests...</div>
        ) : pendingOrders.length > 0 ? (
          <DataTable
            columns={columns}
            data={pendingOrders}
            searchable
            sortable
            pagination
          />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "#10b981", fontSize: "1.125rem", fontWeight: "600" }}>
              ✓ All tests completed!
            </p>
            <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>No pending lab tests at this time.</p>
            <Button onClick={() => navigate("/hospital/lab/orders")} style={{ marginTop: "1rem" }}>
              View All Orders
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}
