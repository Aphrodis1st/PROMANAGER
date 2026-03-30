import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const PatientCare = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Patient Care</CardTitle></CardHeader>
      <CardContent><p>Patient care management interface.</p></CardContent>
    </Card>
  </div>
);

export default PatientCare;