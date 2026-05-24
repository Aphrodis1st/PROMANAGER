import React, { createContext, useContext, useState } from 'react';
import { setServiceAuth, clearServiceAuth, getServiceToken } from '../utils/authCookies.js';

const HRAuthContext = createContext(null);

export const HRAuthProvider = ({ children }) => {
  const [organization, setOrganization] = useState(() => {
    const stored = localStorage.getItem('hrOrganization');
    return stored ? JSON.parse(stored) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('hrAdmin');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => getServiceToken('hr') || null);

  const login = (data) => {
    setToken(data.token);
    setAdmin(data.admin);
    setOrganization(data.organization);
    setServiceAuth('hr', { token: data.token, user: data.admin });
    localStorage.setItem('hrOrganization', JSON.stringify(data.organization));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    setOrganization(null);
    clearServiceAuth('hr');
    localStorage.removeItem('hrOrganization');
  };

  return (
    <HRAuthContext.Provider value={{ organization, admin, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </HRAuthContext.Provider>
  );
};

export const useHRAuth = () => useContext(HRAuthContext);
