import { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../data/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from sessionStorage on mount
  // (sessionStorage clears when tab closes; safer than localStorage for demo)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('nmpb_user');
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.error('Could not restore session', e);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const found = USERS.find(
      u => u.username === username && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Invalid username or password.' };
    }
    // Strip password before storing
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    sessionStorage.setItem('nmpb_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('nmpb_user');
  };

  // Helper to filter projects by user role
  const filterByRole = (projects) => {
    if (!user) return [];
    if (user.role === 'admin' || user.role === 'viewer') return projects;
    if (user.role === 'state') {
      return projects.filter(p => p.state === user.state);
    }
    return [];
  };

  const value = {
    user,
    loading,
    login,
    logout,
    filterByRole,
    isAdmin: user?.role === 'admin',
    isStateBoard: user?.role === 'state',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};