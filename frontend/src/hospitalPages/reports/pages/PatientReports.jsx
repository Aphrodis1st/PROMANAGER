import React, { useState } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useReports } from "../../../hooks/useReports";

export default function PatientReports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [comments, setComments] = useState("");
  const [error, setError] = useState(null);

  // Safe access to patient stats
  let patientStats = {
    total: 0,
    newThisMonth: 0,
    active: 0,
    admitted: 0,
    ageDistribution: [],
    gender: { male: 0, female: 0, other: 0 }
  };

  try {
    const reports = useReports();
    patientStats = reports?.patientStats || patientStats;
  } catch (err) {
    console.error('Reports context error:', err);
    setError('Failed to load patient reports data');
  }

  const exportToCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Patients', patientStats.total],
      ['New This Month', patientStats.newThisMonth],
      ['Active Patients', patientStats.active],
      ['Admitted Patients', patientStats.admitted],
      ['Male Patients', patientStats.gender.male],
      ['Female Patients', patientStats.gender.female],
      ['Other Gender', patientStats.gender.other],
      ...patientStats.ageDistribution.map(age => [`Age ${age.range}`, age.count])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Patient Report',
        text: `Patient Statistics Report - Total: ${patientStats.total} patients`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  if (error) {
    return (
      <>
        <PageHeader title="Patient Reports" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
            <h3>Error Loading Patient Reports</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} style={{ marginTop: "1rem" }}>
              Retry
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Patient Reports" 
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button size="sm" variant="secondary" onClick={exportToCSV}>📊 CSV</Button>
            <Button size="sm" variant="secondary" onClick={exportToPDF}>🖨️ PDF</Button>
            <Button size="sm" variant="secondary" onClick={shareReport}>🔗 Share</Button>
          </div>
        }
      />

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Report Period:</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            style={{ padding: "0.375rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            style={{ padding: "0.375rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Total Patients</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#3b82f6" }}>{patientStats.total}</div>
            <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "0.25rem" }}>+{patientStats.newThisMonth} this month</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Active Patients</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981" }}>{patientStats.active}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>{((patientStats.active/patientStats.total)*100).toFixed(1)}% of total</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Admitted</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f59e0b" }}>{patientStats.admitted}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Currently in hospital</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>New This Month</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#8b5cf6" }}>{patientStats.newThisMonth}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Registration growth</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Age Distribution</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Age Range</th>
                    <th style={{ padding: "0.75rem", textAlign: "right", fontWeight: "600", fontSize: "0.875rem" }}>Count</th>
                    <th style={{ padding: "0.75rem", textAlign: "right", fontWeight: "600", fontSize: "0.875rem" }}>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {patientStats.ageDistribution.map((age, i) => (
                    <tr key={age.range} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "0.75rem", fontWeight: "500" }}>{age.range} years</td>
                      <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "1.125rem", fontWeight: "600", color: "#3b82f6" }}>{age.count}</td>
                      <td style={{ padding: "0.75rem", textAlign: "right", color: "#6b7280" }}>{((age.count/patientStats.total)*100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Gender Distribution</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", textAlign: "center" }}>
              <div style={{ padding: "1rem", backgroundColor: "#dbeafe", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>{patientStats.gender.male}</div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Male</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{((patientStats.gender.male/patientStats.total)*100).toFixed(1)}%</div>
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#fce7f3", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ec4899" }}>{patientStats.gender.female}</div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Female</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{((patientStats.gender.female/patientStats.total)*100).toFixed(1)}%</div>
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#6b7280" }}>{patientStats.gender.other}</div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Other</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{((patientStats.gender.other/patientStats.total)*100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Report Comments & Notes</h3>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your analysis, observations, or recommendations for this patient report..."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "0.75rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              resize: "vertical"
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
            <Button size="sm" onClick={() => alert('Comments saved!')}>Save Comments</Button>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", fontSize: "0.75rem", color: "#6b7280" }}>
        Report generated on {new Date().toLocaleString()} | Data range: {dateRange.startDate} to {dateRange.endDate} | Total records: {patientStats.total}
      </div>
    </>
  );
}
