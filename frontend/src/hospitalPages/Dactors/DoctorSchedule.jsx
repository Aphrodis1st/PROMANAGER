import React from "react";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";

export default function DoctorSchedule() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <>
      <PageHeader title="Doctor Weekly Schedule" />

      <Card>
        <div className="grid grid-cols-5 gap-4">
          {days.map((day) => (
            <div key={day} className="border rounded-xl p-4">
              <h4 className="font-semibold">{day}</h4>
              <p>09:00 - 13:00</p>
              <p>14:00 - 17:00</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
