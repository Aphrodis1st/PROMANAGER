import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useBilling } from "../../../hooks/useBilling";

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  let getInvoiceById = () => null;

  try {
    const billingContext = useBilling();
    getInvoiceById = billingContext?.getInvoiceById || (() => null);
  } catch (err) {
    console.error("Billing context error:", err);
    setError("Failed to load billing context");
  }

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true);
        const invoiceData = getInvoiceById(id);
        if (invoiceData) {
          // Enhanced invoice with detailed line items
          const enhancedInvoice = {
            ...invoiceData,
            hospitalInfo: {
              name: "MadSmart Hospital",
              address: "123 Healthcare Ave, Medical District",
              city: "Healthcare City, HC 12345",
              phone: "(555) 123-4567",
              email: "billing@madsmarthospital.com",
              taxId: "12-3456789"
            },
            patientInfo: {
              name: invoiceData.patientName,
              id: invoiceData.patientId,
              address: "456 Patient St, Residential Area",
              city: "Patient City, PC 67890",
              phone: "(555) 987-6543",
              email: "patient@email.com",
              dateOfBirth: "1985-06-15",
              insuranceId: "INS123456789"
            },
            lineItems: [
              { id: 1, description: "Emergency Room Visit", quantity: 1, unitPrice: 1500, total: 1500, code: "ER001" },
              { id: 2, description: "Blood Test - Complete Panel", quantity: 1, unitPrice: 350, total: 350, code: "LAB001" },
              { id: 3, description: "X-Ray Chest", quantity: 2, unitPrice: 200, total: 400, code: "RAD001" },
              { id: 4, description: "Consultation - Cardiology", quantity: 1, unitPrice: 800, total: 800, code: "CON001" },
              { id: 5, description: "Medication - Prescribed", quantity: 1, unitPrice: 250, total: 250, code: "MED001" },
              { id: 6, description: "Room Charges (2 days)", quantity: 2, unitPrice: 600, total: 1200, code: "ROOM001" }
            ],
            subtotal: invoiceData.amount * 0.9,
            tax: invoiceData.amount * 0.1,
            discount: 0,
            total: invoiceData.amount,
            paymentHistory: [
              { date: "2024-01-16", amount: invoiceData.paid, method: invoiceData.paymentMethod || "Cash", reference: "PAY001" }
            ].filter(p => p.amount > 0)
          };
          setInvoice(enhancedInvoice);
        } else {
          setError("Invoice not found");
        }
      } catch (err) {
        setError("Failed to load invoice");
        console.error("Error loading invoice:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadInvoice();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert("PDF download functionality would be implemented here");
  };

  const getStatusBadge = (status) => {
    const variants = {
      Paid: "success",
      Partial: "warning", 
      Pending: "danger",
      Overdue: "danger"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Invoice Details" />
        <Card>
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Loading invoice...</div>
            <div style={{ color: "#6b7280" }}>Please wait while we fetch the invoice details.</div>
          </div>
        </Card>
      </>
    );
  }

  if (error || !invoice) {
    return (
      <>
        <PageHeader title="Invoice Details" />
        <Card>
          <div style={{ textAlign: "center", padding: "3rem", color: "#ef4444" }}>
            <h3>Error Loading Invoice</h3>
            <p>{error || "Invoice not found"}</p>
            <Button onClick={() => navigate("/hospital/billing/invoices")} style={{ marginTop: "1rem" }}>
              Back to Invoices
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title={`Invoice ${invoice.invoiceNumber}`}
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button variant="secondary" onClick={handlePrint}>
              🖨️ Print
            </Button>
            <Button variant="secondary" onClick={handleDownloadPDF}>
              📄 Download PDF
            </Button>
            <Button onClick={() => navigate("/hospital/billing/invoices")}>
              ← Back to List
            </Button>
          </div>
        }
      />

      <div className="invoice-container" style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Invoice Header */}
        <Card style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            {/* Hospital Info */}
            <div>
              <h2 style={{ color: "#1f2937", marginBottom: "1rem", fontSize: "1.5rem" }}>
                {invoice.hospitalInfo.name}
              </h2>
              <div style={{ color: "#6b7280", lineHeight: "1.6" }}>
                <div>{invoice.hospitalInfo.address}</div>
                <div>{invoice.hospitalInfo.city}</div>
                <div>Phone: {invoice.hospitalInfo.phone}</div>
                <div>Email: {invoice.hospitalInfo.email}</div>
                <div>Tax ID: {invoice.hospitalInfo.taxId}</div>
              </div>
            </div>

            {/* Invoice Info */}
            <div style={{ textAlign: "right" }}>
              <h1 style={{ color: "#3b82f6", marginBottom: "1rem", fontSize: "2rem" }}>INVOICE</h1>
              <div style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                <strong>Invoice #: {invoice.invoiceNumber}</strong>
              </div>
              <div style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
                Invoice Date: {new Date(invoice.date).toLocaleDateString()}
              </div>
              <div style={{ color: "#6b7280", marginBottom: "1rem" }}>
                Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
              </div>
              <div>{getStatusBadge(invoice.status)}</div>
            </div>
          </div>

          {/* Patient Info */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>Bill To:</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div style={{ color: "#6b7280", lineHeight: "1.6" }}>
                <div style={{ fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem" }}>
                  {invoice.patientInfo.name}
                </div>
                <div>Patient ID: {invoice.patientInfo.id}</div>
                <div>{invoice.patientInfo.address}</div>
                <div>{invoice.patientInfo.city}</div>
                <div>Phone: {invoice.patientInfo.phone}</div>
                <div>Email: {invoice.patientInfo.email}</div>
              </div>
              <div style={{ color: "#6b7280", lineHeight: "1.6" }}>
                <div>Date of Birth: {new Date(invoice.patientInfo.dateOfBirth).toLocaleDateString()}</div>
                <div>Insurance ID: {invoice.patientInfo.insuranceId}</div>
                {invoice.insuranceProvider && (
                  <div>Insurance Provider: {invoice.insuranceProvider}</div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Line Items */}
        <Card style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>Services & Charges</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem", color: "#374151", fontWeight: "600" }}>Code</th>
                  <th style={{ textAlign: "left", padding: "0.75rem", color: "#374151", fontWeight: "600" }}>Description</th>
                  <th style={{ textAlign: "center", padding: "0.75rem", color: "#374151", fontWeight: "600" }}>Qty</th>
                  <th style={{ textAlign: "right", padding: "0.75rem", color: "#374151", fontWeight: "600" }}>Unit Price</th>
                  <th style={{ textAlign: "right", padding: "0.75rem", color: "#374151", fontWeight: "600" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>{item.code}</td>
                    <td style={{ padding: "0.75rem", color: "#1f2937" }}>{item.description}</td>
                    <td style={{ padding: "0.75rem", textAlign: "center", color: "#6b7280" }}>{item.quantity}</td>
                    <td style={{ padding: "0.75rem", textAlign: "right", color: "#6b7280" }}>
                      ${item.unitPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right", color: "#1f2937", fontWeight: "600" }}>
                      ${item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Totals */}
        <Card style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ minWidth: "300px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ color: "#6b7280" }}>Subtotal:</span>
                <span style={{ color: "#1f2937", fontWeight: "600" }}>${invoice.subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ color: "#6b7280" }}>Tax (10%):</span>
                <span style={{ color: "#1f2937", fontWeight: "600" }}>${invoice.tax.toLocaleString()}</span>
              </div>
              {invoice.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ color: "#6b7280" }}>Discount:</span>
                  <span style={{ color: "#ef4444", fontWeight: "600" }}>-${invoice.discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", borderTop: "2px solid #e5e7eb", marginTop: "0.5rem" }}>
                <span style={{ color: "#1f2937", fontWeight: "700", fontSize: "1.1rem" }}>Total Amount:</span>
                <span style={{ color: "#3b82f6", fontWeight: "700", fontSize: "1.2rem" }}>${invoice.total.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0" }}>
                <span style={{ color: "#6b7280" }}>Amount Paid:</span>
                <span style={{ color: "#10b981", fontWeight: "600" }}>${invoice.paid.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderTop: "1px solid #f3f4f6" }}>
                <span style={{ color: "#1f2937", fontWeight: "600" }}>Balance Due:</span>
                <span style={{ 
                  color: invoice.balance > 0 ? "#ef4444" : "#10b981", 
                  fontWeight: "700",
                  fontSize: "1.1rem"
                }}>
                  ${invoice.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment History */}
        {invoice.paymentHistory.length > 0 && (
          <Card style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>Payment History</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "0.75rem", color: "#374151", fontWeight: "600" }}>Date</th>
                    <th style={{ textAlign: "left", padding: "0.75rem", color: "#374151", fontWeight: "600" }}>Method</th>
                    <th style={{ textAlign: "left", padding: "0.75rem", color: "#374151", fontWeight: "600" }}>Reference</th>
                    <th style={{ textAlign: "right", padding: "0.75rem", color: "#374151", fontWeight: "600" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.paymentHistory.map((payment, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "0.75rem", color: "#1f2937" }}>
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.75rem", color: "#6b7280" }}>{payment.method}</td>
                      <td style={{ padding: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>{payment.reference}</td>
                      <td style={{ padding: "0.75rem", textAlign: "right", color: "#10b981", fontWeight: "600" }}>
                        ${payment.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Actions */}
        {invoice.balance > 0 && (
          <Card>
            <div style={{ textAlign: "center", padding: "1.5rem" }}>
              <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>Outstanding Balance</h3>
              <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
                This invoice has an outstanding balance of ${invoice.balance.toLocaleString()}
              </p>
              <Button 
                onClick={() => navigate(`/hospital/billing/payment?invoiceId=${invoice.id}`)}
                style={{ marginRight: "1rem" }}
              >
                Make Payment
              </Button>
              <Button 
                variant="secondary"
                onClick={() => navigate(`/hospital/billing/invoices`)}
              >
                Back to Invoices
              </Button>
            </div>
          </Card>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "2rem", padding: "1rem", color: "#9ca3af", fontSize: "0.875rem" }}>
          <p>Thank you for choosing {invoice.hospitalInfo.name}</p>
          <p>For billing inquiries, please contact us at {invoice.hospitalInfo.phone} or {invoice.hospitalInfo.email}</p>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .invoice-container {
            max-width: none !important;
          }
          
          button {
            display: none !important;
          }
          
          .page-header {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}