import React from "react";
import { useDepartments } from "../../hooks/useDepartments";
import Card from "../../components/hospital/card";

const DepartmentStatistics = () => {
  const { departments } = useDepartments();

  const data = departments?.map((dep) => ({
    name: dep.name,
    patients: dep.patientCount || 0,
  })) || [];

  const maxPatients = Math.max(...data.map(d => d.patients), 1);

  return (
    <Card title="Department Statistics">
      <div className="space-y-4">
        {data.map((dept) => {
          const percent = (dept.patients / maxPatients) * 100;
          return (
            <div key={dept.name}>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>{dept.name}</span>
                <span>{dept.patients} patients</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className="bg-blue-600 h-3 rounded"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DepartmentStatistics;