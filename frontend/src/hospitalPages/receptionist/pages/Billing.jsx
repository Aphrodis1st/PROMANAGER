import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';

const Billing = () => (
  <div className="p-6">
    <Card>
      <CardHeader><CardTitle>Billing</CardTitle></CardHeader>
      <CardContent><p>Billing management interface.</p></CardContent>
    </Card>
  </div>
);

export default Billing;