require('dotenv').config();

// Set default environment variables for testing
process.env.GRAVITEE_MANAGEMENT_SECRET = process.env.GRAVITEE_MANAGEMENT_SECRET || 'test-secret';
process.env.KEYCLOAK_ADMIN = process.env.KEYCLOAK_ADMIN || 'admin';
process.env.KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin'; 