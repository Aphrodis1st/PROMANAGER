import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { Badge } from '../../../components/hospital/Badge';
import { Checkbox } from '../../../components/hospital/Checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/hospital/Dialog';
import { Label } from '../../../components/hospital/Label';
import { Input } from '../../../components/hospital/Input';
import { Shield, Edit, Search, Lock, Unlock } from 'lucide-react';
import { hospitalAdminService } from '../../../services/hospitalAdmin.service';

const AccessControl = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [permissions, setPermissions] = useState({});

  const roles = [
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'lab_technician', label: 'Lab Technician' },
    { value: 'pharmacist', label: 'Pharmacist' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'hospital_sub_admin', label: 'Sub Admin' }
  ];

  const permissionCategories = {
    'Patient Management': {
      viewPatients: 'View Patients',
      createPatients: 'Create Patients',
      editPatients: 'Edit Patients',
      deletePatients: 'Delete Patients'
    },
    'Medical Records': {
      viewMedicalRecords: 'View Medical Records',
      createMedicalRecords: 'Create Medical Records',
      editMedicalRecords: 'Edit Medical Records',
      deleteMedicalRecords: 'Delete Medical Records'
    },
    'Appointments': {
      viewAppointments: 'View Appointments',
      createAppointments: 'Create Appointments',
      editAppointments: 'Edit Appointments',
      cancelAppointments: 'Cancel Appointments'
    },
    'Laboratory': {
      viewLabResults: 'View Lab Results',
      createLabOrders: 'Create Lab Orders',
      enterLabResults: 'Enter Lab Results',
      approveLabResults: 'Approve Lab Results'
    },
    'Billing': {
      viewBilling: 'View Billing',
      createInvoices: 'Create Invoices',
      processPayments: 'Process Payments',
      viewReports: 'View Financial Reports'
    },
    'Administration': {
      manageUsers: 'Manage Users',
      manageDepartments: 'Manage Departments',
      viewAuditLogs: 'View Audit Logs',
      systemSettings: 'System Settings'
    }
  };

  useEffect(() => {
    fetchAccessControl();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchAccessControl = async () => {
    try {
      const response = await hospitalAdminService.getAccessControl();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching access control:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleEditPermissions = (user) => {
    setSelectedUser(user);
    setPermissions(user.permissions || {});
    setIsPermissionDialogOpen(true);
  };

  const handlePermissionChange = (category, permission, checked) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: checked
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;

    try {
      await hospitalAdminService.updatePermissions(selectedUser.id, { permissions });
      setIsPermissionDialogOpen(false);
      setSelectedUser(null);
      setPermissions({});
      fetchAccessControl();
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      doctor: 'bg-blue-100 text-blue-800',
      nurse: 'bg-green-100 text-green-800',
      lab_technician: 'bg-purple-100 text-purple-800',
      pharmacist: 'bg-orange-100 text-orange-800',
      receptionist: 'bg-pink-100 text-pink-800',
      hospital_sub_admin: 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getPermissionCount = (userPermissions) => {
    if (!userPermissions) return 0;
    return Object.values(userPermissions).filter(Boolean).length;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Access Control</h1>
        <Badge variant="outline" className="text-sm">
          <Shield className="h-4 w-4 mr-1" />
          Permission Management
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Access Control List */}
      <Card>
        <CardHeader>
          <CardTitle>User Permissions ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">
                      {getPermissionCount(user.permissions)} permissions assigned
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role.replace('_', ' ')}
                  </Badge>
                  
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? (
                      <>
                        <Unlock className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditPermissions(user)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Permissions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Edit Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Permissions - {selectedUser?.firstName} {selectedUser?.lastName}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</div>
                    <div className="text-sm text-gray-500">{selectedUser.email}</div>
                  </div>
                  <Badge className={getRoleBadgeColor(selectedUser.role)}>
                    {selectedUser.role.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-medium text-lg border-b pb-2">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(categoryPermissions).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={permissions[key] || false}
                          onCheckedChange={(checked) => handlePermissionChange(category, key, checked)}
                        />
                        <Label htmlFor={key} className="text-sm font-normal">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex space-x-2 pt-4 border-t">
                <Button onClick={handleSavePermissions} className="flex-1">
                  Save Permissions
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsPermissionDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Access Control Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-700 space-y-2 text-sm">
              <p>• Only assign necessary permissions to users</p>
              <p>• Regularly review and update user permissions</p>
              <p>• Hospital admins have full access by default</p>
              <p>• Sub admins can be given specific permissions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Security Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-700 space-y-2 text-sm">
              <p>• Use role-based access control</p>
              <p>• Implement principle of least privilege</p>
              <p>• Monitor user activity regularly</p>
              <p>• Deactivate accounts when staff leaves</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccessControl;