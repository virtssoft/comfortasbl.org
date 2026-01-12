
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiUser } from '../services/api';

interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  login: (user: ApiUser) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Au chargement de l'app, on vérifie s'il y a une session active dans le localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('comfort_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur lecture session", e);
        localStorage.removeItem('comfort_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: ApiUser) => {
    setUser(userData);
    localStorage.setItem('comfort_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('comfort_user');
    // Si on est dans l'admin, on redirige ou ferme
    if (window.location.hash.includes('admin')) {
        window.close();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
