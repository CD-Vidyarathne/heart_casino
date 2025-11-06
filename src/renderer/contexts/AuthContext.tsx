import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
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

  const refreshSession = useCallback(async () => {
    try {
      // First, try to get session from localStorage (faster, and works immediately after login)
      const storedSession = localStorage.getItem('session');
      const storedUser = localStorage.getItem('user');

      if (storedSession && storedUser) {
        try {
          const parsedSession = JSON.parse(storedSession);
          const parsedUser = JSON.parse(storedUser);
          
          // Set the session immediately from localStorage
          setSession(parsedSession);
          setUser(parsedUser);
          
          // Then verify with the server (but don't wait for it to update state)
          try {
            const serverSession = await AuthAdapter.getSession();
            if (serverSession) {
              // Update with server session if available
              setSession(serverSession);
              if (serverSession.user) {
                setUser(serverSession.user);
                localStorage.setItem('session', JSON.stringify(serverSession));
                localStorage.setItem('user', JSON.stringify(serverSession.user));
              }
            }
          } catch (serverError) {
            // If server session fails, keep using localStorage session
            console.warn('Failed to verify session with server, using cached session:', serverError);
          }
        } catch (parseError) {
          console.error('Failed to parse stored session:', parseError);
          localStorage.removeItem('session');
          localStorage.removeItem('user');
          setSession(null);
          setUser(null);
        }
      } else {
        // No stored session, try to get from server
        const currentSession = await AuthAdapter.getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          setUser(currentSession.user);
          localStorage.setItem('session', JSON.stringify(currentSession));
          localStorage.setItem('user', JSON.stringify(currentSession.user));
        } else {
          setUser(null);
          localStorage.removeItem('session');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      // Don't clear localStorage on error - keep the session if it exists
      const storedSession = localStorage.getItem('session');
      const storedUser = localStorage.getItem('user');
      if (storedSession && storedUser) {
        try {
          setSession(JSON.parse(storedSession));
          setUser(JSON.parse(storedUser));
        } catch {
          setSession(null);
          setUser(null);
        }
      } else {
        setSession(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = async () => {
    try {
      await AuthAdapter.signOut();
      setSession(null);
      setUser(null);
      localStorage.removeItem('session');
      localStorage.removeItem('user');
      // Navigation will be handled by ProtectedRoute when it detects user is not authenticated
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
  }, [refreshSession]);

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

