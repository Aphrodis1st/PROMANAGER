import React from "react";
import PageHeader from "../../components/hospital/PageHeader";
import Card from "../../components/hospital/card";

export default function DoctorSchedule() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <>
      <PageHeader title="Doctor Weekly Schedule" />

      <Card>
        <div className="grid grid-cols-5 gap-4">
          {days.map((day) => (
            <div key={day} className="border rounded-xl p-4">
              <h4 className="font-semibold mb-2">{day}</h4>
              <p>09:00 AM - 01:00 PM</p>
              <p>02:00 PM - 05:00 PM</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}