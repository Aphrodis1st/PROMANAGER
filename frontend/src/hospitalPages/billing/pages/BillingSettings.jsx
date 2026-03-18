import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useBilling } from "../../../hooks/useBilling";

export default function BillingSettings() {
  const navigate = useNavigate();
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: "", code: "", type: "Private" });
  const [newPayment, setNewPayment] = useState({ name: "", icon: "💳", requiresReference: false });

  // Safe context access
  let insuranceProviders = [];
  let paymentMethods = [];
  let addInsuranceProvider = () => Promise.resolve();
  let updateInsuranceProvider = () => Promise.resolve();
  let deleteInsuranceProvider = () => Promise.resolve();
  let updatePaymentMethod = () => Promise.resolve();

  try {
    const billingContext = useBilling();
    insuranceProviders = billingContext?.insuranceProviders || [];
    paymentMethods = billingContext?.paymentMethods || [];
    addInsuranceProvider = billingContext?.addInsuranceProvider || (() => Promise.resolve());
    updateInsuranceProvider = billingContext?.updateInsuranceProvider || (() => Promise.resolve());
    deleteInsuranceProvider = billingContext?.deleteInsuranceProvider || (() => Promise.resolve());
    updatePaymentMethod = billingContext?.updatePaymentMethod || (() => Promise.resolve());
  } catch (err) {
    console.error("Billing context error:", err);
    setError("Failed to load billing settings");
  }

  const handleAddProvider = async () => {
    if (!newProvider.name || !newProvider.code) {
      alert("Please enter provider name and code");
      return;
    }
    try {
      await addInsuranceProvider(newProvider);
      setShowAddProvider(false);
      setNewProvider({ name: "", code: "", type: "Private" });
      alert("Insurance provider added successfully!");
    } catch (err) {
      alert("Failed to add provider");
      console.error("Add provider error:", err);
    }
  };

  const handleAddPayment = async () => {
    if (!newPayment.name) {
      alert("Please enter payment method name");
      return;
    }
    try {
      await updatePaymentMethod({ ...newPayment, status: "Active" });
      setShowAddPayment(false);
      setNewPayment({ name: "", icon: "💳", requiresReference: false });
      alert("Payment method added successfully!");
    } catch (err) {
      alert("Failed to add payment method");
      console.error("Add payment error:", err);
    }
  };

  const handleToggleProvider = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    if (window.confirm(`${newStatus === "Inactive" ? "Deactivate" : "Activate"} this insurance provider?`)) {
      try {
        await updateInsuranceProvider(id, { status: newStatus });
      } catch (err) {
        alert("Failed to update provider status");
        console.error("Toggle provider error:", err);
      }
    }
  };

  const handleDeleteProvider = async (id, name) => {
    if (window.confirm(`Permanently delete ${name}? This action cannot be undone.`)) {
      try {
        await deleteInsuranceProvider(id);
        alert("Insurance provider deleted successfully!");
      } catch (err) {
        alert("Failed to delete provider");
        console.error("Delete provider error:", err);
      }
    }
  };

  const handleTogglePayment = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    if (window.confirm(`${newStatus === "Inactive" ? "Deactivate" : "Activate"} this payment method?`)) {
      try {
        await updatePaymentMethod(id, { status: newStatus });
      } catch (err) {
        alert("Failed to update payment method status");
        console.error("Toggle payment error:", err);
      }
    }
  };

  const providerColumns = [
    { 
      key: "name", 
      label: "Provider Name",
      render: (row) => (
        <div>
          <div style={{ fontWeight: "600" }}>{row.name}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>Code: {row.code}</div>
        </div>
      )
    },
    { 
      key: "type", 
      label: "Type",
      render: (row) => <Badge variant="info">{row.type}</Badge>
    },
    { 
      key: "status", 
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "secondary"}>
          {row.status}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button 
            size="sm" 
            variant={row.status === "Active" ? "secondary" : "success"}
            onClick={() => handleToggleProvider(row.id, row.status)}
          >
            {row.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
          <Button 
            size="sm" 
            variant="danger"
            onClick={() => handleDeleteProvider(row.id, row.name)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const paymentColumns = [
    { 
      key: "name", 
      label: "Payment Method",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>{row.icon}</span>
          <span style={{ fontWeight: "600" }}>{row.name}</span>
        </div>
      )
    },
    { 
      key: "requiresReference", 
      label: "Requires Reference",
      render: (row) => (
        <Badge variant={row.requiresReference ? "warning" : "secondary"}>
          {row.requiresReference ? "Yes" : "No"}
        </Badge>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "secondary"}>
          {row.status}
        </Badge>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button 
            size="sm" 
            variant={row.status === "Active" ? "secondary" : "success"}
            onClick={() => handleTogglePayment(row.id, row.status)}
          >
            {row.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <>
        <PageHeader title="Billing Settings" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
            <h3>Error Loading Settings</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} style={{ marginTop: "1rem" }}>
              Retry
            </Button>
          </div>
        </Card>
      </>
    );
  }

  if (localLoading) {
    return (
      <>
        <PageHeader title="Billing Settings" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Loading settings...</div>
            <div style={{ color: "#6b7280" }}>Please wait while we fetch your billing settings.</div>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Billing Settings" 
        action={
          <Button variant="secondary" onClick={() => navigate("/hospital/billing")}>
            Back to Dashboard
          </Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6" }}>
              {insuranceProviders.length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Providers</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#10b981" }}>
              {insuranceProviders.filter(p => p.status === "Active").length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Active Providers</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#8b5cf6" }}>
              {paymentMethods.length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Payment Methods</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#10b981" }}>
              {paymentMethods.filter(p => p.status === "Active").length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Active Methods</div>
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
            Insurance Providers
          </h3>
          <Button onClick={() => setShowAddProvider(!showAddProvider)}>
            {showAddProvider ? "Cancel" : "+ Add Provider"}
          </Button>
        </div>

        {showAddProvider && (
          <div style={{ 
            padding: "1rem", 
            backgroundColor: "#f0f9ff", 
            borderRadius: "0.5rem",
            border: "1px solid #3b82f6",
            marginBottom: "1rem"
          }}>
            <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
              Add New Insurance Provider
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
                  Provider Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Blue Cross Blue Shield"
                  value={newProvider.name}
                  onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                  style={{ 
                    width: "100%",
                    padding: "0.75rem", 
                    border: "1px solid #d1d5db", 
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
                  Provider Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g., BCBS"
                  value={newProvider.code}
                  onChange={(e) => setNewProvider({ ...newProvider, code: e.target.value.toUpperCase() })}
                  style={{ 
                    width: "100%",
                    padding: "0.75rem", 
                    border: "1px solid #d1d5db", 
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
                  Type *
                </label>
                <select
                  value={newProvider.type}
                  onChange={(e) => setNewProvider({ ...newProvider, type: e.target.value })}
                  style={{ 
                    width: "100%",
                    padding: "0.75rem", 
                    border: "1px solid #d1d5db", 
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                >
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="HMO">HMO</option>
                  <option value="Military">Military</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <Button onClick={handleAddProvider}>
                Add Provider
              </Button>
              <Button variant="secondary" onClick={() => setShowAddProvider(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <DataTable
          columns={providerColumns}
          data={insuranceProviders}
          searchable
          sortable
          pagination
        />
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
            Payment Methods
          </h3>
          <Button onClick={() => setShowAddPayment(!showAddPayment)}>
            {showAddPayment ? "Cancel" : "+ Add Payment Method"}
          </Button>
        </div>

        {showAddPayment && (
          <div style={{ 
            padding: "1rem", 
            backgroundColor: "#f0fdf4", 
            borderRadius: "0.5rem",
            border: "1px solid #10b981",
            marginBottom: "1rem"
          }}>
            <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>
              Add New Payment Method
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
                  Method Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., PayPal"
                  value={newPayment.name}
                  onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                  style={{ 
                    width: "100%",
                    padding: "0.75rem", 
                    border: "1px solid #d1d5db", 
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  placeholder="💳"
                  value={newPayment.icon}
                  onChange={(e) => setNewPayment({ ...newPayment, icon: e.target.value })}
                  style={{ 
                    width: "100%",
                    padding: "0.75rem", 
                    border: "1px solid #d1d5db", 
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600" }}>
                  Requires Reference
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={newPayment.requiresReference}
                    onChange={(e) => setNewPayment({ ...newPayment, requiresReference: e.target.checked })}
                    style={{ cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "0.875rem" }}>Yes</span>
                </label>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <Button onClick={handleAddPayment}>
                Add Payment Method
              </Button>
              <Button variant="secondary" onClick={() => setShowAddPayment(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <DataTable
          columns={paymentColumns}
          data={paymentMethods}
          searchable
          sortable
          pagination
        />
      </Card>
    </>
  );
}