import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useBilling } from "../../../hooks/useBilling";
import { PAYMENT_METHODS } from "../../../constants/insuranceProviders";

export default function PaymentProcessing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { invoices, processPayment, getInvoiceById, insuranceProviders, addInsuranceProvider } = useBilling();
  const [loading, setLoading] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: "", code: "", type: "Private" });
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(searchParams.get("invoiceId") || "");
  const [paymentData, setPaymentData] = useState({
    amount: "",
    method: "Cash",
    insuranceProvider: "",
    reference: "",
    notes: ""
  });

  const selectedInvoice = selectedInvoiceId ? getInvoiceById(selectedInvoiceId) : null;

  useEffect(() => {
    if (selectedInvoice) {
      setPaymentData(prev => ({ ...prev, amount: selectedInvoice.balance }));
    }
  }, [selectedInvoice]);

  const handleAddProvider = () => {
    if (!newProvider.name || !newProvider.code) {
      alert("Please enter provider name and code");
      return;
    }
    addInsuranceProvider(newProvider);
    setPaymentData({ ...paymentData, insuranceProvider: newProvider.name });
    setShowAddProvider(false);
    setNewProvider({ name: "", code: "", type: "Private" });
    alert("Insurance provider added successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedInvoiceId) {
      alert("Please select an invoice");
      return;
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    if (paymentData.amount > selectedInvoice.balance) {
      alert("Payment amount cannot exceed balance");
      return;
    }

    if (paymentData.method === "Insurance" && !paymentData.insuranceProvider) {
      alert("Please select an insurance provider");
      return;
    }

    setLoading(true);
    try {
      await processPayment(parseInt(selectedInvoiceId), paymentData);
      alert("Payment processed successfully!");
      navigate("/hospital/billing/invoices");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pendingInvoices = invoices.filter(inv => inv.balance > 0);
  const selectedMethod = PAYMENT_METHODS.find(m => m.name === paymentData.method);

  return (
    <>
      <PageHeader 
        title="Process Payment" 
        action={
          <Button variant="secondary" onClick={() => navigate("/hospital/billing/invoices")}>
            Back to Invoices
          </Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <Card>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
            Payment Details
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Select Invoice *
              </label>
              <select
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
                required
              >
                <option value="">Select Invoice</option>
                {pendingInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} - {inv.patientName} - Balance: ${inv.balance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Payment Amount *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                placeholder="Enter payment amount"
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
                required
              />
              {selectedInvoice && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
                  Maximum: ${selectedInvoice.balance.toLocaleString()}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Payment Method *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                {PAYMENT_METHODS.map((method) => (
                  <label 
                    key={method.id}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.5rem",
                      padding: "0.75rem",
                      border: paymentData.method === method.name ? "2px solid #3b82f6" : "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      backgroundColor: paymentData.method === method.name ? "#eff6ff" : "transparent"
                    }}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={method.name}
                      checked={paymentData.method === method.name}
                      onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value, insuranceProvider: "" })}
                      style={{ cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "1.25rem" }}>{method.icon}</span>
                    <span style={{ fontSize: "0.875rem" }}>{method.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {paymentData.method === "Insurance" && (
              <div style={{ 
                marginBottom: "1.5rem",
                padding: "1rem", 
                backgroundColor: "#f0f9ff", 
                borderRadius: "0.5rem",
                border: "1px solid #3b82f6"
              }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Insurance Provider *
                </label>
                <select
                  value={paymentData.insuranceProvider}
                  onChange={(e) => setPaymentData({ ...paymentData, insuranceProvider: e.target.value })}
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

            {selectedMethod?.requiresReference && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Reference Number {selectedMethod.requiresReference ? "*" : ""}
                </label>
                <input
                  type="text"
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                  placeholder="Transaction ID, Check number, etc."
                  style={{ 
                    width: "100%", 
                    padding: "0.75rem", 
                    border: "1px solid #d1d5db", 
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                  required={selectedMethod.requiresReference}
                />
              </div>
            )}

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                Payment Notes
              </label>
              <textarea
                value={paymentData.notes}
                onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                rows={3}
                placeholder="Enter any additional notes..."
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <Button type="submit" disabled={loading || !selectedInvoiceId}>
                {loading ? "Processing..." : "Process Payment"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate("/hospital/billing/invoices")}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        <div>
          {selectedInvoice && (
            <Card>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
                Invoice Details
              </h3>
              
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Invoice Number</div>
                <div style={{ fontWeight: "600" }}>{selectedInvoice.invoiceNumber}</div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Patient</div>
                <div style={{ fontWeight: "600" }}>{selectedInvoice.patientName}</div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Status</div>
                <Badge variant={
                  selectedInvoice.status === "Paid" ? "success" : 
                  selectedInvoice.status === "Partial" ? "warning" : "danger"
                }>
                  {selectedInvoice.status}
                </Badge>
              </div>

              <div style={{ 
                padding: "1rem", 
                backgroundColor: "#f9fafb", 
                borderRadius: "0.5rem",
                marginTop: "1rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.875rem" }}>Total Amount:</span>
                  <span style={{ fontWeight: "600" }}>${selectedInvoice.amount.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "#10b981" }}>Paid:</span>
                  <span style={{ fontWeight: "600", color: "#10b981" }}>${selectedInvoice.paid.toLocaleString()}</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  paddingTop: "0.75rem",
                  borderTop: "2px solid #e5e7eb"
                }}>
                  <span style={{ fontSize: "1rem", fontWeight: "700" }}>Balance Due:</span>
                  <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#ef4444" }}>
                    ${selectedInvoice.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          )}

          <Card style={{ marginTop: "1rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
              Pending Invoices
            </h3>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {pendingInvoices.length} invoice(s) with outstanding balance
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ef4444", marginTop: "0.5rem" }}>
              ${pendingInvoices.reduce((sum, inv) => sum + inv.balance, 0).toLocaleString()}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
