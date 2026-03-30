import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/hospital/card';
import { Button } from '../components/hospital/Button';
import { Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    const roleRoutes = {
      admin: '/hospital/dashboard',
      doctor: '/hospital/doctor/dashboard',
      nurse: '/hospital/nurse/dashboard',
      receptionist: '/hospital/receptionist/dashboard'
    };
    
    const defaultRoute = roleRoutes[user?.role] || '/hospital/dashboard';
    navigate(defaultRoute);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            You don't have permission to access this page. This could be due to:
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Insufficient role permissions</li>
            <li>• Department access restrictions</li>
            <li>• Page not available for your role</li>
          </ul>
          
          {user && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Current Role: <span className="font-medium capitalize">{user.role}</span>
              </p>
              {user.department && (
                <p className="text-sm text-gray-600">
                  Department: <span className="font-medium">{user.department.name}</span>
                </p>
              )}
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button 
              onClick={handleGoToDashboard}
              className="flex-1"
            >
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;