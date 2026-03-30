import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Settings } from 'lucide-react';

const SystemSettings = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Settings
        </CardTitle>
      </CardHeader>
      <CardContent><p>System settings configuration interface.</p></CardContent>
    </Card>
  </div>
);

export default SystemSettings;