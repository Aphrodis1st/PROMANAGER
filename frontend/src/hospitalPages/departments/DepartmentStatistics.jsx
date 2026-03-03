// /hospital/departments/DepartmentStatistics.jsx

import React from "react";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import { useDepartments } from "../../hooks/useDepartments";

export default function DepartmentStatistics() {
  const { departments } = useDepartments();

  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(d => d.status === "Active").length;

  return (
    <>
      <PageHeader title="Department Statistics & Analytics" />
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <h3>Total Departments</h3>
          <p className="text-3xl font-bold">{totalDepartments}</p>
        </Card>

        <Card>
          <h3>Active Departments</h3>
          <p className="text-3xl font-bold text-green-600">
            {activeDepartments}
          </p>
        </Card>

        <Card>
          <h3>Inactive Departments</h3>
          <p className="text-3xl font-bold text-red-600">
            {totalDepartments - activeDepartments}
          </p>
        </Card>
      </div>
    </>
  );
}
