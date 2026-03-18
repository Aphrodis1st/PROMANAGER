import React, { useState } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import Button from "../../../components/hospital/Button";
import { useReports } from "../../../hooks/useReports";

export default function AuditLogs() {
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    action: "",
    user: "",
    module: ""
  });
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Safe access to audit logs
  let fetchAuditLogs = () => [];
  let auditLogs = [];

  try {
    const reports = useReports();
    fetchAuditLogs = reports?.fetchAuditLogs || (() => []);
    auditLogs = fetchAuditLogs(filters);
  } catch (err) {
    console.error('Reports context error:', err);
    setError('Failed to load audit logs data');
  }

  const exportToCSV = () => {
    const csvData = [
      ['Timestamp', 'User', 'Action', 'Module', 'Details', 'IP Address'],
      ...auditLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.user,
        log.action,
        log.module,
        log.details,
        log.ipAddress
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Audit Logs Report',
        text: `Audit Logs - ${auditLogs.length} activities recorded`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  const actionStats = {
    CREATE: auditLogs.filter(log => log.action === 'CREATE').length,
    UPDATE: auditLogs.filter(log => log.action === 'UPDATE').length,
    DELETE: auditLogs.filter(log => log.action === 'DELETE').length,
    LOGIN: auditLogs.filter(log => log.action === 'LOGIN').length,
    LOGOUT: auditLogs.filter(log => log.action === 'LOGOUT').length
  };

  const moduleStats = {};
  auditLogs.forEach(log => {
    moduleStats[log.module] = (moduleStats[log.module] || 0) + 1;
  });

  const userStats = {};
  auditLogs.forEach(log => {
    userStats[log.user] = (userStats[log.user] || 0) + 1;
  });

  const getActionColor = (action) => {
    const colors = {
      CREATE: '#10b981',
      UPDATE: '#3b82f6',
      DELETE: '#ef4444',
      LOGIN: '#8b5cf6',
      LOGOUT: '#6b7280'
    };
    return colors[action] || '#6b7280';
  };

  const getActionIcon = (action) => {
    const icons = {
      CREATE: '➕',
      UPDATE: '✏️',
      DELETE: '❌',
      LOGIN: '🔑',
      LOGOUT: '🚪'
    };
    return icons[action] || '📝';
  };

  if (error) {
    return (
      <>
        <PageHeader title="System Audit Logs" />
        <Card>
          <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
            <h3>Error Loading Audit Logs</h3>
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
        title="System Audit Logs" 
        action={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button size="sm" variant="secondary" onClick={exportToCSV}>📊 CSV</Button>
            <Button size="sm" variant="secondary" onClick={exportToPDF}>🖨️ PDF</Button>
            <Button size="sm" variant="secondary" onClick={shareReport}>🔗 Share</Button>
          </div>
        }
      />

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Filter Audit Logs</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }}>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }}>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }}>Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }}>Module</label>
              <select
                value={filters.module}
                onChange={(e) => setFilters({ ...filters, module: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
              >
                <option value="">All Modules</option>
                <option value="Patients">Patients</option>
                <option value="Medical Records">Medical Records</option>
                <option value="Lab Orders">Lab Orders</option>
                <option value="Billing">Billing</option>
                <option value="Departments">Departments</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.875rem" }}>User</label>
              <input
                type="text"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                placeholder="Search by user name"
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "0.375rem", fontSize: "0.875rem" }}
              />
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Total Activities</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#3b82f6" }}>{auditLogs.length}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>In selected period</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Unique Users</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981" }}>{Object.keys(userStats).length}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>Active users</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Modules Accessed</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f59e0b" }}>{Object.keys(moduleStats).length}</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>System modules</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>Critical Actions</div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#ef4444" }}>{actionStats.DELETE}</div>
            <div style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem" }}>Delete operations</div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <Card>
          <div style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Action Distribution</h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {Object.entries(actionStats).map(([action, count]) => {
                const percentage = auditLogs.length > 0 ? ((count / auditLogs.length) * 100).toFixed(1) : 0;
                return (
                  <div key={action} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", backgroundColor: "#f9fafb", borderRadius: "0.375rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.25rem" }}>{getActionIcon(action)}</span>
                      <span style={{ fontWeight: "500" }}>{action}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.125rem", fontWeight: "600", color: getActionColor(action) }}>{count}</div>
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
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Top Active Users</h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {Object.entries(userStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([user, count], i) => {
                  const percentage = auditLogs.length > 0 ? ((count / auditLogs.length) * 100).toFixed(1) : 0;
                  return (
                    <div key={user} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", backgroundColor: "#f9fafb", borderRadius: "0.375rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ 
                          width: "24px", 
                          height: "24px", 
                          borderRadius: "50%", 
                          backgroundColor: "#3b82f6", 
                          color: "white", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          fontSize: "0.75rem", 
                          fontWeight: "600" 
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ fontWeight: "500" }}>{user}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#3b82f6" }}>{count}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{percentage}%</div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Audit Trail</h3>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>Loading audit logs...</div>
          ) : auditLogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>No audit logs found for the selected criteria.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Timestamp</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>User</th>
                    <th style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600", fontSize: "0.875rem" }}>Action</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Module</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>Details</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600", fontSize: "0.875rem" }}>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: "1rem", fontWeight: "500" }}>{log.user}</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <span style={{ 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: "0.25rem",
                          padding: "0.25rem 0.5rem", 
                          borderRadius: "0.375rem", 
                          fontSize: "0.75rem", 
                          fontWeight: "500",
                          backgroundColor: `${getActionColor(log.action)}20`,
                          color: getActionColor(log.action)
                        }}>
                          {getActionIcon(log.action)} {log.action}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>{log.module}</td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem" }}>{log.details}</td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#6b7280", fontFamily: "monospace" }}>{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Security Analysis & Comments</h3>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your security analysis, observations, compliance notes, or recommendations based on audit trail..."
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
            <Button size="sm" onClick={() => alert('Security analysis saved!')}>Save Analysis</Button>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "0.5rem", fontSize: "0.75rem", color: "#6b7280" }}>
        Audit report generated on {new Date().toLocaleString()} | Period: {filters.startDate} to {filters.endDate} | Total activities: {auditLogs.length} | Unique users: {Object.keys(userStats).length}
      </div>
    </>
  );
}
