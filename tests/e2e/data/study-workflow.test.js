const axios = require('axios');
const { setup: setupKeycloak } = require('../../../scripts/setup-keycloak');

describe('Study Workflow E2E Tests', () => {
  let researcherToken;
  let reviewerToken;
  let studyId;

  beforeAll(async () => {
    await setupKeycloak();
    researcherToken = await getTokenForRole('RESEARCHER');
    reviewerToken = await getTokenForRole('REVIEWER');
  });

  test('complete study workflow', async () => {
    // 1. Create new study
    const createResponse = await axios.post(
      'http://localhost:3000/api/studies',
      {
        name: 'E2E Test Study',
        description: 'Testing complete study workflow',
        type: 'OBSERVATIONAL'
      },
      {
        headers: { Authorization: `Bearer ${researcherToken}` }
      }
    );

    expect(createResponse.status).toBe(201);
    studyId = createResponse.data.id;

    // 2. Submit study data
    const dataSubmission = await axios.post(
      'http://localhost:3000/api/submissions',
      {
        studyId,
        data: {
          patientId: 'E2E-P1',
          measurements: [
            { timestamp: Date.now(), value: 98.6 }
          ]
        }
      },
      {
        headers: { Authorization: `Bearer ${researcherToken}` }
      }
    );

    expect(dataSubmission.status).toBe(201);

    // 3. Review submission
    const reviewResponse = await axios.post(
      `http://localhost:3000/api/submissions/${dataSubmission.data.submissionId}/review`,
      {
        status: 'APPROVED',
        comments: 'Data format verified'
      },
      {
        headers: { Authorization: `Bearer ${reviewerToken}` }
      }
    );

    expect(reviewResponse.status).toBe(200);

    // 4. Verify study status
    const studyStatus = await axios.get(
      `http://localhost:3000/api/studies/${studyId}/status`,
      {
        headers: { Authorization: `Bearer ${researcherToken}` }
      }
    );

    expect(studyStatus.data.status).toBe('ACTIVE');
    expect(studyStatus.data.submissionCount).toBe(1);
    expect(studyStatus.data.lastSubmission).toBeDefined();
  });

  test('data access controls', async () => {
    // Attempt unauthorized access
    const unauthorizedToken = await getTokenForRole('GUEST');
    
    await expect(axios.get(
      `http://localhost:3000/api/studies/${studyId}/data`,
      {
        headers: { Authorization: `Bearer ${unauthorizedToken}` }
      }
    )).rejects.toThrow();

    // Verify researcher can access
    const researcherAccess = await axios.get(
      `http://localhost:3000/api/studies/${studyId}/data`,
      {
        headers: { Authorization: `Bearer ${researcherToken}` }
      }
    );

    expect(researcherAccess.status).toBe(200);
    expect(researcherAccess.data).toBeDefined();
  });

  test('audit trail verification', async () => {
    const auditResponse = await axios.get(
      `http://localhost:3000/api/studies/${studyId}/audit`,
      {
        headers: { Authorization: `Bearer ${reviewerToken}` }
      }
    );

    expect(auditResponse.status).toBe(200);
    expect(auditResponse.data.events).toBeInstanceOf(Array);
    expect(auditResponse.data.events.length).toBeGreaterThan(0);
    
    // Verify audit trail contains study creation and data submission
    const auditEvents = auditResponse.data.events;
    expect(auditEvents.some(e => e.type === 'STUDY_CREATED')).toBe(true);
    expect(auditEvents.some(e => e.type === 'DATA_SUBMITTED')).toBe(true);
    expect(auditEvents.some(e => e.type === 'SUBMISSION_REVIEWED')).toBe(true);
  });
});

async function getTokenForRole(role) {
  const response = await axios.post(
    'http://localhost:8080/realms/gravitee/protocol/openid-connect/token',
    new URLSearchParams({
      grant_type: 'password',
      client_id: 'gravitee-management',
      client_secret: process.env.GRAVITEE_MANAGEMENT_SECRET,
      username: `test-${role.toLowerCase()}`,
      password: 'password'
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );
 