// /hospital/departments/DepartmentDetails.jsx

import React from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";
import Badge from "../../components/hospital/Badge";
import { useDepartments } from "../../hooks/useDepartments";

export default function DepartmentDetails() {
  const { id } = useParams();
  const { getDepartmentById } = useDepartments();
  const dept = getDepartmentById(id);

  if (!dept) return null;

  return (
    <>
      <PageHeader title="Department Details" />
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-lg mb-3">General Information</h3>
          <p><strong>Name:</strong> {dept.name}</p>
          <p><strong>Code:</strong> {dept.code}</p>
          <p><strong>Location:</strong> {dept.location}</p>
          <p><strong>Head:</strong> {dept.head || "Not Assigned"}</p>
          <Badge variant={dept.status === "Active" ? "success" : "danger"}>
            {dept.status}
          </Badge>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-3">Staff Statistics</h3>
          <p>Total Doctors: {dept.totalDoctors}</p>
          <p>Total Nurses: {dept.totalNurses}</p>
          <p>Total Staff: {dept.totalStaff}</p>
        </Card>

        <Card className="col-span-2">
          <h3 className="font-bold text-lg mb-3">Description</h3>
          <p>{dept.description}</p>
        </Card>
      </div>
    </>
  );
}
