import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useLab } from "../../../hooks/useLab";
import { Print as PrintIcon, Share as ShareIcon, Email as EmailIcon, Download as DownloadIcon } from '@mui/icons-material';

export default function LabOrderResultsView() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchLabOrderById } = useLab();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await fetchLabOrderById(orderId);
      console.log('Loaded order data:', data);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const variants = {
      Pending: "warning",
      "Sample Collected": "info", 
      "In Progress": "info",
      Completed: "success",
      Reviewed: "secondary",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      Routine: "success",
      Urgent: "warning", 
      STAT: "danger",
    };
    return <Badge variant={variants[priority] || "secondary"}>{priority}</Badge>;
  };

  const handlePrint = () => {
    const printContent = document.getElementById('lab-results-content');
    const originalContent = document.body.innerHTML;
    
    // Create print-friendly content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Lab Results - ${order?.patientName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .patient-info { margin-bottom: 20px; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: bold; color: #666; font-size: 12px; }
            .value { font-weight: 600; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .test-section { margin-bottom: 30px; }
            .test-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #333; }
            .flag { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; }
            .flag-normal { background-color: #dcfce7; color: #16a34a; }
            .flag-high { background-color: #fed7aa; color: #ea580c; }
            .flag-low { background-color: #fed7aa; color: #ea580c; }
            .flag-critical { background-color: #fee2e2; color: #dc2626; }
            .comments { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laboratory Test Results</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = (method) => {
    const resultsText = generateResultsText();
    
    switch(method) {
      case 'email':
        const subject = `Lab Results - ${order?.patientName}`;
        const body = encodeURIComponent(resultsText);
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${body}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(resultsText).then(() => {
          alert('Lab results copied to clipboard!');
        }).catch(() => {
          alert('Failed to copy to clipboard');
        });
        break;
      case 'download':
        downloadResults();
        break;
    }
    setShowShareMenu(false);
  };

  const generateResultsText = () => {
    if (!order) return '';
    
    let text = `LAB RESULTS\n`;
    text += `=============\n\n`;
    text += `Patient: ${order.patientName}\n`;
    text += `MRN: ${order.patientId}\n`;
    text += `Ordered By: ${order.orderedBy}\n`;
    text += `Order Date: ${new Date(order.orderedAt).toLocaleDateString()}\n`;
    text += `Status: ${order.status}\n`;
    if (order.completedAt) {
      text += `Completed: ${new Date(order.completedAt).toLocaleDateString()}\n`;
    }
    text += `\n`;
    
    if (order.results) {
      Object.entries(order.results).forEach(([testName, testResults]) => {
        text += `${testName.toUpperCase()}\n`;
        text += `-`.repeat(testName.length) + `\n`;
        Object.entries(testResults).forEach(([param, value]) => {
          text += `${param}: ${value}\n`;
        });
        text += `\n`;
      });
    }
    
    if (order.comments) {
      text += `COMMENTS:\n${order.comments}\n`;
    }
    
    return text;
  };

  const downloadResults = () => {
    const resultsText = generateResultsText();
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-results-${order?.patientName?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFlag = (value, param) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;
    
    if (numValue < param.critical?.low || numValue > param.critical?.high) {
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

  if (loading) {
    return (
      <>
        <PageHeader title="Lab Order Results" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading order...</div>
        </Card>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <PageHeader title="Lab Order Results" />
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
        title="Lab Order Results" 
        action={
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {order.status === "Completed" && (
              <>
                <Button 
                  variant="secondary" 
                  onClick={handlePrint}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <PrintIcon sx={{ fontSize: 18 }} />
                  Print
                </Button>
                <div style={{ position: "relative" }}>
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    <ShareIcon sx={{ fontSize: 18 }} />
                    Share
                  </Button>
                  {showShareMenu && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      zIndex: 10,
                      minWidth: "150px",
                      marginTop: "0.25rem"
                    }}>
                      <button
                        onClick={() => handleShare('email')}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.875rem"
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                      >
                        <EmailIcon sx={{ fontSize: 16 }} />
                        Email
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.875rem"
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                      >
                        📋 Copy to Clipboard
                      </button>
                      <button
                        onClick={() => handleShare('download')}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.875rem",
                          borderTop: "1px solid #e5e7eb"
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                      >
                        <DownloadIcon sx={{ fontSize: 16 }} />
                        Download
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {order.status !== "Completed" && (
              <Button onClick={() => navigate(`/hospital/lab/orders/${orderId}/results/entry`)}>
                Enter Results
              </Button>
            )}
            <Button variant="secondary" onClick={() => navigate("/hospital/lab/orders")}>
              Back to Orders
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                console.log('🔄 Manual reload triggered');
                console.log('Current order state:', order);
                console.log('Order ID from params:', orderId);
                loadOrder();
              }}
            >
              Reload Order
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                console.log('🧪 Debug Info:');
                console.log('- Order ID:', orderId);
                console.log('- Current Order:', order);
                console.log('- Order Status:', order?.status);
                console.log('- Order Results:', order?.results);
                console.log('- Has Results:', !!order?.results);
                console.log('- Results Keys:', order?.results ? Object.keys(order.results) : 'No results');
                alert('Check console for debug information');
              }}
            >
              Debug Info
            </Button>
          </div>
        }
      />

      {/* Patient & Order Information */}
      <div id="lab-results-content">
        <Card style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
          Order Information
        </h3>
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
            {getPriorityBadge(order.priority)}
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Status</div>
            {getStatusBadge(order.status)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Order Date</div>
            <div style={{ fontWeight: "600" }}>{new Date(order.orderedAt).toLocaleDateString()}</div>
          </div>
          {order.completedAt && (
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Completed Date</div>
              <div style={{ fontWeight: "600" }}>{new Date(order.completedAt).toLocaleDateString()}</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Tests Ordered</div>
            <div style={{ fontWeight: "600" }}>{order.tests?.length || 0} test(s)</div>
          </div>
        </div>
        {order.clinicalNotes && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Clinical Notes</div>
            <div style={{ fontSize: "0.875rem" }}>{order.clinicalNotes}</div>
          </div>
        )}
      </Card>

      {/* Test Results */}
      {order.status === "Completed" && order.results ? (
        <Card style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
            Test Results
          </h3>
          
          {Object.entries(order.results).map(([testName, testResults]) => (
            <div key={testName} style={{ marginBottom: "2rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
                {testName}
              </h4>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Parameter</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Result</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600" }}>Reference Range</th>
                      <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.875rem", fontWeight: "600" }}>Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(testResults).map(([paramName, value]) => (
                      <tr key={paramName} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "0.75rem", fontWeight: "500" }}>{paramName}</td>
                        <td style={{ padding: "0.75rem", fontWeight: "600" }}>{value}</td>
                        <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                          {/* You can add reference ranges here based on test parameters */}
                          -
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "center" }}>
                          {/* You can add flags here based on values */}
                          <span style={{ 
                            padding: "0.25rem 0.75rem", 
                            borderRadius: "1rem", 
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            backgroundColor: "#dcfce7",
                            color: "#16a34a"
                          }}>
                            NORMAL
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {order.comments && (
            <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>Lab Technician Comments</div>
              <div style={{ fontSize: "0.875rem", color: "#4b5563" }}>{order.comments}</div>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
              Results Not Available
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
              {order.status === "Pending" 
                ? "This order is still pending. Results will be available once the tests are completed."
                : order.status === "In Progress" || order.status === "Sample Collected"
                ? "Tests are currently in progress. Results will be available soon."
                : "No results have been entered for this order yet."
              }
            </p>
            {order.status !== "Completed" && (
              <Button onClick={() => navigate(`/hospital/lab/orders/${orderId}/results/entry`)}>
                Enter Results
              </Button>
            )}
          </div>
        </Card>
      )}
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5
          }}
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </>
  );
}