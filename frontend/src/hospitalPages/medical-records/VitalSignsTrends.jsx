import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Button from "../../components/hospital/Button";

export default function VitalSignsTrends() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState("temperature");

  // Mock data - replace with actual API call
  const vitalHistory = [
    { date: "2024-01-15 08:00", temperature: 36.8, systolic: 120, diastolic: 80, heartRate: 72, spo2: 98, glucose: 95 },
    { date: "2024-01-15 14:00", temperature: 37.2, systolic: 125, diastolic: 82, heartRate: 78, spo2: 97, glucose: 110 },
    { date: "2024-01-16 08:00", temperature: 38.5, systolic: 130, diastolic: 85, heartRate: 88, spo2: 95, glucose: 105 },
    { date: "2024-01-16 14:00", temperature: 37.8, systolic: 122, diastolic: 80, heartRate: 80, spo2: 96, glucose: 98 },
    { date: "2024-01-17 08:00", temperature: 37.0, systolic: 118, diastolic: 78, heartRate: 74, spo2: 98, glucose: 92 },
  ];

  const metrics = {
    temperature: { label: "Temperature", unit: "°C", normal: [36.5, 37.5], color: "#ef4444" },
    systolic: { label: "Systolic BP", unit: "mmHg", normal: [90, 120], color: "#3b82f6" },
    diastolic: { label: "Diastolic BP", unit: "mmHg", normal: [60, 80], color: "#8b5cf6" },
    heartRate: { label: "Heart Rate", unit: "bpm", normal: [60, 100], color: "#ec4899" },
    spo2: { label: "SpO₂", unit: "%", normal: [95, 100], color: "#10b981" },
    glucose: { label: "Blood Glucose", unit: "mg/dL", normal: [70, 100], color: "#f59e0b" },
  };

  const getLatestVitals = () => {
    if (vitalHistory.length === 0) return null;
    return vitalHistory[vitalHistory.length - 1];
  };

  const getStatus = (value, metric) => {
    const [min, max] = metrics[metric].normal;
    if (value < min) return { status: "Low", color: "#fbbf24" };
    if (value > max) return { status: "High", color: "#ef4444" };
    return { status: "Normal", color: "#10b981" };
  };

  const latest = getLatestVitals();

  return (
    <>
      <PageHeader 
        title="Vital Signs Trends" 
        action={
          <Button onClick={() => navigate(`/hospital/medical-records/vitals/${id}`)}>
            Record New Vitals
          </Button>
        }
      />

      {/* Latest Vitals Summary */}
      <Card title="📊 Latest Vital Signs" style={{ marginBottom: "1rem" }}>
        {latest ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
            {Object.keys(metrics).map((key) => {
              const value = latest[key];
              const status = getStatus(value, key);
              return (
                <div key={key} style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem" }}>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>{metrics[key].label}</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "600", color: status.color }}>{value}</p>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>{metrics[key].unit}</p>
                  <span style={{ fontSize: "0.75rem", padding: "0.125rem 0.5rem", borderRadius: "1rem", backgroundColor: status.color, color: "white" }}>
                    {status.status}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#6b7280" }}>No vital signs recorded yet</p>
        )}
      </Card>

      {/* Trend Chart */}
      <Card title="📈 Trend Analysis">
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "0.875rem", fontWeight: "600", marginRight: "0.5rem" }}>Select Metric:</label>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            style={{ padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
          >
            {Object.keys(metrics).map((key) => (
              <option key={key} value={key}>{metrics[key].label}</option>
            ))}
          </select>
        </div>

        {/* Simple ASCII Chart */}
        <div style={{ backgroundColor: "#f9fafb", padding: "1rem", borderRadius: "0.5rem", fontFamily: "monospace", overflowX: "auto" }}>
          <div style={{ marginBottom: "1rem" }}>
            <strong>{metrics[selectedMetric].label} Trend</strong>
            <span style={{ marginLeft: "1rem", color: "#6b7280" }}>
              Normal Range: {metrics[selectedMetric].normal[0]}-{metrics[selectedMetric].normal[1]} {metrics[selectedMetric].unit}
            </span>
          </div>
          
          {vitalHistory.map((record, i) => {
            const value = record[selectedMetric];
            const [min, max] = metrics[selectedMetric].normal;
            const status = getStatus(value, selectedMetric);
            const barWidth = Math.min((value / max) * 100, 100);
            
            return (
              <div key={i} style={{ marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280", width: "120px" }}>{record.date}</span>
                  <div style={{ flex: 1, backgroundColor: "#e5e7eb", borderRadius: "0.25rem", height: "24px", position: "relative" }}>
                    <div style={{ 
                      width: `${barWidth}%`, 
                      backgroundColor: status.color, 
                      height: "100%", 
                      borderRadius: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "0.5rem"
                    }}>
                      <span style={{ color: "white", fontSize: "0.75rem", fontWeight: "600" }}>
                        {value} {metrics[selectedMetric].unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Table */}
        <div style={{ marginTop: "1.5rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "2px solid #d1d5db" }}>Date/Time</th>
                <th style={{ padding: "0.5rem", textAlign: "center", borderBottom: "2px solid #d1d5db" }}>Temp</th>
                <th style={{ padding: "0.5rem", textAlign: "center", borderBottom: "2px solid #d1d5db" }}>BP</th>
                <th style={{ padding: "0.5rem", textAlign: "center", borderBottom: "2px solid #d1d5db" }}>HR</th>
                <th style={{ padding: "0.5rem", textAlign: "center", borderBottom: "2px solid #d1d5db" }}>SpO₂</th>
                <th style={{ padding: "0.5rem", textAlign: "center", borderBottom: "2px solid #d1d5db" }}>Glucose</th>
              </tr>
            </thead>
            <tbody>
              {vitalHistory.map((record, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.5rem" }}>{record.date}</td>
                  <td style={{ padding: "0.5rem", textAlign: "center", color: getStatus(record.temperature, "temperature").color }}>
                    {record.temperature}°C
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>
                    {record.systolic}/{record.diastolic}
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center", color: getStatus(record.heartRate, "heartRate").color }}>
                    {record.heartRate}
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center", color: getStatus(record.spo2, "spo2").color }}>
                    {record.spo2}%
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center", color: getStatus(record.glucose, "glucose").color }}>
                    {record.glucose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
