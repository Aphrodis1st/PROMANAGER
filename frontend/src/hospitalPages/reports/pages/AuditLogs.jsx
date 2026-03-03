import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/hospital/PageHeader";
import Card from "../../../components/hospital/card";
import DataTable from "../../../components/hospital/DataTable";
import Input from "../../../components/hospital/Input";
import Select from "../../../components/hospital/Select";
import { useReports } from "../../../hooks/useReports";

export default function AuditLogs() {
  const { auditLogs, loading, fetchAuditLogs } = useReports();
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    action: "",
    user: "",
  });

  useEffect(() => {
    fetchAuditLogs(filters);
  }, [filters]);

  const columns = [
    { key: "timestamp", label: "Timestamp" },
    { key: "user", label: "User" },
    { key: "action", label: "Action" },
    { key: "module", label: "Module" },
    { key: "details", label: "Details" },
    { key: "ipAddress", label: "IP Address" },
  ];

  return (
    <>
      <PageHeader title="Audit Logs" />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          <Input
            type="date"
            label="Start Date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            type="date"
            label="End Date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
          <Select
            label="Action"
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
          </Select>
          <Input
            label="User"
            value={filters.user}
            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            placeholder="Search by user"
          />
        </div>
      </Card>

      <Card>
        <h3>Activity Log</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable data={auditLogs || []} columns={columns} />
        )}
      </Card>
    </>
  );
}
