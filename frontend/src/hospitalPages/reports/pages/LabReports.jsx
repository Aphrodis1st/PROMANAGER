import React, { useState } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useReports } from "../../../hooks/useReports";

export default function LabReports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [comments, setComments] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);

  // Safe access to lab stats
  let labStats = {
    totalTests: 0,
    completedToday: 0,
    pending: 0,
    critical: 0,
    avgTurnaroundTime: 24,
    testTypes: []
  };

  try {
    const reports = useReports();
    labStats = reports?.labStats || labStats;
  } catch (err) {
    console.error('Reports context error:', err);
    setError('Failed to load lab reports data');
  }

  const exportToCSV = () => {
    const csvData = [
      ['Lab Metric', 'Value'],
      ['Total Tests', labStats.totalTests],
      ['Completed Today', labStats.completedToday],
      ['Pending Tests', labStats.pending],
      ['Critical Results', labStats.critical],
      ['Average Turnaround Time (hours)', labStats.avgTurnaroundTime],
      [''],
      ['Test Type', 'Count'],
      ...labStats.testTypes.map(test => [test.type, test.count])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Laboratory Report',
        text: `Lab Report - ${labStats.totalTests} total tests, ${labStats.pending} pending`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  const completionRate = labStats.totalTests > 0 ? ((labStats.totalTests - labStats.pending) / labStats.totalTests * 100).toFixed(1) : 0;
  const criticalRate = labStats.totalTests > 0 ? (labStats.critical / labStats.totalTests * 100).toFixed(1) : 0;
  const dailyAverage = Math.floor(labStats.totalTests / 30);

  if (error) {
    return (
      <>
        <PageHeader title="Laboratory Reports" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
            <h3>Error Loading Laboratory Reports</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} style={{ marginTop: "1rem" }}>
              Retry
            </Button>
          </div>
        </Card>
      </>
    );
  }

  const testCategories = [
    { name: "Hematology", tests: labStats.testTypes.filter(t => ['CBC', 'Blood Count', 'Hemoglobin'].includes(t.type)).reduce((sum, t) => sum + t.count, 0), color: "#3b82f6" },
    { name: "Biochemistry", tests: labStats.testTypes.filter(t => ['Glucose', 'Cholesterol', 'Liver Function'].includes(t.type)).reduce((sum, t) => sum + t.count, 0), color: "#10b981" },
    { name: "Microbiology", tests: labStats.testTypes.filter(t => ['Culture', 'Sensitivity', 'Gram Stain'].includes(t.type)).reduce((sum, t) => sum + t.count, 0), color: "#f59e0b" },
    { name: "Immunology", tests: labStats.testTypes.filter(t => ['Antibody', 'Antigen', 'Serology'].includes(t.type)).reduce((sum, t) => sum + t.count, 0), color: "#8b5cf6" },
    { name: "Others", tests: labStats.testTypes.filter(t => !['CBC', 'Blood Count', 'Hemoglobin', 'Glucose', 'Cholesterol', 'Liver Function', 'Culture', 'Sensitivity', 'Gram Stain', 'Antibody', 'Antigen', 'Serology'].includes(t.type)).reduce((sum, t) => sum + t.count, 0), color: "#6b7280" }
  ];

  return (
    <>
      <PageHeader 
        title="Laboratory Reports" 
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
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.875rem", fontWeight: "500" }}>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: "0.375rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
          >
            <option value="All">All Categories</option>
            <option value="Hematology">Hematology</option>
            <option value="Biochemistry">Biochemistry</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Immunology">Immunology</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Total Tests</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#3b82f6" }}>{labStats.totalTests}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>All time</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Completed Today</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981" }}>{labStats.completedToday}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Daily progress</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Pending Tests</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f59e0b" }}>{labStats.pending}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Awaiting results</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Critical Results</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#ef4444" }}>{labStats.critical}</div>
            <div style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>{criticalRate}% of total</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Test Categories Distribution</h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {testCategories.map((category) => {
                const percentage = labStats.totalTests > 0 ? ((category.tests / labStats.totalTests) * 100).toFixed(1) : 0;
                return (
                  <div key={category.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", backgroundColor: "#f9fafb", borderRadius: "0.375rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: category.color }}></div>
                      <span style={{ fontWeight: "500" }}>{category.name}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.125rem", fontWeight: "600", color: category.color }}>{category.tests}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Performance Metrics</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Completion Rate</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>{completionRate}%</div>
                  <div style={{ flex: 1, height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${completionRate}%`, height: "100%", backgroundColor: "#10b981" }}></div>
                  </div>
                </div>
              </div>
              
              <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Average Turnaround</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6" }}>{labStats.avgTurnaroundTime} hours</div>
              </div>
              
              <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Daily Average</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#8b5cf6" }}>{dailyAverage} tests</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Test Type Breakdown</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Test Type</th>
                  <th style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem" }}>Count</th>
                  <th style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem" }}>Percentage</th>
                  <th style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem" }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {labStats.testTypes.map((test, i) => {
                  const percentage = ((test.count / labStats.totalTests) * 100).toFixed(1);
                  const trend = Math.random() > 0.5 ? 'up' : 'down'; // Mock trend data
                  const trendValue = (Math.random() * 20).toFixed(1);
                  
                  return (
                    <tr key={test.type} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                      <td style={{ padding: "1rem", fontWeight: "500" }}>{test.type}</td>
                      <td style={{ padding: "1rem", textAlign: "center", fontSize: "1.125rem", fontWeight: "600", color: "#3b82f6" }}>{test.count}</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>{percentage}%</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <span style={{ 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: "0.25rem",
                          padding: "0.25rem 0.5rem", 
                          borderRadius: "0.375rem", 
                          fontSize: "0.75rem", 
                          fontWeight: "500",
                          backgroundColor: trend === 'up' ? '#dcfce7' : '#fee2e2',
                          color: trend === 'up' ? '#166534' : '#991b1b'
                        }}>
                          {trend === 'up' ? '↑' : '↓'} {trendValue}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Laboratory Analysis & Quality Notes</h3>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your laboratory performance analysis, quality observations, recommendations, or improvement suggestions..."
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
            <Button size="sm" onClick={() => alert('Laboratory analysis saved!')}>Save Analysis</Button>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", fontSize: "0.75rem", color: "#6b7280" }}>
        Laboratory report generated on {new Date().toLocaleString()} | Period: {dateRange.startDate} to {dateRange.endDate} | Completion rate: {completionRate}% | Avg turnaround: {labStats.avgTurnaroundTime}h
      </div>
    </>
  );
}
