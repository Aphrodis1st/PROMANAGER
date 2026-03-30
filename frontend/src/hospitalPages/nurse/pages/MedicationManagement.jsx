import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const MedicationManagement = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Medication Management</CardTitle></CardHeader>
      <CardContent><p>Medication administration interface.</p></CardContent>
    </Card>
  </div>
);

export default MedicationManagement;