import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const MedicalRecords = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Medical Records</CardTitle></CardHeader>
      <CardContent><p>Medical records management interface.</p></CardContent>
    </Card>
  </div>
);

export default MedicalRecords;