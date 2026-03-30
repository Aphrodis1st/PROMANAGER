import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const PatientRegistration = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Patient Registration</CardTitle></CardHeader>
      <CardContent><p>Patient registration interface.</p></CardContent>
    </Card>
  </div>
);

export default PatientRegistration;