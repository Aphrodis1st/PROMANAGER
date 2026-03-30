import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuperAdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the main auth endpoint instead of stock auth
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', credentials);
      
      console.log('Login response:', response.data);
      
      // Check if login was successful and user has super_admin role
      if (response.data && response.data.user && response.data.token) {
        const user = response.data.user;
        console.log('User role:', user.role);
        
        if (user.role === 'super_admin') {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/super-admin/dashboard');
        } else {
          setError(`Access denied. Your role is '${user.role}' but Super Admin role required.`);
        }
      } else {
        setError('Invalid response from server.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-4xl font-bold text-blue-600">H</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Super Admin</h1>
          <p className="text-blue-200">Hospital Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Administrator Access</h2>
            <p className="text-gray-600 mt-2">Sign in to manage hospitals</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">!</span>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="superadmin@promanager.com"
                />
                <span className="absolute right-3 top-3 text-gray-400">@</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <span className="absolute right-3 top-3 text-gray-400">*</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In as Super Admin'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <span className="text-yellow-500 mr-2 mt-0.5">!</span>
              <div>
                <p className="text-yellow-800 text-sm font-medium">Security Notice</p>
                <p className="text-yellow-700 text-xs mt-1">
                  This is a restricted area. All activities are logged and monitored.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            © 2024 PROMANAGER - Super Admin Panel
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-300 hover:text-white text-sm mt-2 underline"
          >
            ← Back to Service Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;