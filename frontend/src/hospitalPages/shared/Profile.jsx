import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/hospital/card';
import { User } from 'lucide-react';

const Profile = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent><p>User profile management interface.</p></CardContent>
    </Card>
  </div>
);

export default Profile;