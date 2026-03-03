// /hospital/departments/DepartmentList.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import DataTable from "../../components/hospital/DataTable";
import Badge from "../../components/hospital/Badge";
import Button from "../../components/hospital/Button";
import { useDepartments } from "../../hooks/useDepartments";

export default function DepartmentList() {
  const { departments } = useDepartments();
  const navigate = useNavigate();

  const columns = [
    { key: "name", label: "Department Name" },
    { key: "code", label: "Code" },
    { key: "location", label: "Location" },
    { key: "head", label: "Head of Department" },
    { key: "totalDoctors", label: "Doctors" },
    { key: "totalNurses", label: "Nurses" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate(`${row.id}`)}>
            View
          </Button>
          <Button size="sm" onClick={() => navigate(`assign-head/${row.id}`)}>
            Assign Head
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Department Management"
        action={
          <Button onClick={() => navigate("create")}>
            Create Department
          </Button>
        }
      />
      <Card>
        <DataTable
          columns={columns}
          data={departments}
          searchable
          sortable
          pagination
        />
      </Card>
    </>
  );
}
