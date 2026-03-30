import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { Input } from '../../../components/hospital/Input';
import { Checkbox } from '../../../components/hospital/Checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/hospital/Dialog';
import { Label } from '../../../components/hospital/Label';
import { Plus, Shield, UserPlus } from 'lucide-react';
import { hospitalAdminService } from '../../../services/hospitalAdmin.service';

const SubAdminManagement = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSubAdmin, setNewSubAdmin] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    permissions: {
      userManagement: false,
      departmentManagement: false,
      staffManagement: false,
      patientManagement: false,
      appointmentManagement: false,
      billingManagement: false,
      reportAccess: false
    }
  });

  const permissionLabels = {
    userManagement: 'User Management',
    departmentManagement: 'Department Management',
    staffManagement: 'Staff Management',
    patientManagement: 'Patient Management',
    appointmentManagement: 'Appointment Management',
    billingManagement: 'Billing Management',
    reportAccess: 'Report Access'
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      const response = await hospitalAdminService.getUserManagement();
      const subAdminUsers = response.data.filter(user => user.role === 'hospital_sub_admin');
      setSubAdmins(subAdminUsers);
    } catch (error) {
      console.error('Error fetching sub admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubAdmin = async (e) => {
    e.preventDefault();
    try {
      await hospitalAdminService.createSubAdmin(newSubAdmin);
      setIsCreateDialogOpen(false);
      setNewSubAdmin({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        permissions: {
          userManagement: false,
          departmentManagement: false,
          staffManagement: false,
          patientManagement: false,
          appointmentManagement: false,
          billingManagement: false,
          reportAccess: false
        }
      });
      fetchSubAdmins();
    } catch (error) {
      console.error('Error creating sub admin:', error);
    }
  };

  const handlePermissionChange = (permission, checked) => {
    setNewSubAdmin({
      ...newSubAdmin,
      permissions: {
        ...newSubAdmin.permissions,
        [permission]: checked
      }
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sub Admin Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Sub Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Sub Admin</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubAdmin} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newSubAdmin.firstName}
                    onChange={(e) => setNewSubAdmin({...newSubAdmin, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newSubAdmin.lastName}
                    onChange={(e) => setNewSubAdmin({...newSubAdmin, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSubAdmin.email}
                  onChange={(e) => setNewSubAdmin({...newSubAdmin, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newSubAdmin.password}
                  onChange={(e) => setNewSubAdmin({...newSubAdmin, password: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label className="text-base font-medium">Permissions</Label>
                <div className="mt-2 space-y-3">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={newSubAdmin.permissions[key]}
                        onCheckedChange={(checked) => handlePermissionChange(key, checked)}
                      />
                      <Label htmlFor={key} className="text-sm font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full">Create Sub Admin</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sub Admins List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subAdmins.map(subAdmin => (
          <Card key={subAdmin.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">
                    {subAdmin.firstName} {subAdmin.lastName}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">{subAdmin.email}</div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Permissions:</div>
                  <div className="space-y-1">
                    {Object.entries(subAdmin.permissions || {}).map(([key, value]) => (
                      value && (
                        <div key={key} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {permissionLabels[key]}
                        </div>
                      )
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Created: {new Date(subAdmin.createdAt?.seconds * 1000).toLocaleDateString()}
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Permissions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subAdmins.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sub admins found</h3>
            <p className="text-gray-500 mb-4">Create sub admins to help manage your hospital operations.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sub Admin
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Sub Admin Role Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-700 space-y-2">
            <p>• Sub admins can only access your hospital's data</p>
            <p>• They cannot create other hospitals or access other hospitals</p>
            <p>• Permissions can be customized based on their responsibilities</p>
            <p>• Sub admins report to the main hospital administrator</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubAdminManagement;