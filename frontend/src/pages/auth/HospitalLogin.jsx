import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHospitalAuth } from '../../context/HospitalAuthContext';

export default function HospitalLogin() {
  const navigate = useNavigate();
  const { hospitalLogin } = useAuth();
  const { login: hospitalAuthLogin } = useHospitalAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [partialPasswordMode, setPartialPasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [partialToken, setPartialToken] = useState('');

  const getRedirectPath = (user) => {
    console.log('getRedirectPath - user role:', user.role);
    // Determine redirect path based on user role
    switch (user.role) {
      case 'admin':
      case 'hospital_admin':
        return '/hospital/dashboard';
      case 'doctor':
        return '/hospital/doctor/dashboard';
      case 'nurse':
        return '/hospital/nurse/dashboard';
      case 'receptionist':
        return '/hospital/receptionist/dashboard';
      default:
        console.log('Unknown role, defaulting to main dashboard');
        return '/hospital/dashboard';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/hospital/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log('Login response:', data);
      
      if (!data.success) {
        if (data.requiresPasswordCompletion) {
          setPartialPasswordMode(true);
          setPartialToken(data.partialToken);
          return;
        }
        setError(data.error || 'Login failed');
        return;
      }

      // Prepare user data for AuthContext
      const userData = {
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        department: data.user.department || null,
        hospitalId: data.user.hospitalId,
        userType: data.user.userType
      };

      console.log('Prepared user data:', userData);

      // Use both authentication contexts
      hospitalLogin(data.token, userData);
      hospitalAuthLogin({
        token: data.token,
        admin: data.admin || userData,
        user: data.user || userData,
        hospital: data.hospital
      });
      
      // Navigate to appropriate dashboard
      const redirectPath = getRedirectPath(userData);
      console.log('Redirecting to:', redirectPath);
      navigate(redirectPath);
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordCompletion = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/hospital/auth/complete-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partialToken, newPassword }),
      });
      const data = await res.json();
      
      if (!data.success) { 
        setError(data.error || 'Password completion failed'); 
        return; 
      }

      // Prepare user data for AuthContext
      const userData = {
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        department: data.user.department || null,
        hospitalId: data.user.hospitalId,
        userType: data.user.userType
      };

      // Use both authentication contexts
      hospitalLogin(data.token, userData);
      hospitalAuthLogin({
        token: data.token,
        admin: data.admin || userData,
        user: data.user || userData,
        hospital: data.hospital
      });

      // Navigate to appropriate dashboard
      const redirectPath = getRedirectPath(userData);
      navigate(redirectPath);
      
    } catch (error) {
      console.error('Password completion error:', error);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-green-600">H</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Hospital Login</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your hospital system</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {!partialPasswordMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="admin@hospital.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <div>
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 mb-6 text-sm">
              Please complete your password setup to continue.
            </div>
            <form onSubmit={handlePasswordCompletion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter new password"
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Confirm new password"
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
              >
                {loading ? 'Completing...' : 'Complete Password'}
              </button>
              <button
                type="button"
                onClick={() => { setPartialPasswordMode(false); setError(''); }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">← Back to Service Selection</Link>
        </div>
      </div>
    </div>
  );
}
