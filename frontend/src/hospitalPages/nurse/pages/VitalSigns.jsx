import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const VitalSigns = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Vital Signs</CardTitle></CardHeader>
      <CardContent><p>Vital signs monitoring interface.</p></CardContent>
    </Card>
  </div>
);

export default VitalSigns;