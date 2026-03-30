import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { Badge } from '../../../components/hospital/Badge';
import { User, Mail, Phone, MapPin, Calendar, Shield, Key, Edit3, Save, X } from 'lucide-react';
import { useHospitalAuth } from '../../../context/HospitalAuthContext';
import hospitalService from '../../../services/hospitalService';

const AdminProfile = () => {
  const { admin, hospital, login } = useHospitalAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    firstName: admin?.firstName || '',
    lastName: admin?.lastName || '',
    email: admin?.email || '',
    phone: admin?.phone || '',
    position: admin?.position || 'Hospital Administrator'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const response = await hospitalService.updateAdminProfile(profileData);
      if (response.success) {
        // Update context with new admin data
        login({ 
          token: localStorage.getItem('hospitalToken'),
          admin: { ...admin, ...profileData },
          hospital 
        });
        setMessage('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await hospitalService.changeAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response.success) {
        setMessage('Password changed successfully');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setMessage('Failed to change password. Check current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Profile</h1>
        <Badge variant="outline" className="text-sm">
          <Shield className="w-4 h-4 mr-1" />
          Hospital Administrator
        </Badge>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      {profileData.firstName || 'Not set'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      {profileData.lastName || 'Not set'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  {profileData.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                ) : (
                  <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {profileData.phone || 'Not set'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <Shield className="w-4 h-4 mr-2 text-gray-500" />
                  {profileData.position}
                </div>
              </div>

              {isEditing && (
                <Button onClick={handleProfileUpdate} disabled={loading} className="w-full">
                  <Save className="w-4 h-4 mr-1" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hospital & Security */}
        <div className="space-y-6">
          {/* Hospital Info */}
          <Card>
            <CardHeader>
              <CardTitle>Hospital Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                <div>
                  <div className="font-medium">{hospital?.name}</div>
                  <div className="text-sm text-gray-500">{hospital?.location}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <div className="text-sm">
                  Plan: <span className="font-medium capitalize">{hospital?.subscriptionPlan || 'Basic'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowPasswordModal(true)}
                variant="outline" 
                className="w-full"
              >
                <Key className="w-4 h-4 mr-1" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={handlePasswordChange} disabled={loading} className="flex-1">
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;