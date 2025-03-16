const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const {
  KEYCLOAK_URL = 'http://localhost:8080',
  KEYCLOAK_ADMIN = 'admin',
  KEYCLOAK_ADMIN_PASSWORD = 'admin',
  KEYCLOAK_REALM = 'gravitee',
  GRAVITEE_MANAGEMENT_SECRET = 'secret',
  GRAVITEE_PORTAL_SECRET = 'secret'
} = process.env;

async function getToken() {
  const response = await axios.post(
    `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
    new URLSearchParams({
      username: KEYCLOAK_ADMIN,
      password: KEYCLOAK_ADMIN_PASSWORD,
      grant_type: 'password',
      client_id: 'admin-cli'
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );
  return response.data.access_token;
}

async function createRealm(token) {
  try {
    await axios.post(
      `${KEYCLOAK_URL}/admin/realms`,
      {
        realm: KEYCLOAK_REALM,
        enabled: true,
        displayName: 'Gravitee Realm'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Realm created successfully');
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('Realm already exists');
    } else {
      throw error;
    }
  }
}

async function createClient(token, clientId, secret, redirectUris) {
  try {
    await axios.post(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients`,
      {
        clientId,
        enabled: true,
        clientAuthenticatorType: 'client-secret',
        secret,
        redirectUris,
        webOrigins: redirectUris,
        publicClient: false,
        protocol: 'openid-connect',
        standardFlowEnabled: true,
        implicitFlowEnabled: false,
        directAccessGrantsEnabled: true,
        serviceAccountsEnabled: true
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log(`Client ${clientId} created successfully`);
  } catch (error) {
    if (error.response?.status === 409) {
      console.log(`Client ${clientId} already exists`);
    } else {
      throw error;
    }
  }
}

async function createRole(token, roleName) {
  try {
    await axios.post(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/roles`,
      {
        name: roleName
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log(`Role ${roleName} created successfully`);
  } catch (error) {
    if (error.response?.status === 409) {
      console.log(`Role ${roleName} already exists`);
    } else {
      throw error;
    }
  }
}

async function createTestUser(token) {
  try {
    await axios.post(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`,
      {
        username: 'gravitee-admin',
        enabled: true,
        emailVerified: true,
        credentials: [{
          type: 'password',
          value: 'password',
          temporary: false
        }]
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Test user created successfully');
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('Test user already exists');
    } else {
      throw error;
    }
  }
}

async function setup() {
  try {
    console.log('Starting Keycloak setup...');
    
    // Get admin token
    const token = await getToken();
    
    // Create realm
    await createRealm(token);
    
    // Create clients
    await createClient(token, 'gravitee-management', GRAVITEE_MANAGEMENT_SECRET, ['http://localhost:8084/*']);
    await createClient(token, 'gravitee-portal', GRAVITEE_PORTAL_SECRET, ['http://localhost:8085/*']);
    
    // Create roles
    const roles = [
      'ORGANIZATION_ADMIN',
      'ENVIRONMENT_ADMIN',
      'API_PUBLISHER',
      'API_DEVELOPER',
      'USER'
    ];
    
    for (const role of roles) {
      await createRole(token, role);
    }
    
    // Create test user
    await createTestUser(token);
    
    console.log('Keycloak setup completed successfully');
  } catch (error) {
    console.error('Setup failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setup();
}

module.exports = { setup }; 