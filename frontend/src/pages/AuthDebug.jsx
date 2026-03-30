import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebug = () => {
  const { user, token, loading } = useAuth();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
        
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">Loading State</h2>
          <p>Loading: {loading ? 'true' : 'false'}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">Token</h2>
          <p className="break-all">{token ? `${token.substring(0, 50)}...` : 'No token'}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">User Data</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {user ? JSON.stringify(user, null, 2) : 'No user data'}
          </pre>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">LocalStorage</h2>
          <div className="space-y-2">
            <div>
              <strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Not found'}
            </div>
            <div>
              <strong>User:</strong> {localStorage.getItem('user') ? 'Present' : 'Not found'}
            </div>
            <div>
              <strong>Hospital:</strong> {localStorage.getItem('hospital') ? 'Present' : 'Not found'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;