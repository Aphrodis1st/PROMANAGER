import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHospitalAuth } from '../../context/HospitalAuthContext';
import { Hospital, Mail, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../constants/api.js';

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
        return '/hospital/admin/dashboard';
      case 'doctor':
        return '/hospital/doctor/dashboard';
      case 'nurse':
        return '/hospital/nurse/dashboard';
      case 'receptionist':
        return '/hospital/receptionist/dashboard';
      default:
        console.log('Unknown role, defaulting to main dashboard');
        return '/hospital/admin/dashboard';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hospital/auth/login`, {
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
      const res = await fetch(`${API_BASE_URL}/hospital/auth/complete-password`, {
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/30">
                <Hospital className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Hospital Management</h1>
              <p className="text-emerald-50 text-sm sm:text-base">Sign in to access your healthcare system</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 sm:px-8 py-6 sm:py-8">

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg px-4 py-3 mb-6 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {!partialPasswordMode ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  placeholder="admin@hospital.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        ) : (
          <div>
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg px-4 py-3 mb-6 flex items-start gap-3 shadow-sm">
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-blue-700 text-sm">Please complete your password setup to continue.</span>
            </div>
            <form onSubmit={handlePasswordCompletion} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                    placeholder="Enter new password"
                    minLength={8}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                    placeholder="Confirm new password"
                    minLength={8}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                {loading ? 'Completing...' : 'Complete Password'}
              </button>
              <button
                type="button"
                onClick={() => { setPartialPasswordMode(false); setError(''); }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-300 text-sm"
              >
                Back to Login
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <Link 
            to="/get-started" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Service Selection
          </Link>
        </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
