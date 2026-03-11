import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useLab } from "../../../hooks/useLab";

export default function LabResultEntry() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchLabOrderById, submitLabResults } = useLab();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState({});
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState("Sample Collected");

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    const data = await fetchLabOrderById(orderId);
    setOrder(data);
    setStatus(data?.status || "Sample Collected");
    setLoading(false);
  };

  const testParameters = {
    "CBC": [
      { name: "Hemoglobin", min: 12, max: 16, unit: "g/dL", critical: { low: 7, high: 20 } },
      { name: "WBC Count", min: 4000, max: 11000, unit: "/μL", critical: { low: 2000, high: 30000 } },
      { name: "RBC Count", min: 4.5, max: 5.5, unit: "million/μL", critical: { low: 2.5, high: 7 } },
      { name: "Platelets", min: 150000, max: 400000, unit: "/μL", critical: { low: 50000, high: 1000000 } },
      { name: "Hematocrit", min: 36, max: 46, unit: "%", critical: { low: 20, high: 60 } },
    ],
    "Blood Glucose": [
      { name: "Fasting Glucose", min: 70, max: 100, unit: "mg/dL", critical: { low: 40, high: 400 } },
    ],
    "HbA1c": [
      { name: "HbA1c", min: 4, max: 5.6, unit: "%", critical: { low: 3, high: 15 } },
    ],
    "Lipid Profile": [
      { name: "Total Cholesterol", min: 0, max: 200, unit: "mg/dL", critical: { low: 0, high: 500 } },
      { name: "LDL Cholesterol", min: 0, max: 100, unit: "mg/dL", critical: { low: 0, high: 300 } },
      { name: "HDL Cholesterol", min: 40, max: 200, unit: "mg/dL", critical: { low: 20, high: 200 } },
      { name: "Triglycerides", min: 0, max: 150, unit: "mg/dL", critical: { low: 0, high: 1000 } },
    ],
    "LFT": [
      { name: "ALT (SGPT)", min: 7, max: 56, unit: "U/L", critical: { low: 0, high: 500 } },
      { name: "AST (SGOT)", min: 10, max: 40, unit: "U/L", critical: { low: 0, high: 500 } },
      { name: "Alkaline Phosphatase", min: 44, max: 147, unit: "U/L", critical: { low: 0, high: 1000 } },
      { name: "Total Bilirubin", min: 0.1, max: 1.2, unit: "mg/dL", critical: { low: 0, high: 20 } },
      { name: "Albumin", min: 3.5, max: 5.5, unit: "g/dL", critical: { low: 1.5, high: 7 } },
    ],
    "KFT": [
      { name: "Creatinine", min: 0.7, max: 1.3, unit: "mg/dL", critical: { low: 0.3, high: 15 } },
      { name: "BUN", min: 7, max: 20, unit: "mg/dL", critical: { low: 2, high: 100 } },
      { name: "Uric Acid", min: 3.5, max: 7.2, unit: "mg/dL", critical: { low: 1, high: 15 } },
      { name: "Sodium", min: 136, max: 145, unit: "mEq/L", critical: { low: 120, high: 160 } },
      { name: "Potassium", min: 3.5, max: 5.0, unit: "mEq/L", critical: { low: 2.5, high: 6.5 } },
    ],
    "TFT": [
      { name: "TSH", min: 0.4, max: 4.0, unit: "mIU/L", critical: { low: 0.01, high: 50 } },
      { name: "T3", min: 80, max: 200, unit: "ng/dL", critical: { low: 40, high: 400 } },
      { name: "T4", min: 5, max: 12, unit: "μg/dL", critical: { low: 2, high: 25 } },
    ],
    "Electrolytes": [
      { name: "Sodium", min: 136, max: 145, unit: "mEq/L", critical: { low: 120, high: 160 } },
      { name: "Potassium", min: 3.5, max: 5.0, unit: "mEq/L", critical: { low: 2.5, high: 6.5 } },
      { name: "Chloride", min: 98, max: 107, unit: "mEq/L", critical: { low: 80, high: 120 } },
      { name: "Bicarbonate", min: 23, max: 30, unit: "mEq/L", critical: { low: 10, high: 40 } },
    ],
    "Urinalysis": [
      { name: "pH", min: 4.5, max: 8.0, unit: "", critical: { low: 3, high: 10 } },
      { name: "Specific Gravity", min: 1.005, max: 1.030, unit: "", critical: { low: 1.000, high: 1.050 } },
      { name: "Protein", min: 0, max: 0, unit: "mg/dL", critical: { low: 0, high: 500 } },
      { name: "Glucose", min: 0, max: 0, unit: "mg/dL", critical: { low: 0, high: 1000 } },
    ],
    "CRP": [
      { name: "C-Reactive Protein", min: 0, max: 3, unit: "mg/L", critical: { low: 0, high: 200 } },
    ],
    "ESR": [
      { name: "ESR", min: 0, max: 20, unit: "mm/hr", critical: { low: 0, high: 100 } },
    ],
    "PT/INR": [
      { name: "PT", min: 11, max: 13.5, unit: "seconds", critical: { low: 8, high: 30 } },
      { name: "INR", min: 0.8, max: 1.2, unit: "", critical: { low: 0.5, high: 5 } },
    ],
    "Vitamin D": [
      { name: "Vitamin D", min: 30, max: 100, unit: "ng/mL", critical: { low: 10, high: 150 } },
    ],
    "Vitamin B12": [
      { name: "Vitamin B12", min: 200, max: 900, unit: "pg/mL", critical: { low: 100, high: 2000 } },
    ],
    "Iron Studies": [
      { name: "Serum Iron", min: 60, max: 170, unit: "μg/dL", critical: { low: 20, high: 300 } },
      { name: "TIBC", min: 240, max: 450, unit: "μg/dL", critical: { low: 150, high: 600 } },
      { name: "Ferritin", min: 12, max: 300, unit: "ng/mL", critical: { low: 5, high: 1000 } },
    ],
  };

  const handleResultChange = (test, parameter, value) => {
    setResults({
      ...results,
      [test]: {
        ...results[test],
        [parameter]: value
      }
    });
  };

  const getFlag = (value, param) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;
    
    if (numValue < param.critical.low || numValue > param.critical.high) {
      return { label: "CRITICAL", color: "#dc2626", bg: "#fee2e2" };
    }
    if (numValue < param.min) {
      return { label: "LOW", color: "#ea580c", bg: "#fed7aa" };
    }
    if (numValue > param.max) {
      return { label: "HIGH", color: "#ea580c", bg: "#fed7aa" };
    }
    return { label: "NORMAL", color: "#16a34a", bg: "#dcfce7" };
  };

  const handleSubmit = async () => {
    const hasResults = Object.keys(results).length > 0;
    if (!hasResults) {
      alert("Please enter at least one test result");
      return;
    }

    setSubmitting(true);
    try {
      await submitLabResults(orderId, {
        results,
        comments,
        status,
        completedAt: status === "Completed" ? new Date().toISOString() : null,
      });
      alert("Lab results submitted successfully!");
      navigate("/hospital/lab/orders");
    } catch (error) {
      console.error("Error submitting results:", error);
      alert("Failed to submit results. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Enter Lab Results" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading order...</div>
        </Card>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <PageHeader title="Enter Lab Results" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Order not found</p>
            <Button onClick={() => navigate("/hospital/lab/orders")} style={{ marginTop: "1rem" }}>
              Back to Orders
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Enter Lab Results" 
        action={
          <Button variant="secondary" onClick={() => navigate("/hospital/lab/orders")}>
            Back to Orders
          </Button>
        }
      />

      <Card style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Patient</div>
            <div style={{ fontWeight: "600" }}>{order.patientName}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>MRN: {order.patientId}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Ordered By</div>
            <div style={{ fontWeight: "600" }}>{order.orderedBy}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Priority</div>
            <Badge variant={order.priority === "STAT" ? "danger" : order.priority === "Urgent" ? "warning" : "success"}>
              {order.priority}
            </Badge>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Order Date</div>
            <div style={{ fontWeight: "600" }}>{new Date(order.orderedAt).toLocaleDateString()}</div>
          </div>
        </div>
        {order.clinicalNotes && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Clinical Notes</div>
            <div style={{ fontSize: "0.875rem" }}>{order.clinicalNotes}</div>
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            Sample Status *
          </label>
          <div style={{ display: "flex", gap: "1rem" }}>
            {["Sample Collected", "In Progress", "Completed"].map((s) => (
              <label key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ cursor: "pointer" }}
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      {order.tests?.map((test) => {
        const params = testParameters[test];
        if (!params) {
          return (
            <Card key={test} style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>{test}</h3>
              <p style={{ color: "#6b7280" }}>No parameters defined for this test. Please enter results manually.</p>
            </Card>
          );
        }

        return (
          <Card key={test} style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
              {test}
            </h3>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Parameter</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Reference Range</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Result</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Unit</th>
                    <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.875rem", fontWeight: "600" }}>Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {params.map((param) => {
                    const flag = results[test]?.[param.name] ? getFlag(results[test][param.name], param) : null;
                    return (
                      <tr key={param.name} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "0.75rem", fontWeight: "500" }}>{param.name}</td>
                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                          {param.min} - {param.max}
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Enter value"
                            value={results[test]?.[param.name] || ""}
                            onChange={(e) => handleResultChange(test, param.name, e.target.value)}
                            style={{ 
                              width: "120px", 
                              padding: "0.5rem", 
                              border: "1px solid #d1d5db", 
                              borderRadius: "0.375rem",
                              fontSize: "0.875rem"
                            }}
                          />
                        </td>
                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                          {param.unit}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "center" }}>
                          {flag && (
                            <span style={{ 
                              padding: "0.25rem 0.75rem", 
                              borderRadius: "1rem", 
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              backgroundColor: flag.bg,
                              color: flag.color
                            }}>
                              {flag.label}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}

      <Card>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            Lab Technician Comments
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            placeholder="Enter any observations, quality control notes, or additional comments..."
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              border: "1px solid #d1d5db", 
              borderRadius: "0.5rem",
              fontSize: "0.875rem"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => navigate("/hospital/lab/orders")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Results"}
          </Button>
        </div>
      </Card>
    </>
  );
}
