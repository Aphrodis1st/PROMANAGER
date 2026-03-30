import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const Prescriptions = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Prescriptions</CardTitle></CardHeader>
      <CardContent><p>Prescription management interface.</p></CardContent>
    </Card>
  </div>
);

export default Prescriptions;