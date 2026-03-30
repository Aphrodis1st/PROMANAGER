import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const NursingNotes = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Nursing Notes</CardTitle></CardHeader>
      <CardContent><p>Nursing notes documentation interface.</p></CardContent>
    </Card>
  </div>
);

export default NursingNotes;