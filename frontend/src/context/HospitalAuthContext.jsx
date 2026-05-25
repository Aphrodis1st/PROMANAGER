import React, { createContext, useContext, useState } from 'react';
import { setServiceAuth, clearServiceAuth, getServiceToken } from '../utils/authCookies.js';

const HospitalAuthContext = createContext(null);

export const HospitalAuthProvider = ({ children }) => {
  const [hospital, setHospital] = useState(() => {
    const stored = localStorage.getItem('hospital');
    return stored ? JSON.parse(stored) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('hospitalAdmin');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => getServiceToken('hospital') || null);

  const login = (data) => {
    setToken(data.token);
    setAdmin(data.admin);
    setHospital(data.hospital);
    setServiceAuth('hospital', { token: data.token, user: data.admin });
    localStorage.setItem('hospital', JSON.stringify(data.hospital));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    setHospital(null);
    clearServiceAuth('hospital');
    localStorage.removeItem('hospital');
  };

  return (
    <HospitalAuthContext.Provider value={{ hospital, admin, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </HospitalAuthContext.Provider>
  );
};

export const useHospitalAuth = () => useContext(HospitalAuthContext);
