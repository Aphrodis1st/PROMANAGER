import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/hospital/card';
import { Bell } from 'lucide-react';

const Notifications = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent><p>Notifications management interface.</p></CardContent>
    </Card>
  </div>
);

export default Notifications;