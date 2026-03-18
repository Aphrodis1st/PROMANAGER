import React, { useState } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useReports } from "../../../hooks/useReports";

export default function FinancialReports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [comments, setComments] = useState("");
  const [error, setError] = useState(null);

  // Safe access to financial stats
  let financialStats = {
    todayRevenue: 0,
    monthRevenue: 0,
    yearRevenue: 0,
    outstanding: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    paymentMethods: { cash: 0, card: 0, upi: 0, insurance: 0 }
  };

  try {
    const reports = useReports();
    financialStats = reports?.financialStats || financialStats;
  } catch (err) {
    console.error('Reports context error:', err);
    setError('Failed to load financial reports data');
  }

  const exportToCSV = () => {
    const csvData = [
      ['Financial Metric', 'Amount (₹)'],
      ['Today Revenue', financialStats.todayRevenue],
      ['Monthly Revenue', financialStats.monthRevenue],
      ['Yearly Revenue', financialStats.yearRevenue],
      ['Outstanding Amount', financialStats.outstanding],
      ['Total Invoices', financialStats.totalInvoices],
      ['Paid Invoices', financialStats.paidInvoices],
      ['Cash Payments', financialStats.paymentMethods.cash],
      ['Card Payments', financialStats.paymentMethods.card],
      ['UPI Payments', financialStats.paymentMethods.upi],
      ['Insurance Payments', financialStats.paymentMethods.insurance]
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Financial Report',
        text: `Financial Report - Monthly Revenue: ₹${financialStats.monthRevenue.toLocaleString()}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  const collectionRate = financialStats.totalInvoices > 0 ? ((financialStats.paidInvoices / financialStats.totalInvoices) * 100).toFixed(1) : 0;
  const outstandingRate = financialStats.yearRevenue > 0 ? ((financialStats.outstanding / financialStats.yearRevenue) * 100).toFixed(1) : 0;

  if (error) {
    return (
      <>
        <PageHeader title="Financial Reports" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
            <h3>Error Loading Financial Reports</h3>
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
        title="Financial Reports" 
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
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Today's Revenue</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981" }}>₹{financialStats.todayRevenue.toLocaleString()}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Daily collection</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>This Month</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#3b82f6" }}>₹{financialStats.monthRevenue.toLocaleString()}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Monthly target progress</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>This Year</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#8b5cf6" }}>₹{financialStats.yearRevenue.toLocaleString()}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Annual performance</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Outstanding</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f59e0b" }}>₹{financialStats.outstanding.toLocaleString()}</div>
            <div style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>{outstandingRate}% of yearly revenue</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Payment Methods Breakdown</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Payment Method</th>
                    <th style={{ padding: "0.75rem", textAlign: "right", fontWeight: "600", fontSize: "0.875rem" }}>Amount (₹)</th>
                    <th style={{ padding: "0.75rem", textAlign: "right", fontWeight: "600", fontSize: "0.875rem" }}>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(financialStats.paymentMethods).map(([method, amount]) => {
                    const total = Object.values(financialStats.paymentMethods).reduce((sum, val) => sum + val, 0);
                    const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
                    return (
                      <tr key={method} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "0.75rem", fontWeight: "500", textTransform: "capitalize" }}>
                          {method === 'upi' ? 'UPI' : method}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "1.125rem", fontWeight: "600", color: "#10b981" }}>
                          ₹{amount.toLocaleString()}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right", color: "#6b7280" }}>{percentage}%</td>
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
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Collection Analytics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "#f0fdf4", borderRadius: "0.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#10b981" }}>{financialStats.totalInvoices}</div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Invoices</div>
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#dbeafe", borderRadius: "0.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#3b82f6" }}>{financialStats.paidInvoices}</div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Paid Invoices</div>
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#fef3c7", borderRadius: "0.5rem", textAlign: "center", gridColumn: "span 2" }}>
                <div style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#f59e0b" }}>{collectionRate}%</div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Collection Rate</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Revenue Trend Analysis</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Daily Average</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6" }}>₹{Math.floor(financialStats.monthRevenue / 30).toLocaleString()}</div>
            </div>
            <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Monthly Growth</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>+12.5%</div>
            </div>
            <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Yearly Target</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#8b5cf6" }}>₹50,00,000</div>
            </div>
            <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Target Progress</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b" }}>{((financialStats.yearRevenue / 5000000) * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Financial Analysis & Comments</h3>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your financial analysis, observations, recommendations, or action items..."
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
            <Button size="sm" onClick={() => alert('Financial analysis saved!')}>Save Analysis</Button>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", fontSize: "0.75rem", color: "#6b7280" }}>
        Financial report generated on {new Date().toLocaleString()} | Period: {dateRange.startDate} to {dateRange.endDate} | Collection Rate: {collectionRate}%
      </div>
    </>
  );
}
