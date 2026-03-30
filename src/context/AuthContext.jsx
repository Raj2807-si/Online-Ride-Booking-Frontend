import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('userRole') || 'user');
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const login = (newToken, newRole, userData) => {
    setToken(newToken);
    setRole(newRole);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', newRole);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setRole('user');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
