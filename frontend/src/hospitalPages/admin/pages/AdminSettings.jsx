import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Button } from '../../../components/hospital/Button';
import { Badge } from '../../../components/hospital/Badge';
import { 
  Settings, 
  Hospital, 
  Users, 
  Shield, 
  Bell, 
  Database,
  Clock,
  Mail,
  Phone,
  MapPin,
  Save,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { useHospitalAuth } from '../../../context/HospitalAuthContext';
import hospitalService from '../../../services/hospitalService';
import CurrencySettings from '../../../components/CurrencySettings';

const AdminSettings = () => {
  const { hospital, admin } = useHospitalAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    // General Settings
    hospitalName: hospital?.name || '',
    hospitalAddress: hospital?.location || '',
    hospitalPhone: hospital?.phone || '',
    hospitalEmail: hospital?.email || '',
    
    // System Settings
    appointmentDuration: 30,
    workingHoursStart: '08:00',
    workingHoursEnd: '18:00',
    maxAppointmentsPerDay: 50,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    billingAlerts: true,
    
    // Security Settings
    sessionTimeout: 60,
    passwordExpiry: 90,
    twoFactorAuth: false,
    auditLogging: true
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const response = await hospitalService.updateHospitalSettings(settings);
      if (response.success) {
        setMessage('Settings updated successfully');
      }
    } catch (error) {
      setMessage('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Hospital },
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const renderCurrencySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Currency Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Select the currency to be used for all billing, invoices, and financial reports in your hospital.
          </p>
          <CurrencySettings 
            organizationId={hospital?.id}
            moduleType="hospital"
            onSave={() => setMessage('Currency settings updated successfully')}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hospital Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hospital Name</label>
              <input
                type="text"
                value={settings.hospitalName}
                onChange={(e) => setSettings({...settings, hospitalName: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={settings.hospitalPhone}
                onChange={(e) => setSettings({...settings, hospitalPhone: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              value={settings.hospitalEmail}
              onChange={(e) => setSettings({...settings, hospitalEmail: e.target.value})}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              value={settings.hospitalAddress}
              onChange={(e) => setSettings({...settings, hospitalAddress: e.target.value})}
              className="w-full p-2 border rounded-lg h-20"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Default Appointment Duration (minutes)</label>
              <input
                type="number"
                value={settings.appointmentDuration}
                onChange={(e) => setSettings({...settings, appointmentDuration: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Appointments Per Day</label>
              <input
                type="number"
                value={settings.maxAppointmentsPerDay}
                onChange={(e) => setSettings({...settings, maxAppointmentsPerDay: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                value={settings.workingHoursStart}
                onChange={(e) => setSettings({...settings, workingHoursStart: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                value={settings.workingHoursEnd}
                onChange={(e) => setSettings({...settings, workingHoursEnd: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive notifications via email</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">SMS Notifications</div>
              <div className="text-sm text-gray-500">Receive notifications via SMS</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Appointment Reminders</div>
              <div className="text-sm text-gray-500">Send reminders to patients</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appointmentReminders}
                onChange={(e) => setSettings({...settings, appointmentReminders: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Billing Alerts</div>
              <div className="text-sm text-gray-500">Alerts for billing activities</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.billingAlerts}
                onChange={(e) => setSettings({...settings, billingAlerts: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password Expiry (days)</label>
              <input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-gray-500">Enable 2FA for admin accounts</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Audit Logging</div>
              <div className="text-sm text-gray-500">Log all system activities</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auditLogging}
                onChange={(e) => setSettings({...settings, auditLogging: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'currency': return renderCurrencySettings();
      case 'system': return renderSystemSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hospital Settings</h1>
        <Badge variant="outline" className="text-sm">
          <Settings className="w-4 h-4 mr-1" />
          Administrator
        </Badge>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 ${
                        activeTab === tab.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderTabContent()}
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveSettings} disabled={loading}>
              <Save className="w-4 h-4 mr-1" />
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;