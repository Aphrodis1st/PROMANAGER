import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useBilling } from "../../../hooks/useBilling";
import { usePatients } from "../../../hooks/usePatients";
import { PAYMENT_METHODS } from "../../../constants/insuranceProviders";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { createInvoice, insuranceProviders, addInsuranceProvider } = useBilling();
  const { patients, fetchPatients } = usePatients();
  const [loading, setLoading] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: "", code: "", type: "Private" });
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    dueDate: "",
    paymentMethod: "",
    insuranceProvider: "",
    notes: ""
  });
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, unitPrice: 0, amount: 0 }
  ]);

  useEffect(() => {
    fetchPatients();
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 15);
    setFormData(prev => ({ ...prev, dueDate: defaultDueDate.toISOString().split('T')[0] }));
  }, []);

  const serviceTemplates = [
    { name: "Consultation - General", price: 150 },
    { name: "Consultation - Specialist", price: 300 },
    { name: "Emergency Room Visit", price: 500 },
    { name: "ICU Per Day", price: 2000 },
    { name: "General Ward Per Day", price: 500 },
    { name: "Surgery - Minor", price: 3000 },
    { name: "Surgery - Major", price: 8000 },
    { name: "X-Ray", price: 200 },
    { name: "CT Scan", price: 800 },
    { name: "MRI Scan", price: 1200 },
    { name: "Ultrasound", price: 300 },
    { name: "Blood Test - Basic", price: 50 },
    { name: "Blood Test - Comprehensive", price: 150 },
    { name: "Medication", price: 100 },
    { name: "Physical Therapy Session", price: 80 },
  ];

  const handlePatientChange = (e) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p.id === patientId);
    setFormData({
      ...formData,
      patientId,
      patientName: patient ? (patient.fullName || patient.name) : ""
    });
  };

  const handleAddProvider = () => {
    if (!newProvider.name || !newProvider.code) {
      alert("Please enter provider name and code");
      return;
    }
    addInsuranceProvider(newProvider);
    setFormData({ ...formData, insuranceProvider: newProvider.name });
    setShowAddProvider(false);
    setNewProvider({ name: "", code: "", type: "Private" });
    alert("Insurance provider added successfully!");
  };

  const addItem = () => {
    setItems([...items, { id: items.length + 1, description: "", quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          updated.amount = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientId) {
      alert("Please select a patient");
      return;
    }

    if (items.every(item => !item.description)) {
      alert("Please add at least one service/item");
      return;
    }

    if (formData.paymentMethod === "Insurance" && !formData.insuranceProvider) {
      alert("Please select an insurance provider");
      return;
    }

    setLoading(true);
    try {
      await createInvoice({
        ...formData,
        amount: totalAmount,
        paid: 0,
        items: items.filter(item => item.description)
      });
      alert("Invoice created successfully!");
      navigate("/hospital/billing/invoices");
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Create Invoice" 
        action={
          <Button variant="secondary" onClick={() => navigate("/hospital/billing/invoices")}>
            Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
          <div>
            <Card style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
                Patient Information
              </h3>
              
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Patient *
                </label>
                <select
                  value={formData.patientId}
                  onChange={handlePatientChange}
                  style={{ 
                    width: "100%", 
                    padding: "0.75rem", 
                    border: "1px solid #d1d5db", 
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName || p.name} - MRN: {p.mrn || p.id}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem"
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value, insuranceProvider: "" })}
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem"
                    }}
                  >
                    <option value="">Select Method</option>
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method.id} value={method.name}>
                        {method.icon} {method.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.paymentMethod === "Insurance" && (
                <div style={{ 
                  padding: "1rem", 
                  backgroundColor: "#f0f9ff", 
                  borderRadius: "0.5rem",
                  border: "1px solid #3b82f6"
                }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Insurance Provider *
                  </label>
                  <select
                    value={formData.insuranceProvider}
                    onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      marginBottom: "0.75rem"
                    }}
                    required
                  >
                    <option value="">Select Insurance Provider</option>
                    {insuranceProviders.map((provider) => (
                      <option key={provider.id} value={provider.name}>
                        {provider.name} ({provider.code}) - {provider.type}
                      </option>
                    ))}
                  </select>

                  {!showAddProvider ? (
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="secondary"
                      onClick={() => setShowAddProvider(true)}
                    >
                      + Add New Insurance Provider
                    </Button>
                  ) : (
                    <div style={{ 
                      padding: "1rem", 
                      backgroundColor: "white", 
                      borderRadius: "0.5rem",
                      border: "1px solid #d1d5db"
                    }}>
                      <h4 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.75rem" }}>
                        Add New Insurance Provider
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <input
                          type="text"
                          placeholder="Provider Name"
                          value={newProvider.name}
                          onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                          style={{ 
                            padding: "0.5rem", 
                            border: "1px solid #d1d5db", 
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem"
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Provider Code (e.g., BCBS)"
                          value={newProvider.code}
                          onChange={(e) => setNewProvider({ ...newProvider, code: e.target.value.toUpperCase() })}
                          style={{ 
                            padding: "0.5rem", 
                            border: "1px solid #d1d5db", 
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem"
                          }}
                        />
                        <select
                          value={newProvider.type}
                          onChange={(e) => setNewProvider({ ...newProvider, type: e.target.value })}
                          style={{ 
                            padding: "0.5rem", 
                            border: "1px solid #d1d5db", 
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem"
                          }}
                        >
                          <option value="Private">Private</option>
                          <option value="Government">Government</option>
                          <option value="HMO">HMO</option>
                          <option value="Military">Military</option>
                        </select>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Button type="button" size="sm" onClick={handleAddProvider}>
                            Add Provider
                          </Button>
                          <Button type="button" size="sm" variant="secondary" onClick={() => setShowAddProvider(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  Services & Items
                </h3>
                <Button type="button" size="sm" onClick={addItem}>
                  + Add Item
                </Button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Description</th>
                      <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.875rem", fontWeight: "600", width: "100px" }}>Qty</th>
                      <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.875rem", fontWeight: "600", width: "120px" }}>Unit Price</th>
                      <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.875rem", fontWeight: "600", width: "120px" }}>Amount</th>
                      <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.875rem", fontWeight: "600", width: "80px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "0.75rem" }}>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            placeholder="Enter service/item"
                            list={`services-${item.id}`}
                            style={{ 
                              width: "100%", 
                              padding: "0.5rem", 
                              border: "1px solid #d1d5db", 
                              borderRadius: "0.375rem",
                              fontSize: "0.875rem"
                            }}
                          />
                          <datalist id={`services-${item.id}`}>
                            {serviceTemplates.map((template, idx) => (
                              <option key={idx} value={template.name} />
                            ))}
                          </datalist>
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                            style={{ 
                              width: "100%", 
                              padding: "0.5rem", 
                              border: "1px solid #d1d5db", 
                              borderRadius: "0.375rem",
                              fontSize: "0.875rem",
                              textAlign: "center"
                            }}
                          />
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                            style={{ 
                              width: "100%", 
                              padding: "0.5rem", 
                              border: "1px solid #d1d5db", 
                              borderRadius: "0.375rem",
                              fontSize: "0.875rem",
                              textAlign: "right"
                            }}
                          />
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: "600" }}>
                          ${item.amount.toFixed(2)}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "center" }}>
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="danger"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                          >
                            ×
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Enter any additional notes or comments..."
                  style={{ 
                    width: "100%", 
                    padding: "0.75rem", 
                    border: "1px solid #d1d5db", 
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>
            </Card>
          </div>

          <div>
            <Card style={{ position: "sticky", top: "1rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
                Invoice Summary
              </h3>
              
              <div style={{ 
                padding: "1rem", 
                backgroundColor: "#f9fafb", 
                borderRadius: "0.5rem",
                marginBottom: "1rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.875rem" }}>Subtotal:</span>
                  <span style={{ fontWeight: "600" }}>${totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.875rem" }}>Tax (0%):</span>
                  <span style={{ fontWeight: "600" }}>$0.00</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  paddingTop: "0.75rem",
                  borderTop: "2px solid #e5e7eb"
                }}>
                  <span style={{ fontSize: "1.125rem", fontWeight: "700" }}>Total:</span>
                  <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3b82f6" }}>
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Invoice"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate("/hospital/billing/invoices")}>
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}
