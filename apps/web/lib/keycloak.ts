import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'dfda',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'web-client',
};

let keycloak: Keycloak | null = null;

// Initialize Keycloak instance
export const initKeycloak = () => {
  if (typeof window !== 'undefined' && !keycloak) {
    keycloak = new Keycloak(keycloakConfig);
  }
  return keycloak;
};

// Get Keycloak instance
export const getKeycloak = () => {
  if (!keycloak) {
    return initKeycloak();
  }
  return keycloak;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const kc = getKeycloak();
  return !!kc?.authenticated;
};

// Get user token
export const getToken = () => {
  const kc = getKeycloak();
  return kc?.token;
};

// Get user info
export const getUserInfo = () => {
  const kc = getKeycloak();
  return {
    username: kc?.tokenParsed?.preferred_username,
    email: kc?.tokenParsed?.email,
    roles: kc?.tokenParsed?.realm_access?.roles || [],
  };
};

// Login
export const login = async (options?: any) => {
  const kc = getKeycloak();
  if (kc) {
    try {
      await kc.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
      });
      if (!kc.authenticated) {
        await kc.login(options);
      }
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
    }
  }
};

// Logout
export const logout = async () => {
  const kc = getKeycloak();
  if (kc) {
    try {
      await kc.logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }
}; 