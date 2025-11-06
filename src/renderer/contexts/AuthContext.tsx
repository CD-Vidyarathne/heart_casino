import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAdapter } from '../adapters/authAdapter';

interface AuthContextType {
  session: any | null;
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const refreshSession = async () => {
    try {
      const currentSession = await AuthAdapter.getSession();
      setSession(currentSession);

      if (currentSession?.user) {
        setUser(currentSession.user);
        // Update localStorage
        localStorage.setItem('session', JSON.stringify(currentSession));
        localStorage.setItem('user', JSON.stringify(currentSession.user));
      } else {
        setUser(null);
        localStorage.removeItem('session');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setSession(null);
      setUser(null);
      localStorage.removeItem('session');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AuthAdapter.signOut();
      setSession(null);
      setUser(null);
      localStorage.removeItem('session');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  useEffect(() => {
    // Check for existing session on mount
    const storedSession = localStorage.getItem('session');
    const storedUser = localStorage.getItem('user');

    if (storedSession && storedUser) {
      try {
        const parsedSession = JSON.parse(storedSession);
        const parsedUser = JSON.parse(storedUser);
        setSession(parsedSession);
        setUser(parsedUser);
        // Verify session is still valid
        refreshSession();
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem('session');
        localStorage.removeItem('user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    session,
    user,
    isLoading,
    isAuthenticated: !!session && !!user,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

