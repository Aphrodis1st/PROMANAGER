import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Input from "../../../components/hospital/Input";
import Select from "../../../components/hospital/Select";
import Button from "../../../components/hospital/Button";
import { useBilling } from "../../../hooks/useBilling";
import { usePatients } from "../../../hooks/usePatients";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { createInvoice } = useBilling();
  const { patients, fetchPatients } = usePatients();
  const [formData, setFormData] = useState({
    patientId: "",
    items: [{ description: "", quantity: 1, rate: 0 }],
    discount: 0,
    tax: 0,
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, rate: 0 }],
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const afterDiscount = subtotal - formData.discount;
    const total = afterDiscount + (afterDiscount * formData.tax) / 100;
    return total.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createInvoice({ ...formData, total: calculateTotal() });
    navigate("/hospital/billing/invoices");
  };

  return (
    <>
      <PageHeader title="Create Invoice" />
      <Card>
        <form onSubmit={handleSubmit}>
          <Select
            label="Patient"
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            required
          >
            <option value="">Select Patient</option>
            {patients?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.mrn}
              </option>
            ))}
          </Select>

          <h3>Invoice Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                required
              />
              <Input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) => updateItem(index, "rate", Number(e.target.value))}
                required
              />
            </div>
          ))}
          <Button type="button" onClick={addItem}>Add Item</Button>

          <div style={{ marginTop: "2rem" }}>
            <Input
              type="number"
              label="Discount (₹)"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
            />
            <Input
              type="number"
              label="Tax (%)"
              value={formData.tax}
              onChange={(e) => setFormData({ ...formData, tax: Number(e.target.value) })}
            />
            <h3>Total: ₹{calculateTotal()}</h3>
          </div>

          <Button type="submit">Create Invoice</Button>
        </form>
      </Card>
    </>
  );
}
