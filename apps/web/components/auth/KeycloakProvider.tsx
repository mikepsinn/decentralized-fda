import { createContext, useContext, useEffect, useState } from 'react';
import { initKeycloak, login, logout, getUserInfo } from '@/lib/keycloak';

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    username?: string;
    email?: string;
    roles?: string[];
  } | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function KeycloakProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const keycloak = initKeycloak();
      if (keycloak) {
        try {
          const authenticated = await keycloak.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            pkceMethod: 'S256',
          });

          if (authenticated) {
            setIsAuthenticated(true);
            setUser(getUserInfo());
          }
        } catch (error) {
          console.error('Failed to initialize authentication:', error);
        }
      }
    };

    initAuth();
  }, []);

  const handleLogin = async () => {
    await login();
    setUser(getUserInfo());
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 