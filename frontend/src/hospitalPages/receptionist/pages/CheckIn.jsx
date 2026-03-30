import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const CheckIn = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Patient Check-in</CardTitle></CardHeader>
      <CardContent><p>Patient check-in interface.</p></CardContent>
    </Card>
  </div>
);

export default CheckIn;