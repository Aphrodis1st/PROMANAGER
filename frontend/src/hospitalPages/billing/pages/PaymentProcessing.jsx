import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Input from "../../../components/hospital/Input";
import Select from "../../../components/hospital/Select";
import Button from "../../../components/hospital/Button";
import { useBilling } from "../../../hooks/useBilling";

export default function PaymentProcessing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoice, fetchInvoiceById, processPayment } = useBilling();
  const [formData, setFormData] = useState({
    amount: 0,
    paymentMethod: "Cash",
    transactionId: "",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      fetchInvoiceById(id);
    }
  }, [id]);

  useEffect(() => {
    if (invoice) {
      setFormData({ ...formData, amount: invoice.amount });
    }
  }, [invoice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await processPayment(id, formData);
    navigate("/hospital/billing/invoices");
  };

  return (
    <>
      <PageHeader title="Process Payment" />
      <Card>
        <h3>Invoice Details</h3>
        <p><strong>Invoice #:</strong> {invoice?.invoiceNumber}</p>
        <p><strong>Patient:</strong> {invoice?.patientName}</p>
        <p><strong>Amount Due:</strong> ₹{invoice?.amount}</p>
        <p><strong>Status:</strong> {invoice?.status}</p>
      </Card>

      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            type="number"
            label="Payment Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            required
          />

          <Select
            label="Payment Method"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            required
          >
            <option value="Cash">Cash</option>
            <option value="Card">Credit/Debit Card</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Insurance">Insurance</option>
          </Select>

          <Input
            label="Transaction ID / Reference"
            value={formData.transactionId}
            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
          />

          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <Button type="submit">Process Payment</Button>
        </form>
      </Card>
    </>
  );
}
