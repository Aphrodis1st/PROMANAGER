import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [token, setToken] = useState(() => localStorage.getItem('hrToken') || null);

  const login = (data) => {
    setToken(data.token);
    setAdmin(data.admin);
    setOrganization(data.organization);
    localStorage.setItem('hrToken', data.token);
    localStorage.setItem('hrAdmin', JSON.stringify(data.admin));
    localStorage.setItem('hrOrganization', JSON.stringify(data.organization));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    setOrganization(null);
    localStorage.removeItem('hrToken');
    localStorage.removeItem('hrAdmin');
    localStorage.removeItem('hrOrganization');
  };

  return (
    <HRAuthContext.Provider value={{ organization, admin, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </HRAuthContext.Provider>
  );
};

export const useHRAuth = () => useContext(HRAuthContext);
