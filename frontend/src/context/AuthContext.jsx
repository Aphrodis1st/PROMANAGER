import React, { createContext, useContext, useEffect, useState } from "react";
import {
  setServiceAuth,
  clearServiceAuth,
  getServiceToken,
} from "../utils/authCookies.js";

const AuthContext = createContext(null);

// Store tokens per tab
const tabTokens = {};

export function AuthProvider({ children, tabId = "default" }) {
  const [user, setUser] = useState(() => {
    // Try to restore user from localStorage on initialization
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setTokenState] = useState(() => {
    // Try to restore token from localStorage or tabTokens
    return getServiceToken('stock') || tabTokens[tabId]?.token || null;
  });
  const [refreshToken, setRefreshToken] = useState(tabTokens[tabId]?.refreshToken || null);
  const [loading, setLoading] = useState(() => {
    // If we have both token and user from localStorage, we're not loading
    const storedToken = getServiceToken('stock');
    const storedUser = localStorage.getItem('user');
    return !(storedToken && storedUser);
  });

  // ---- Set Token Helper ----
  const setToken = (t, r = null) => {
    tabTokens[tabId] = { token: t, refreshToken: r };
    setTokenState(t);
    setRefreshToken(r);
    if (t) {
      setServiceAuth('stock', { token: t, user });
    } else {
      clearServiceAuth('stock');
    }
  };

  // ---- Set User Helper (for external login like hospital) ----
  const setUserData = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  // ---- LOGIN ----
  const login = async (email, password) => {
    const resp = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!resp.ok) throw new Error("Login failed");

    const { token: t, refreshToken: r, user: u } = await resp.json();
    const normalizedUser = { ...u, role: (u.role || "PATIENT").toUpperCase() };

    setToken(t, r);
    setUserData(normalizedUser);

    // Set provider online
    if (["DOCTOR", "PHARMACY", "CALLCENTER"].includes(normalizedUser.role)) {
      try {
        await fetchWithAuth("http://localhost:5000/api/v1/status/online", { method: "POST" });
      } catch (err) {
        console.error("Failed to set user online:", err);
      }
    }

    return normalizedUser;
  };

  // ---- HOSPITAL LOGIN (external) ----
  const hospitalLogin = (token, userData) => {
    setServiceAuth('hospital', { token, user: userData });
    setTokenState(token);
    setUserData(userData);
    return userData;
  };

  // ---- REGISTER ----
  const register = async (data) => {
    const resp = await fetch("http://localhost:5000/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const { token: t, refreshToken: r, user: u } = await resp.json();
    const normalizedUser = { ...u, role: (u.role || "PATIENT").toUpperCase() };

    setToken(t, r);
    setUserData(normalizedUser);

    // Set provider online if applicable
    if (["DOCTOR", "PHARMACY", "CALLCENTER"].includes(normalizedUser.role)) {
      try {
        await fetchWithAuth("http://localhost:5000/api/v1/status/online", { method: "POST" });
      } catch (err) {
        console.error("Failed to set user online:", err);
      }
    }

    return normalizedUser;
  };

  // ---- LOGOUT ----
  const logout = async () => {
    if (user && ["DOCTOR", "PHARMACY", "CALLCENTER"].includes(user.role)) {
      try {
        await fetchWithAuth("http://localhost:5000/api/v1/status/offline", { method: "POST" });
      } catch (err) {
        console.error("Failed to set user offline:", err);
      }
    }

    setToken(null);
    setUserData(null);
    localStorage.removeItem('hospital');
  };

  // ---- REFRESH ACCESS TOKEN ----
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      await logout();
      return null;
    }

    try {
      const resp = await fetch("http://localhost:5000/api/v1/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!resp.ok) throw new Error("Refresh failed");

      const { token: newToken, refreshToken: newRefresh, user: u } = await resp.json();
      setToken(newToken, newRefresh);
      setUser({ ...u, role: (u.role || "PATIENT").toUpperCase() });
      return newToken;
    } catch (err) {
      console.error("Refresh error:", err);
      await logout();
      return null;
    }
  };

  // ---- FETCH WITH AUTH (auto refresh) ----
  const fetchWithAuth = async (url, options = {}) => {
    if (!token) throw new Error("No access token");

    let resp = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error("Unauthorized");

      resp = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
      });
    }

    return resp;
  };

  // ---- RESTORE SESSION (/me) ----
  useEffect(() => {
    // If we have both token and user from localStorage, we're good to go
    if (token && user) {
      setLoading(false);
      return;
    }
    
    // If we have a token but no user, try to restore session
    if (token && !user) {
      const restoreSession = async () => {
        try {
          const resp = await fetchWithAuth("http://localhost:5000/api/v1/auth/me");
          if (!resp.ok) throw new Error("Session restore failed");

          const userData = await resp.json();
          const normalizedUser = { ...userData, role: (userData.role || "PATIENT").toUpperCase() };
          setUserData(normalizedUser);

          if (["DOCTOR", "PHARMACY", "CALLCENTER"].includes(normalizedUser.role)) {
            try {
              await fetchWithAuth("http://localhost:5000/api/v1/status/online", { method: "POST" });
            } catch (err) {
              console.error("Failed to set user online:", err);
            }
          }
        } catch (err) {
          console.error("Auth restore failed:", err);
          await logout();
        } finally {
          setLoading(false);
        }
      };

      restoreSession();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchWithAuth, hospitalLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
