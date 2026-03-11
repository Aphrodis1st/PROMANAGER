import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useBilling } from "../../../hooks/useBilling";
import { usePatients } from "../../../hooks/usePatients";

export default function InsuranceClaims() {
  const navigate = useNavigate();
  const { insuranceClaims, submitInsuranceClaim, updateClaimStatus } = useBilling();
  const { patients, fetchPatients } = usePatients();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    provider: "",
    amount: "",
    diagnosis: "",
    treatmentDate: "",
    notes: ""
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitInsuranceClaim(formData);
      alert("Insurance claim submitted successfully!");
      setShowForm(false);
      setFormData({
        patientId: "",
        patientName: "",
        provider: "",
        amount: "",
        diagnosis: "",
        treatmentDate: "",
        notes: ""
      });
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("Failed to submit claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (claimId, status) => {
    const approvedAmount = status === "Approved" 
      ? parseFloat(prompt("Enter approved amount:")) 
      : status === "Partial" 
      ? parseFloat(prompt("Enter partially approved amount:"))
      : 0;

    if (status !== "Rejected" && (!approvedAmount || approvedAmount <= 0)) {
      return;
    }

    try {
      await updateClaimStatus(claimId, status, approvedAmount);
      alert("Claim status updated successfully!");
    } catch (error) {
      alert("Failed to update claim status");
    }
  };

  const filteredClaims = filter === "All" 
    ? insuranceClaims 
    : insuranceClaims.filter(c => c.status === filter);

  const getStatusBadge = (status) => {
    const variants = {
      Pending: "warning",
      Approved: "success",
      Partial: "info",
      Rejected: "danger"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const columns = [
    { 
      key: "claimNumber", 
      label: "Claim #",
      render: (row) => (
        <div style={{ fontWeight: "600" }}>{row.claimNumber}</div>
      )
    },
    { 
      key: "patientName", 
      label: "Patient",
      render: (row) => (
        <div style={{ fontWeight: "600" }}>{row.patientName}</div>
      )
    },
    { 
      key: "provider", 
      label: "Insurance Provider",
      render: (row) => (
        <div style={{ fontSize: "0.875rem" }}>{row.provider}</div>
      )
    },
    { 
      key: "amount", 
      label: "Claim Amount",
      render: (row) => (
        <div style={{ fontWeight: "600" }}>${row.amount.toLocaleString()}</div>
      )
    },
    { 
      key: "approved", 
      label: "Approved",
      render: (row) => (
        <div style={{ fontWeight: "600", color: row.approved > 0 ? "#10b981" : "#6b7280" }}>
          ${row.approved.toLocaleString()}
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (row) => getStatusBadge(row.status)
    },
    { 
      key: "submittedDate", 
      label: "Submitted",
      render: (row) => new Date(row.submittedDate).toLocaleDateString()
    },
    { 
      key: "processedDate", 
      label: "Processed",
      render: (row) => row.processedDate ? new Date(row.processedDate).toLocaleDateString() : <span style={{ color: "#9ca3af" }}>-</span>
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {row.status === "Pending" && (
            <>
              <Button size="sm" onClick={() => handleStatusUpdate(row.id, "Approved")}>
                Approve
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(row.id, "Partial")}>
                Partial
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(row.id, "Rejected")}>
                Reject
              </Button>
            </>
          )}
          {row.status !== "Pending" && (
            <Button size="sm" variant="secondary">
              View Details
            </Button>
          )}
        </div>
      ),
    },
  ];

  const totalClaimed = filteredClaims.reduce((sum, c) => sum + c.amount, 0);
  const totalApproved = filteredClaims.reduce((sum, c) => sum + c.approved, 0);

  return (
    <>
      <PageHeader 
        title="Insurance Claims Management" 
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Submit New Claim"}
          </Button>
        }
      />

      {showForm && (
        <Card style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
            Submit Insurance Claim
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Patient *
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => {
                    const patient = patients.find(p => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      patientId: e.target.value,
                      patientName: patient ? (patient.fullName || patient.name) : ""
                    });
                  }}
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

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Insurance Provider *
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  style={{ 
                    width: "100%", 
                    padding: "0.75rem", 
                    border: "1px solid #d1d5db", 
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                  required
                >
                  <option value="">Select Provider</option>
                  <option value="Blue Cross">Blue Cross</option>
                  <option value="Aetna">Aetna</option>
                  <option value="United Health">United Health</option>
                  <option value="Cigna">Cigna</option>
                  <option value="Humana">Humana</option>
                  <option value="Kaiser Permanente">Kaiser Permanente</option>
                  <option value="Medicare">Medicare</option>
                  <option value="Medicaid">Medicaid</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Claim Amount *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter claim amount"
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
                  Treatment Date *
                </label>
                <input
                  type="date"
                  value={formData.treatmentDate}
                  onChange={(e) => setFormData({ ...formData, treatmentDate: e.target.value })}
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

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Diagnosis / Treatment *
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Enter diagnosis or treatment description"
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

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Enter any additional information..."
                  style={{ 
                    width: "100%", 
                    padding: "0.75rem", 
                    border: "1px solid #d1d5db", 
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Claim"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6" }}>
              {insuranceClaims.length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Claims</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#f59e0b" }}>
              {insuranceClaims.filter(c => c.status === "Pending").length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Pending</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#10b981" }}>
              {insuranceClaims.filter(c => c.status === "Approved").length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Approved</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ef4444" }}>
              {insuranceClaims.filter(c => c.status === "Rejected").length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Rejected</div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          {["All", "Pending", "Approved", "Partial", "Rejected"].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filter === status ? "primary" : "secondary"}
              onClick={() => setFilter(status)}
            >
              {status} ({status === "All" ? insuranceClaims.length : insuranceClaims.filter(c => c.status === status).length})
            </Button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Claimed</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3b82f6" }}>
              ${totalClaimed.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Approved</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#10b981" }}>
              ${totalApproved.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Approval Rate</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#8b5cf6" }}>
              {totalClaimed > 0 ? ((totalApproved / totalClaimed) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>

        {filteredClaims.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredClaims}
            searchable
            sortable
            pagination
          />
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No insurance claims found.</p>
          </div>
        )}
      </Card>
    </>
  );
}
