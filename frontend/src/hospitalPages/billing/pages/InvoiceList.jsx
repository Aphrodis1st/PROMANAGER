import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useBilling } from "../../../hooks/useBilling";

export default function InvoiceList() {
  const navigate = useNavigate();
  const { invoices, loading, fetchInvoices, deleteInvoice } = useBilling();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id, invoiceNumber) => {
    if (window.confirm(`Delete invoice ${invoiceNumber}?`)) {
      try {
        await deleteInvoice(id);
        alert("Invoice deleted successfully");
      } catch (error) {
        alert("Failed to delete invoice");
      }
    }
  };

  const filteredInvoices = filter === "All" 
    ? invoices 
    : invoices.filter(inv => inv.status === filter);

  const getStatusBadge = (status) => {
    const variants = {
      Paid: "success",
      Partial: "warning",
      Pending: "danger",
      Overdue: "danger"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const columns = [
    { 
      key: "invoiceNumber", 
      label: "Invoice #",
      render: (row) => (
        <div style={{ fontWeight: "600" }}>{row.invoiceNumber}</div>
      )
    },
    { 
      key: "patientName", 
      label: "Patient",
      render: (row) => (
        <div>
          <div style={{ fontWeight: "600" }}>{row.patientName}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>ID: {row.patientId}</div>
        </div>
      )
    },
    { 
      key: "date", 
      label: "Invoice Date",
      render: (row) => new Date(row.date).toLocaleDateString()
    },
    { 
      key: "dueDate", 
      label: "Due Date",
      render: (row) => new Date(row.dueDate).toLocaleDateString()
    },
    { 
      key: "amount", 
      label: "Amount",
      render: (row) => (
        <div style={{ fontWeight: "600", fontSize: "1rem" }}>
          ${row.amount.toLocaleString()}
        </div>
      )
    },
    { 
      key: "paid", 
      label: "Paid",
      render: (row) => (
        <div style={{ color: "#10b981", fontWeight: "600" }}>
          ${row.paid.toLocaleString()}
        </div>
      )
    },
    { 
      key: "balance", 
      label: "Balance",
      render: (row) => (
        <div style={{ color: row.balance > 0 ? "#ef4444" : "#6b7280", fontWeight: "600" }}>
          ${row.balance.toLocaleString()}
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button size="sm" onClick={() => navigate(`/hospital/billing/invoice/${row.id}`)}>
            View
          </Button>
          {row.balance > 0 && (
            <Button size="sm" variant="secondary" onClick={() => navigate(`/hospital/billing/payment?invoiceId=${row.id}`)}>
              Pay
            </Button>
          )}
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id, row.invoiceNumber)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = filteredInvoices.reduce((sum, inv) => sum + inv.paid, 0);
  const totalBalance = filteredInvoices.reduce((sum, inv) => sum + inv.balance, 0);

  return (
    <>
      <PageHeader 
        title="Invoices" 
        action={
          <Button onClick={() => navigate("/hospital/billing/create")}>
            + Create Invoice
          </Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6" }}>
              ${totalAmount.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Amount</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#10b981" }}>
              ${totalPaid.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Paid</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ef4444" }}>
              ${totalBalance.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Balance</div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {["All", "Paid", "Partial", "Pending"].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filter === status ? "primary" : "secondary"}
              onClick={() => setFilter(status)}
            >
              {status} ({status === "All" ? invoices.length : invoices.filter(inv => inv.status === status).length})
            </Button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading invoices...</div>
        ) : filteredInvoices.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredInvoices}
            searchable
            sortable
            pagination
          />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No invoices found.</p>
            <Button onClick={() => navigate("/hospital/billing/create")} style={{ marginTop: "1rem" }}>
              Create First Invoice
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}
