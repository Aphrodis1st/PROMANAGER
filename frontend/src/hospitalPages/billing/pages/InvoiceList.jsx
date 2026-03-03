import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import { useBilling } from "../../../hooks/useBilling";

export default function InvoiceList() {
  const navigate = useNavigate();
  const { invoices, loading, fetchInvoices } = useBilling();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const columns = [
    { key: "invoiceNumber", label: "Invoice #" },
    { key: "patientName", label: "Patient" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
    { key: "paymentMethod", label: "Payment Method" },
  ];

  return (
    <>
      <PageHeader title="Invoices" />
      <Card>
        <div style={{ marginBottom: "1rem" }}>
          <Button onClick={() => navigate("/hospital/billing/create")}>Create Invoice</Button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            data={invoices}
            columns={columns}
            onRowClick={(invoice) => navigate(`/hospital/billing/payment/${invoice.id}`)}
          />
        )}
      </Card>
    </>
  );
}
