const axios = require('axios');
const { setup: setupKeycloak } = require('../../../scripts/setup-keycloak');

describe('API Endpoints Integration Tests', () => {
  let authToken;
  
  beforeAll(async () => {
    await setupKeycloak();
    // Get authentication token for testing
    authToken = await getTestUserToken();
  });

  describe('Study Data Endpoints', () => {
    test('should create new study', async () => {
      const studyData = {
        name: 'Test Study',
        description: 'Integration test study',
        type: 'CLINICAL_TRIAL'
      };

      const response = await axios.post(
        'http://localhost:3000/api/studies',
        studyData,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.name).toBe(studyData.name);
    });

    test('should get study data with proper authorization', async () => {
      const studyId = 'test-study-1';
      const response = await axios.get(
        `http://localhost:3000/api/studies/${studyId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(studyId);
    });

    test('should handle unauthorized access', async () => {
      await expect(axios.get(
        'http://localhost:3000/api/studies/restricted-study',
        {
          headers: { Authorization: 'Bearer invalid-token' }
        }
      )).rejects.toThrow();
    });
  });

  describe('Data Submission Endpoints', () => {
    test('should submit encrypted study data', async () => {
      const submissionData = {
        studyId: 'test-study-1',
        data: {
          patientId: 'P12345',
          measurements: [
            { timestamp: Date.now(), value: 120 }
          ]
        }
      };

      const response = await axios.post(
        'http://localhost:3000/api/submissions',
        submissionData,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).toBe(201);
      expect(response.data.submissionId).toBeDefined();
    });

    test('should validate data format', async () => {
      const invalidData = {
        studyId: 'test-study-1',
        data: 'invalid-format'
      };

      await expect(axios.post(
        'http://localhost:3000/api/submissions',
        invalidData,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      )).rejects.toThrow();
    });
  });
});

async function getTestUserToken() {
  const response = await axios.post(
    'http://localhost:8080/realms/gravitee/protocol/openid-connect/token',
    new URLSearchParams({
      grant_type: 'password',
      client_id: 'gravitee-management',
      client_secret: process.env.GRAVITEE_MANAGEMENT_SECRET,
      username: 'gravitee-admin',
      password: 'password'
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );
  return response.data.access_token;
} 