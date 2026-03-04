import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import DataTable from "../../../components/hospital/DataTable";
import { useLab } from "../../../hooks/useLab";

export default function LabOrderList() {
  const { labOrders, loading, fetchLabOrders } = useLab();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLabOrders();
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      Pending: "#ff9800",
      "Sample Collected": "#2196f3",
      "In Progress": "#9c27b0",
      Completed: "#4caf50",
      Reviewed: "#607d8b",
    };
    return (
      <span style={{ 
        padding: "0.25rem 0.75rem", 
        borderRadius: "1rem", 
        backgroundColor: colors[status] || "#gray",
        color: "white",
        fontSize: "0.75rem"
      }}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      Routine: "#4caf50",
      Urgent: "#ff9800",
      STAT: "#f44336",
    };
    return (
      <span style={{ 
        padding: "0.25rem 0.75rem", 
        borderRadius: "1rem", 
        backgroundColor: colors[priority] || "#gray",
        color: "white",
        fontSize: "0.75rem",
        fontWeight: "bold"
      }}>
        {priority}
      </span>
    );
  };

  const columns = [
    { key: "patientName", label: "Patient" },
    { key: "tests", label: "Tests", render: (row) => row.tests?.join(", ") || "" },
    { 
      key: "priority", 
      label: "Priority", 
      render: (row) => getPriorityBadge(row.priority) 
    },
    { 
      key: "status", 
      label: "Status", 
      render: (row) => getStatusBadge(row.status) 
    },
    { key: "orderedBy", label: "Ordered By" },
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
      <PageHeader title="Laboratory Orders" />
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading orders...</div>
        ) : labOrders && labOrders.length > 0 ? (
          <DataTable columns={columns} data={labOrders} />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No lab orders found.</p>
          </div>
        )}
      </Card>
    </>
  );
}
