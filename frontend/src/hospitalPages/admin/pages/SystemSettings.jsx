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
  Globe,
  Lock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useHospitalAuth } from '../../../context/HospitalAuthContext';
import hospitalService from '../../../services/hospitalService';

const SystemSettings = () => {
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
    timezone: 'UTC+0',
    language: 'en',
    currency: 'USD',
    
    // System Configuration
    appointmentDuration: 30,
    workingHoursStart: '08:00',
    workingHoursEnd: '18:00',
    maxAppointmentsPerDay: 50,
    autoBackup: true,
    maintenanceMode: false,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    billingAlerts: true,
    systemAlerts: true,
    
    // Security Settings
    sessionTimeout: 60,
    passwordExpiry: 90,
    twoFactorAuth: false,
    auditLogging: true,
    loginAttempts: 5,
    
    // Integration Settings
    labIntegration: false,
    pharmacyIntegration: false,
    insuranceIntegration: false,
    paymentGateway: 'stripe'
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const response = await hospitalService.updateHospitalSettings(settings);
      if (response.success) {
        setMessage('Settings updated successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Failed to update settings');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Hospital, color: 'bg-blue-50 text-blue-600' },
    { id: 'system', label: 'System', icon: Settings, color: 'bg-green-50 text-green-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-yellow-50 text-yellow-600' },
    { id: 'security', label: 'Security', icon: Shield, color: 'bg-red-50 text-red-600' },
    { id: 'integrations', label: 'Integrations', icon: Globe, color: 'bg-purple-50 text-purple-600' }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Hospital className="h-5 w-5" />
            Hospital Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Name</label>
              <input
                type="text"
                value={settings.hospitalName}
                onChange={(e) => setSettings({...settings, hospitalName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter hospital name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={settings.hospitalPhone}
                onChange={(e) => setSettings({...settings, hospitalPhone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={settings.hospitalEmail}
                onChange={(e) => setSettings({...settings, hospitalEmail: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="UTC+0">UTC+0 (GMT)</option>
                <option value="UTC-5">UTC-5 (EST)</option>
                <option value="UTC-8">UTC-8 (PST)</option>
                <option value="UTC+1">UTC+1 (CET)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <textarea
              value={settings.hospitalAddress}
              onChange={(e) => setSettings({...settings, hospitalAddress: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24"
              placeholder="Enter hospital address"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Clock className="h-5 w-5" />
            Appointment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Default Duration (minutes)</label>
              <input
                type="number"
                value={settings.appointmentDuration}
                onChange={(e) => setSettings({...settings, appointmentDuration: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                min="15"
                max="120"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={settings.workingHoursStart}
                onChange={(e) => setSettings({...settings, workingHoursStart: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={settings.workingHoursEnd}
                onChange={(e) => setSettings({...settings, workingHoursEnd: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Database className="h-5 w-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-800">Auto Backup</div>
              <div className="text-sm text-gray-600">Automatically backup system data daily</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <div className="font-semibold text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Maintenance Mode
              </div>
              <div className="text-sm text-red-600">Temporarily disable system access for maintenance</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS', icon: Phone },
            { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Send reminders to patients', icon: Clock },
            { key: 'billingAlerts', label: 'Billing Alerts', desc: 'Alerts for billing activities', icon: AlertTriangle },
            { key: 'systemAlerts', label: 'System Alerts', desc: 'Critical system notifications', icon: Shield }
          ].map(({ key, label, desc, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-semibold text-gray-800">{label}</div>
                  <div className="text-sm text-gray-600">{desc}</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => setSettings({...settings, [key]: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Shield className="h-5 w-5" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                min="15"
                max="480"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password Expiry (days)</label>
              <input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                min="30"
                max="365"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-semibold text-gray-800">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-600">Enable 2FA for admin accounts</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-semibold text-gray-800">Audit Logging</div>
                  <div className="text-sm text-gray-600">Log all system activities</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auditLogging}
                  onChange={(e) => setSettings({...settings, auditLogging: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Globe className="h-5 w-5" />
            External Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {[
            { key: 'labIntegration', label: 'Laboratory Integration', desc: 'Connect with external lab systems' },
            { key: 'pharmacyIntegration', label: 'Pharmacy Integration', desc: 'Connect with pharmacy systems' },
            { key: 'insuranceIntegration', label: 'Insurance Integration', desc: 'Connect with insurance providers' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-semibold text-gray-800">{label}</div>
                <div className="text-sm text-gray-600">{desc}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={settings[key] ? 'default' : 'secondary'}>
                  {settings[key] ? 'Connected' : 'Disconnected'}
                </Badge>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={(e) => setSettings({...settings, [key]: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'system': return renderSystemSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'integrations': return renderIntegrationSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-1">Configure your hospital management system</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm px-3 py-1">
              <Settings className="w-4 h-4 mr-1" />
              Administrator
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1 bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="w-4 h-4 mr-1" />
              System Online
            </Badge>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-lg border ${message.includes('success') 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.includes('success') ? 
                <CheckCircle className="h-5 w-5" /> : 
                <AlertTriangle className="h-5 w-5" />
              }
              {message}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === tab.id 
                            ? `${tab.color} border-r-4 border-current font-semibold` 
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
            
            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleSaveSettings} 
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;