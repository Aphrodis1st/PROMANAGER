import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { Badge } from '../../../components/hospital/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/hospital/Dialog';
import { Label } from '../../../components/hospital/Label';
import { UserCheck, Building2, Edit, Users } from 'lucide-react';
import { hospitalAdminService } from '../../../services/hospitalAdmin.service';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [staffResponse, deptResponse] = await Promise.all([
        hospitalAdminService.getStaffManagement(),
        hospitalAdminService.getDepartmentManagement()
      ]);
      setStaff(staffResponse.data);
      setDepartments(deptResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToDepartment = async () => {
    if (!selectedStaff || !selectedDepartment) return;
    
    try {
      await hospitalAdminService.assignStaffToDepartment(selectedStaff.id, {
        departmentId: selectedDepartment
      });
      setIsAssignDialogOpen(false);
      setSelectedStaff(null);
      setSelectedDepartment('');
      fetchData();
    } catch (error) {
      console.error('Error assigning staff:', error);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      doctor: 'bg-blue-100 text-blue-800',
      nurse: 'bg-green-100 text-green-800',
      lab_technician: 'bg-purple-100 text-purple-800',
      pharmacist: 'bg-orange-100 text-orange-800',
      receptionist: 'bg-pink-100 text-pink-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const groupStaffByDepartment = () => {
    const grouped = {
      unassigned: staff.filter(s => !s.department)
    };
    
    departments.forEach(dept => {
      grouped[dept.id] = staff.filter(s => s.department?.id === dept.id);
    });
    
    return grouped;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const groupedStaff = groupStaffByDepartment();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Total Staff: {staff.length}
          </Badge>
        </div>
      </div>

      {/* Unassigned Staff */}
      {groupedStaff.unassigned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Unassigned Staff ({groupedStaff.unassigned.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedStaff.unassigned.map(member => (
                <div key={member.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {member.role.replace('_', ' ')}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedStaff(member);
                        setIsAssignDialogOpen(true);
                      }}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff by Department */}
      {departments.map(department => (
        <Card key={department.id}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>{department.name} ({groupedStaff[department.id]?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {groupedStaff[department.id]?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedStaff[department.id].map(member => (
                  <div key={member.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role.replace('_', ' ')}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedStaff(member);
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No staff assigned to this department
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Staff to Department</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">
                  {selectedStaff.firstName} {selectedStaff.lastName}
                </div>
                <div className="text-sm text-gray-500">{selectedStaff.email}</div>
                <Badge className={getRoleBadgeColor(selectedStaff.role)} size="sm">
                  {selectedStaff.role.replace('_', ' ')}
                </Badge>
              </div>
              
              <div>
                <Label htmlFor="department">Select Department</Label>
                <select 
                  value={selectedDepartment} 
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleAssignToDepartment}
                  className="flex-1"
                >
                  Assign
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAssignDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;