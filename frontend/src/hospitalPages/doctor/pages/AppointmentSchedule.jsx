import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const AppointmentSchedule = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Appointment Schedule</CardTitle></CardHeader>
      <CardContent><p>Appointment scheduling interface.</p></CardContent>
    </Card>
  </div>
);

export default AppointmentSchedule;