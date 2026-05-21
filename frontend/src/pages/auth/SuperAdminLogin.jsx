import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowLeft, AlertCircle, Eye, EyeOff, AlertTriangle, Lock as LockIcon } from 'lucide-react';
import axios from 'axios';

const SuperAdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
      
      console.log('Login response:', response.data);
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-4 shadow-lg shadow-red-500/50 relative">
            <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <LockIcon className="w-3 h-3 text-red-900" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SUPER ADMIN</h1>
          <p className="text-red-300 text-sm">System Administrator Portal</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Administrator Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm"
                  placeholder="superadmin@promanager.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 text-sm sm:text-base mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AUTHENTICATING...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  AUTHORIZE ACCESS
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="px-3 text-white/30 text-xs uppercase tracking-wider">Secure Login</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Security Features */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>Two-Factor Authentication Ready</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>Activity Monitoring Active</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Service Selection
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/30">© 2024 PROMANAGER - Super Admin Panel v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
