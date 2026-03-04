import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import { Form, Input, Select, TextArea } from "../../../components/hospital/Form";
import Button from "../../../components/hospital/Button";
import { useLab } from "../../../hooks/useLab";

export default function LabResultEntry() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { labOrder, fetchLabOrderById, submitLabResults } = useLab();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  useEffect(() => {
    if (orderId) fetchLabOrderById(orderId);
  }, [orderId]);

  const referenceRanges = {
    "CBC": { Hemoglobin: { min: 12, max: 16, unit: "g/dL" }, WBC: { min: 4000, max: 11000, unit: "/μL" } },
    "Blood Glucose": { Fasting: { min: 70, max: 100, unit: "mg/dL" } },
    "LFT": { ALT: { min: 7, max: 56, unit: "U/L" }, AST: { min: 10, max: 40, unit: "U/L" } },
    "KFT": { Creatinine: { min: 0.7, max: 1.3, unit: "mg/dL" }, BUN: { min: 7, max: 20, unit: "mg/dL" } },
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

  const getFlag = (value, range) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "";
    if (numValue < range.min) return "🔴 Low";
    if (numValue > range.max) return "🔴 High";
    return "🟢 Normal";
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitLabResults(orderId, {
        results,
        status: "Completed",
        completedAt: new Date().toISOString(),
      });
      alert("Lab results submitted successfully!");
      navigate("/hospital/lab/orders");
    } catch (error) {
      console.error("Error submitting results:", error);
      alert("Failed to submit results. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Enter Lab Results" />
      <Card>
        <div style={{ marginBottom: "2rem" }}>
          <p><strong>Patient:</strong> {labOrder?.patientName}</p>
          <p><strong>Ordered By:</strong> {labOrder?.orderedBy}</p>
          <p><strong>Priority:</strong> {labOrder?.priority}</p>
        </div>

        {labOrder?.tests?.map((test) => (
          <Card key={test} style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f9fafb" }}>
            <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>{test}</h3>
            {referenceRanges[test] && Object.entries(referenceRanges[test]).map(([param, range]) => (
              <div key={param} style={{ marginBottom: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", alignItems: "center" }}>
                <div>
                  <strong>{param}</strong>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    Range: {range.min}-{range.max} {range.unit}
                  </div>
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter value"
                  value={results[test]?.[param] || ""}
                  onChange={(e) => handleResultChange(test, param, e.target.value)}
                  style={{ padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
                />
                <div style={{ fontWeight: "600" }}>
                  {results[test]?.[param] && getFlag(results[test][param], range)}
                </div>
              </div>
            ))}
          </Card>
        ))}

        <div style={{ marginTop: "2rem" }}>
          <TextArea placeholder="Additional comments or observations" rows={3} />
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Results"}
            </Button>
            <Button onClick={() => navigate("/hospital/lab/orders")} style={{ backgroundColor: "#6b7280" }}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
