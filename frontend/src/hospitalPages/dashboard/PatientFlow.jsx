import React from "react";
import Card from "../../components/hospital/card";

const PatientFlow = () => {
  const data = [
    { name: "Admitted", value: 120, color: "bg-blue-600" },
    { name: "Discharged", value: 80, color: "bg-green-600" },
    { name: "Waiting", value: 35, color: "bg-yellow-600" },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card title="Patient Flow">
      <div className="space-y-4">
        {data.map((item) => {
          const percent = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.name}>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>{item.name}</span>
                <span>{item.value} ({percent}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className={`${item.color} h-3 rounded`}
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

export default PatientFlow;