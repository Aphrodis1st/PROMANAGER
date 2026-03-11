import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useLab } from "../../../hooks/useLab";

export default function LabTestList() {
  const navigate = useNavigate();
  const { labOrders, loading, fetchLabOrders, deleteLabOrder } = useLab();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchLabOrders();
  }, []);

  const handleDelete = async (id, patientName) => {
    if (window.confirm(`Delete lab order for ${patientName}?`)) {
      try {
        await deleteLabOrder(id);
      } catch (error) {
        alert("Failed to delete lab order");
      }
    }
  };

  const filteredOrders = filter === "All" 
    ? labOrders 
    : labOrders.filter(o => o.status === filter);

  const getStatusBadge = (status) => {
    const variants = {
      Pending: "warning",
      "Sample Collected": "info",
      "In Progress": "info",
      Completed: "success",
      Reviewed: "secondary",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      Routine: "success",
      Urgent: "warning",
      STAT: "danger",
    };
    return <Badge variant={variants[priority] || "secondary"}>{priority}</Badge>;
  };

  const columns = [
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
      label: "Tests Ordered",
      render: (row) => (
        <div>
          <div style={{ fontWeight: "500" }}>{row.tests?.length || 0} test(s)</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            {row.tests?.slice(0, 2).join(", ")}
            {row.tests?.length > 2 && ` +${row.tests.length - 2} more`}
          </div>
        </div>
      )
    },
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
    { 
      key: "orderedBy", 
      label: "Ordered By",
      render: (row) => (
        <div style={{ fontSize: "0.875rem" }}>{row.orderedBy}</div>
      )
    },
    { 
      key: "orderedAt", 
      label: "Order Date",
      render: (row) => new Date(row.orderedAt).toLocaleDateString()
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button size="sm" onClick={() => navigate(`/hospital/lab/orders/${row.id}/results`)}>
            {row.status === "Pending" ? "Process" : "View"}
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id, row.patientName)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader 
        title="Laboratory Orders" 
        action={
          <Button onClick={() => navigate("/hospital/lab/create")}>
            + Order Lab Tests
          </Button>
        }
      />
      
      <Card>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {["All", "Pending", "In Progress", "Completed"].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filter === status ? "primary" : "secondary"}
              onClick={() => setFilter(status)}
            >
              {status} ({status === "All" ? labOrders.length : labOrders.filter(o => o.status === status).length})
            </Button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading lab orders...</div>
        ) : filteredOrders.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredOrders}
            searchable
            sortable
            pagination
          />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No lab orders found.</p>
            <Button onClick={() => navigate("/hospital/lab/create")} style={{ marginTop: "1rem" }}>
              Order Lab Tests
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}
