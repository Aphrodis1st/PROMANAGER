import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Shield } from 'lucide-react';

const AuditLogs = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent><p>System audit logs interface.</p></CardContent>
    </Card>
  </div>
);

export default AuditLogs;