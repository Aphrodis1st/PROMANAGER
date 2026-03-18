import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import Badge from "../../../components/hospital/Badge";
import { useBilling } from "../../../hooks/useBilling";

export default function BillingDashboard() {
  const navigate = useNavigate();
  const { invoices, insuranceClaims, loading, fetchInvoices } = useBilling();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paid, 0);
    const totalPending = invoices.reduce((sum, inv) => sum + inv.balance, 0);
    const paidInvoices = invoices.filter(inv => inv.status === "Paid").length;
    const pendingInvoices = invoices.filter(inv => inv.status === "Pending").length;
    const partialInvoices = invoices.filter(inv => inv.status === "Partial").length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayRevenue = invoices
      .filter(inv => inv.date === today)
      .reduce((sum, inv) => sum + inv.paid, 0);
    
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthlyRevenue = invoices
      .filter(inv => inv.date?.startsWith(thisMonth))
      .reduce((sum, inv) => sum + inv.paid, 0);

    const pendingClaims = insuranceClaims.filter(c => c.status === "Pending").length;
    const approvedClaims = insuranceClaims.filter(c => c.status === "Approved").length;

    return {
      totalRevenue,
      totalPaid,
      totalPending,
      paidInvoices,
      pendingInvoices,
      partialInvoices,
      todayRevenue,
      monthlyRevenue,
      pendingClaims,
      approvedClaims
    };
  }, [invoices, insuranceClaims]);

  return (
    <>
      <PageHeader 
        title="Billing & Revenue Dashboard" 
        action={
          <Button onClick={() => navigate("/hospital/billing/create")}>
            + Create Invoice
          </Button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6" }}>
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Total Revenue</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#10b981" }}>
              ${stats.totalPaid.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Collected</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#f59e0b" }}>
              ${stats.totalPending.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Outstanding</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#8b5cf6" }}>
              ${stats.todayRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Today's Revenue</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#10b981" }}>{stats.paidInvoices}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Paid Invoices</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#f59e0b" }}>{stats.partialInvoices}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Partial Payments</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#ef4444" }}>{stats.pendingInvoices}</div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>Pending Invoices</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <div>
          <Card style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
              Recent Invoices
            </h3>
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
            ) : invoices.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {invoices.slice(0, 5).map((invoice) => (
                  <div 
                    key={invoice.id}
                    style={{ 
                      padding: "1rem", 
                      backgroundColor: "#f9fafb", 
                      borderRadius: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "600" }}>{invoice.invoiceNumber}</div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>{invoice.patientName}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{invoice.date}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "700", fontSize: "1.125rem" }}>
                        ${invoice.amount.toLocaleString()}
                      </div>
                      <Badge variant={
                        invoice.status === "Paid" ? "success" : 
                        invoice.status === "Partial" ? "warning" : "danger"
                      }>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                No invoices found
              </div>
            )}
            <Button 
              variant="secondary" 
              onClick={() => navigate("/hospital/billing/invoices")}
              style={{ marginTop: "1rem", width: "100%" }}
            >
              View All Invoices
            </Button>
          </Card>

          <Card>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
              Monthly Revenue Trend
            </h3>
            <div style={{ 
              padding: "2rem", 
              backgroundColor: "#f9fafb", 
              borderRadius: "0.5rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#3b82f6" }}>
                ${stats.monthlyRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
                Revenue This Month
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
              Quick Actions
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Button onClick={() => navigate("/hospital/billing/create")}>
                Create Invoice
              </Button>
              <Button variant="secondary" onClick={() => navigate("/hospital/billing/payment")}>
                Process Payment
              </Button>
              <Button variant="secondary" onClick={() => navigate("/hospital/billing/insurance")}>
                Insurance Claims
              </Button>
              <Button variant="secondary" onClick={() => navigate("/hospital/billing/reports")}>
                Revenue Reports
              </Button>
              <Button variant="secondary" onClick={() => navigate("/hospital/reports/financial")}>
                📊 Financial Analytics
              </Button>
              <Button variant="secondary" onClick={() => navigate("/hospital/billing/settings")}>
                Settings
              </Button>
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
              Insurance Claims
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem" }}>Pending Claims</span>
                <Badge variant="warning">{stats.pendingClaims}</Badge>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem" }}>Approved Claims</span>
                <Badge variant="success">{stats.approvedClaims}</Badge>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.875rem" }}>Total Claims</span>
                <Badge variant="info">{insuranceClaims.length}</Badge>
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => navigate("/hospital/billing/insurance")}
              style={{ marginTop: "1rem", width: "100%" }}
            >
              Manage Claims
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
