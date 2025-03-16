const axios = require('axios');
const { setup: setupKeycloak } = require('../../scripts/setup-keycloak');

const {
  KEYCLOAK_URL = 'http://localhost:8080',
  KEYCLOAK_REALM = 'gravitee',
  GRAVITEE_MANAGEMENT_SECRET = 'secret',
  GRAVITEE_PORTAL_SECRET = 'secret'
} = process.env;

describe('Keycloak-Gravitee Integration', () => {
  let managementToken;
  let portalToken;

  beforeAll(async () => {
    // Wait for services to be ready
    await waitForServices();
    // Run Keycloak setup
    await setupKeycloak();
  }, 60000); // 60 second timeout

  async function waitForServices() {
    const services = [
      { url: `${KEYCLOAK_URL}/health/ready`, name: 'Keycloak' },
      { url: 'http://localhost:8082/health', name: 'Gravitee Gateway' },
      { url: 'http://localhost:8083/management/organizations/DEFAULT/environments/DEFAULT/', name: 'Gravitee Management API' },
      { url: 'http://localhost:8084', name: 'Gravitee Management UI' },
      { url: 'http://localhost:8085', name: 'Gravitee Portal UI' }
    ];

    for (const service of services) {
      await waitForService(service.url, service.name);
    }
  }

  async function waitForService(url, name, maxAttempts = 30, interval = 2000) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await axios.get(url);
        console.log(`${name} is ready`);
        return;
      } catch (error) {
        if (i === maxAttempts - 1) {
          throw new Error(`${name} failed to become ready: ${error.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }

  async function getToken(clientId, clientSecret) {
    const response = await axios.post(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    return response.data.access_token;
  }

  test('Should get management token from Keycloak', async () => {
    managementToken = await getToken('gravitee-management', GRAVITEE_MANAGEMENT_SECRET);
    expect(managementToken).toBeTruthy();
  });

  test('Should get portal token from Keycloak', async () => {
    portalToken = await getToken('gravitee-portal', GRAVITEE_PORTAL_SECRET);
    expect(portalToken).toBeTruthy();
  });

  test('Should access Gravitee Management API with token', async () => {
    const response = await axios.get(
      'http://localhost:8083/management/organizations/DEFAULT/environments/DEFAULT/apis',
      {
        headers: { Authorization: `Bearer ${managementToken}` }
      }
    );
    expect(response.status).toBe(200);
  });

  test('Should access Gravitee Portal API with token', async () => {
    const response = await axios.get(
      'http://localhost:8083/portal/environments/DEFAULT/apis',
      {
        headers: { Authorization: `Bearer ${portalToken}` }
      }
    );
    expect(response.status).toBe(200);
  });

  test('Should reject invalid token', async () => {
    await expect(axios.get(
      'http://localhost:8083/management/organizations/DEFAULT/environments/DEFAULT/apis',
      {
        headers: { Authorization: 'Bearer invalid-token' }
      }
    )).rejects.toThrow();
  });

  // Test user login flow
  test('Should login test user', async () => {
    const response = await axios.post(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        username: 'gravitee-admin',
        password: 'password',
        grant_type: 'password',
        client_id: 'gravitee-management',
        client_secret: GRAVITEE_MANAGEMENT_SECRET
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    expect(response.data.access_token).toBeTruthy();
  });
}); 