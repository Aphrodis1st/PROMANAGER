import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const LabResults = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Lab Results</CardTitle></CardHeader>
      <CardContent><p>Lab results viewing interface.</p></CardContent>
    </Card>
  </div>
);

export default LabResults;