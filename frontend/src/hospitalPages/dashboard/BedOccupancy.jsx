import React from "react";
import Card from "../../components/hospital/card";

const BedOccupancy = () => {
  const wards = [
    { name: "ICU", total: 20, occupied: 18 },
    { name: "General", total: 100, occupied: 76 },
    { name: "Emergency", total: 30, occupied: 22 },
  ];

  return (
    <Card title="Bed Occupancy">
      <div className="space-y-4">
        {wards.map((ward) => {
          const percent = (ward.occupied / ward.total) * 100;
          return (
            <div key={ward.name}>
              <div className="flex justify-between text-sm font-medium">
                <span>{ward.name}</span>
                <span>{ward.occupied}/{ward.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded"
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

export default BedOccupancy;