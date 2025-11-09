import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { UserAdapter } from '../adapters/userAdapter';

interface UserProfile {
  id: string;
  display_name?: string;
  gender?: 'male' | 'female';
  avatar?: string;
  balance?: number;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserContextType {
  session: any | null;
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user?.id || !session) {
      setProfile(null);
      return;
    }

    try {
      const userProfile = await UserAdapter.getUserProfile(user.id, session);
      setProfile(userProfile || null);
      if (userProfile) {
        localStorage.setItem('profile', JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    }
  }, [user, session]);

  const refreshSession = useCallback(async () => {
    try {
      const storedSession = localStorage.getItem('session');
      const storedUser = localStorage.getItem('user');
      const storedProfile = localStorage.getItem('profile');

      if (storedSession && storedUser) {
        try {
          const parsedSession = JSON.parse(storedSession);
          const parsedUser = JSON.parse(storedUser);

          setSession(parsedSession);
          setUser(parsedUser);

          if (storedProfile) {
            try {
              setProfile(JSON.parse(storedProfile));
            } catch {
              console.error('Failed to parse stored profile');
            }
          }

          try {
            const serverSession = await UserAdapter.getSession();
            if (serverSession) {
              setSession(serverSession);
              if (serverSession.user) {
                setUser(serverSession.user);
                localStorage.setItem('session', JSON.stringify(serverSession));
                localStorage.setItem(
                  'user',
                  JSON.stringify(serverSession.user)
                );

                try {
                  const userProfile = await UserAdapter.getUserProfile(
                    serverSession.user.id,
                    serverSession
                  );
                  if (userProfile) {
                    setProfile(userProfile);
                    localStorage.setItem(
                      'profile',
                      JSON.stringify(userProfile)
                    );
                  }
                } catch (profileError) {
                  console.warn('Failed to fetch profile:', profileError);
                }
              }
            }
          } catch (serverError) {
            console.warn(
              'Failed to verify session with server, using cached session:',
              serverError
            );
            if (parsedUser?.id && parsedSession) {
              try {
                const userProfile = await UserAdapter.getUserProfile(
                  parsedUser.id,
                  parsedSession
                );
                if (userProfile) {
                  setProfile(userProfile);
                  localStorage.setItem('profile', JSON.stringify(userProfile));
                }
              } catch (profileError) {
                console.warn('Failed to fetch profile:', profileError);
              }
            }
          }
        } catch (parseError) {
          console.error('Failed to parse stored session:', parseError);
          localStorage.removeItem('session');
          localStorage.removeItem('user');
          localStorage.removeItem('profile');
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } else {
        const currentSession = await UserAdapter.getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          setUser(currentSession.user);
          localStorage.setItem('session', JSON.stringify(currentSession));
          localStorage.setItem('user', JSON.stringify(currentSession.user));

          try {
            const userProfile = await UserAdapter.getUserProfile(
              currentSession.user.id,
              currentSession
            );
            if (userProfile) {
              setProfile(userProfile);
              localStorage.setItem('profile', JSON.stringify(userProfile));
            }
          } catch (profileError) {
            console.warn('Failed to fetch profile:', profileError);
          }
        } else {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('session');
          localStorage.removeItem('user');
          localStorage.removeItem('profile');
        }
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      const storedSession = localStorage.getItem('session');
      const storedUser = localStorage.getItem('user');
      const storedProfile = localStorage.getItem('profile');
      if (storedSession && storedUser) {
        try {
          setSession(JSON.parse(storedSession));
          setUser(JSON.parse(storedUser));
          if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
          }
        } catch {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = async () => {
    try {
      await UserAdapter.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      localStorage.removeItem('session');
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  useEffect(() => {
    const storedSession = localStorage.getItem('session');
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('profile');

    if (storedSession && storedUser) {
      try {
        const parsedSession = JSON.parse(storedSession);
        const parsedUser = JSON.parse(storedUser);
        setSession(parsedSession);
        setUser(parsedUser);
        if (storedProfile) {
          try {
            setProfile(JSON.parse(storedProfile));
          } catch {
            console.error('Failed to parse stored profile');
          }
        }
        refreshSession();
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem('session');
        localStorage.removeItem('user');
        localStorage.removeItem('profile');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [refreshSession]);

  const value: UserContextType = {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!session && !!user,
    signOut,
    refreshSession,
    refreshProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useAuth() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
