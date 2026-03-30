import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { BarChart3 } from 'lucide-react';

const Reports = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Reports
        </CardTitle>
      </CardHeader>
      <CardContent><p>Reports and analytics interface.</p></CardContent>
    </Card>
  </div>
);

export default Reports;