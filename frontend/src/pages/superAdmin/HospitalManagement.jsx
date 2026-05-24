import React, { useState } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import {
  useGetSuperAdminHospitalsQuery,
  useCreateSuperAdminHospitalMutation,
  useUpdateSuperAdminHospitalStatusMutation,
  useUpdateSuperAdminHospitalFeaturesMutation,
  useSoftDeleteSuperAdminHospitalMutation,
  useDeleteSuperAdminHospitalMutation,
  getSuperAdminErrorMessage,
} from '../../store/actions/superAdmin.js';

const HospitalManagement = () => {
  const { data: hospitals = [], isLoading: loading } = useGetSuperAdminHospitalsQuery();
  const [createHospital] = useCreateSuperAdminHospitalMutation();
  const [updateHospitalStatus] = useUpdateSuperAdminHospitalStatusMutation();
  const [updateHospitalFeatures] = useUpdateSuperAdminHospitalFeaturesMutation();
  const [softDeleteHospital] = useSoftDeleteSuperAdminHospitalMutation();
  const [deleteHospital] = useDeleteSuperAdminHospitalMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  const [newHospital, setNewHospital] = useState({
    name: '',
    location: '',
    contactInfo: { phone: '', email: '' },
    subscriptionPlan: 'basic',
    featuresEnabled: []
  });

  const availableFeatures = [
    { id: 'patients', name: 'Patient Management', category: 'Core' },
    { id: 'appointments', name: 'Appointments', category: 'Core' },
    { id: 'doctors', name: 'Doctor Management', category: 'Core' },
    { id: 'billing', name: 'Billing & Invoicing', category: 'Financial' },
    { id: 'insurance', name: 'Insurance Claims', category: 'Financial' },
    { id: 'revenue_reports', name: 'Revenue Reports', category: 'Financial' },
    { id: 'lab', name: 'Laboratory', category: 'Clinical' },
    { id: 'lab_orders', name: 'Lab Orders', category: 'Clinical' },
    { id: 'lab_results', name: 'Lab Results', category: 'Clinical' },
    { id: 'medical_records', name: 'Medical Records', category: 'Clinical' },
    { id: 'vital_signs', name: 'Vital Signs', category: 'Clinical' },
    { id: 'prescriptions', name: 'Prescriptions', category: 'Clinical' },
    { id: 'diagnosis', name: 'Diagnosis Entry', category: 'Clinical' },
    { id: 'surgery_records', name: 'Surgery Records', category: 'Clinical' },
    { id: 'treatment_plans', name: 'Treatment Plans', category: 'Clinical' },
    { id: 'admissions', name: 'Patient Admissions', category: 'Operations' },
    { id: 'discharge', name: 'Patient Discharge', category: 'Operations' },
    { id: 'transfer', name: 'Patient Transfer', category: 'Operations' },
    { id: 'wards', name: 'Ward Management', category: 'Operations' },
    { id: 'bed_allocation', name: 'Bed Allocation', category: 'Operations' },
    { id: 'icu', name: 'ICU Management', category: 'Operations' },
    { id: 'departments', name: 'Department Management', category: 'Administration' },
    { id: 'staff', name: 'Staff Management', category: 'Administration' },
    { id: 'user_management', name: 'User Management', category: 'Administration' },
    { id: 'sub_admins', name: 'Sub-Admin Management', category: 'Administration' },
    { id: 'access_control', name: 'Access Control', category: 'Administration' },
    { id: 'reports', name: 'Reports Dashboard', category: 'Analytics' },
    { id: 'patient_reports', name: 'Patient Reports', category: 'Analytics' },
    { id: 'financial_reports', name: 'Financial Reports', category: 'Analytics' },
    { id: 'department_reports', name: 'Department Reports', category: 'Analytics' },
    { id: 'audit_logs', name: 'Audit Logs', category: 'Analytics' },
    { id: 'analytics', name: 'Analytics Dashboard', category: 'Analytics' },
    { id: 'system_settings', name: 'System Settings', category: 'Settings' },
    { id: 'appointment_calendar', name: 'Appointment Calendar', category: 'Core' },
    { id: 'queue_management', name: 'Queue Management', category: 'Operations' },
    { id: 'receptionist', name: 'Receptionist Module', category: 'Operations' },
    { id: 'nurse', name: 'Nurse Module', category: 'Operations' },
    { id: 'doctor_portal', name: 'Doctor Portal', category: 'Core' },
    { id: 'hr_employees', name: 'Employee Management', category: 'HR' },
    { id: 'hr_departments', name: 'Department Management', category: 'HR' },
    { id: 'hr_payroll', name: 'Payroll Management', category: 'HR' },
    { id: 'hr_attendance', name: 'Attendance Tracking', category: 'HR' },
    { id: 'hr_leave', name: 'Leave Management', category: 'HR' },
    { id: 'hr_performance', name: 'Performance Reviews', category: 'HR' },
    { id: 'hr_contracts', name: 'Contract Management', category: 'HR' },
    { id: 'hr_settings', name: 'HR Settings', category: 'HR' }
  ];

  const subscriptionPlans = [
    { value: 'basic', label: 'Basic', color: 'bg-gray-100 text-gray-800' },
    { value: 'premium', label: 'Premium', color: 'bg-blue-100 text-blue-800' },
    { value: 'enterprise', label: 'Enterprise', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleCreateHospital = async (e) => {
    e.preventDefault();
    try {
      await createHospital(newHospital).unwrap();
      setShowCreateModal(false);
      setNewHospital({
        name: '',
        location: '',
        contactInfo: { phone: '', email: '' },
        subscriptionPlan: 'basic',
        featuresEnabled: []
      });
    } catch (error) {
      console.error('Error creating hospital:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleStatusChange = async (hospitalId, newStatus) => {
    try {
      await updateHospitalStatus({ id: hospitalId, status: newStatus }).unwrap();
    } catch (error) {
      console.error('Error updating hospital status:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleUpdateFeatures = async (hospitalId, features) => {
    try {
      await updateHospitalFeatures({ id: hospitalId, features }).unwrap();
      setShowFeaturesModal(false);
    } catch (error) {
      console.error('Error updating hospital features:', getSuperAdminErrorMessage(error, 'Unknown error'));
    }
  };

  const handleSoftDelete = async (hospitalId) => {
    if (window.confirm('Are you sure you want to soft delete this hospital? It can be recovered later.')) {
      try {
        await softDeleteHospital(hospitalId).unwrap();
      } catch (error) {
        console.error('Error soft deleting hospital:', getSuperAdminErrorMessage(error, 'Unknown error'));
      }
    }
  };

  const handleHardDelete = async (hospitalId) => {
    if (window.confirm('Are you sure you want to permanently delete this hospital? This action cannot be undone.')) {
      try {
        await deleteHospital(hospitalId).unwrap();
      } catch (error) {
        console.error('Error hard deleting hospital:', getSuperAdminErrorMessage(error, 'Unknown error'));
      }
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hospital Management</h1>
            <p className="text-gray-600 mt-1">Manage all hospitals in the system</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Hospital</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{hospital.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{hospital.location}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    hospital.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {hospital.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Contact:</p>
                    <p className="text-sm font-medium">{hospital.contactInfo?.email}</p>
                    <p className="text-sm font-medium">{hospital.contactInfo?.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Subscription:</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      subscriptionPlans.find(p => p.value === hospital.subscriptionPlan)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {hospital.subscriptionPlan}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Features ({hospital.featuresEnabled?.length || 0}):</p>
                    <div className="flex flex-wrap gap-1">
                      {hospital.featuresEnabled?.slice(0, 3).map((featureId) => {
                        const feature = availableFeatures.find(f => f.id === featureId);
                        return (
                          <span key={featureId} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {feature?.name || featureId}
                          </span>
                        );
                      })}
                      {hospital.featuresEnabled?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{hospital.featuresEnabled.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(
                      hospital.id, 
                      hospital.status === 'active' ? 'suspended' : 'active'
                    )}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      hospital.status === 'active' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {hospital.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedHospital(hospital);
                      setShowFeaturesModal(true);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium"
                  >
                    Features
                  </button>
                  
                  <button
                    onClick={() => handleSoftDelete(hospital.id)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded text-xs font-medium"
                  >
                    Soft Delete
                  </button>
                  
                  <button
                    onClick={() => handleHardDelete(hospital.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hospitals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 font-bold text-blue-600">H</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No hospitals found</h3>
            <p className="text-gray-600">Create your first hospital to get started</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Hospital</h2>
            <form onSubmit={handleCreateHospital} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                <input
                  type="text"
                  required
                  value={newHospital.name}
                  onChange={(e) => setNewHospital({...newHospital, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newHospital.location}
                  onChange={(e) => setNewHospital({...newHospital, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newHospital.contactInfo.email}
                  onChange={(e) => setNewHospital({
                    ...newHospital, 
                    contactInfo: {...newHospital.contactInfo, email: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={newHospital.contactInfo.phone}
                  onChange={(e) => setNewHospital({
                    ...newHospital, 
                    contactInfo: {...newHospital.contactInfo, phone: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select
                  value={newHospital.subscriptionPlan}
                  onChange={(e) => setNewHospital({...newHospital, subscriptionPlan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {subscriptionPlans.map(plan => (
                    <option key={plan.value} value={plan.value}>{plan.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFeaturesModal && selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 my-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Manage Features</h2>
                <p className="text-gray-600 mt-1">{selectedHospital.name}</p>
              </div>
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedHospital.featuresEnabled?.length || 0} of {availableFeatures.length} features enabled
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedHospital({
                    ...selectedHospital,
                    featuresEnabled: availableFeatures.map(f => f.id)
                  })}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedHospital({
                    ...selectedHospital,
                    featuresEnabled: []
                  })}
                  className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {['Core', 'Clinical', 'Financial', 'Operations', 'Administration', 'Analytics', 'HR', 'Settings'].map(category => {
                const categoryFeatures = availableFeatures.filter(f => f.category === category);
                if (categoryFeatures.length === 0) return null;
                
                return (
                  <div key={category} className="mb-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-2 px-2 py-1 bg-gray-100 rounded">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {categoryFeatures.map((feature) => (
                        <label key={feature.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedHospital.featuresEnabled?.includes(feature.id) || false}
                            onChange={(e) => {
                              const updatedFeatures = e.target.checked
                                ? [...(selectedHospital.featuresEnabled || []), feature.id]
                                : (selectedHospital.featuresEnabled || []).filter(f => f !== feature.id);
                              setSelectedHospital({...selectedHospital, featuresEnabled: updatedFeatures});
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {feature.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex space-x-3 pt-4 border-t mt-4">
              <button
                onClick={() => setShowFeaturesModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateFeatures(selectedHospital.id, selectedHospital.featuresEnabled)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Features
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default HospitalManagement;