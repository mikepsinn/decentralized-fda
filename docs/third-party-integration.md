# Third-Party Integration Guide

This guide explains how third-party applications can integrate with the Decentralized FDA (dFDA) platform, either to use it as a backend service or to enable data sharing between their application and dFDA.

## Integration Options

There are three main ways to integrate with dFDA:

1. **Backend as a Service (BaaS)** - Use dFDA as your primary health data storage and processing platform
2. **Data Sharing** - Enable your users to share their health data with dFDA
3. **Data Import** - Allow your users to import their dFDA data into your application

## Prerequisites

- A registered application in the dFDA platform
- Keycloak client credentials (see [Keycloak Integration Guide](./keycloak-integration.md))
- Understanding of OAuth2.0 and OpenID Connect
- API access credentials

## Step 1: Register Your Application

1. Contact the dFDA administrators to register your application
2. You will receive:
   - Application ID
   - API credentials
   - Access to the developer portal

## Step 2: Authentication Setup

1. Configure OAuth2.0 authentication using the provided Keycloak credentials:
   ```javascript
   const config = {
     clientId: 'your-app-id',
     clientSecret: 'your-client-secret',
     realm: 'dfda',
     authServerUrl: 'http://localhost:8080',
     scope: 'openid profile email health-data'
   };
   ```

2. Implement the OAuth2.0 flow in your application:
   ```javascript
   // Example authorization code flow
   const authorizationUrl = `${config.authServerUrl}/realms/${config.realm}/protocol/openid-connect/auth`;
   const tokenUrl = `${config.authServerUrl}/realms/${config.realm}/protocol/openid-connect/token`;

   // Redirect user to authorization URL
   const authUrl = `${authorizationUrl}?
     client_id=${config.clientId}&
     response_type=code&
     scope=${config.scope}&
     redirect_uri=${encodeURIComponent(YOUR_REDIRECT_URI)}`;
   ```

## Step 3: API Integration

### Backend as a Service

1. Store health data:
   ```javascript
   // Example using fetch API
   async function storeHealthData(token, data) {
     const response = await fetch('https://api.dfda.com/v1/health-data', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(data)
     });
     return response.json();
   }
   ```

2. Query health data:
   ```javascript
   async function queryHealthData(token, params) {
     const queryString = new URLSearchParams(params).toString();
     const response = await fetch(`https://api.dfda.com/v1/health-data?${queryString}`, {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     });
     return response.json();
   }
   ```

### Data Sharing

1. Request user consent:
   ```javascript
   async function requestDataSharingConsent(token, scope) {
     const response = await fetch('https://api.dfda.com/v1/consent', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         scope: scope,
         purpose: 'Share health data with dFDA',
         duration: '30d'
       })
     });
     return response.json();
   }
   ```

2. Share data with dFDA:
   ```javascript
   async function shareHealthData(token, data) {
     const response = await fetch('https://api.dfda.com/v1/shared-data', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         data: data,
         source: 'your-app-name',
         timestamp: new Date().toISOString()
       })
     });
     return response.json();
   }
   ```

### Data Import

1. Request dFDA data access:
   ```javascript
   async function requestDataAccess(token) {
     const response = await fetch('https://api.dfda.com/v1/data-access', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         purpose: 'Import health data to third-party app',
         scope: ['demographics', 'medications', 'conditions']
       })
     });
     return response.json();
   }
   ```

2. Import data from dFDA:
   ```javascript
   async function importDFDAData(token, dataTypes) {
     const response = await fetch('https://api.dfda.com/v1/export', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         dataTypes: dataTypes,
         format: 'FHIR'
       })
     });
     return response.json();
   }
   ```

## Data Formats

The dFDA platform supports the following data formats:

1. **FHIR** (Preferred)
   - Supports all major FHIR resources
   - Uses FHIR R4 (4.0.1)
   - Example:
     ```json
     {
       "resourceType": "Observation",
       "status": "final",
       "code": {
         "coding": [{
           "system": "http://loinc.org",
           "code": "8867-4",
           "display": "Heart rate"
         }]
       },
       "valueQuantity": {
         "value": 75,
         "unit": "beats/minute"
       }
     }
     ```

2. **Standard JSON**
   - Used for simple data exchanges
   - Must follow dFDA JSON schema
   - Example:
     ```json
     {
       "type": "health_metric",
       "metric": "heart_rate",
       "value": 75,
       "unit": "bpm",
       "timestamp": "2024-03-20T10:30:00Z"
     }
     ```

## Webhooks

Set up webhooks to receive real-time updates:

```javascript
async function registerWebhook(token, endpoint) {
  const response = await fetch('https://api.dfda.com/v1/webhooks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: endpoint,
      events: ['data.created', 'data.updated', 'consent.changed'],
      secret: 'your-webhook-secret'
    })
  });
  return response.json();
}
```

## Best Practices

1. **Data Privacy**
   - Always obtain explicit user consent
   - Store tokens securely
   - Implement proper data encryption
   - Follow HIPAA compliance guidelines

2. **Error Handling**
   - Implement proper retry mechanisms
   - Handle rate limiting gracefully
   - Log errors appropriately
   - Provide clear error messages to users

3. **Performance**
   - Cache responses when appropriate
   - Use pagination for large data sets
   - Implement request batching
   - Monitor API usage

4. **Security**
   - Use HTTPS for all communications
   - Validate all user inputs
   - Implement proper token refresh mechanisms
   - Regular security audits

## Rate Limits

- 1000 requests per minute per application
- 100 requests per minute per user
- Webhook delivery: 10 attempts with exponential backoff

## Support

- Developer Portal: https://developers.dfda.com
- API Documentation: https://api.dfda.com/docs
- Support Email: api-support@dfda.com
- Developer Forum: https://forum.dfda.com

## Example Applications

1. **Health Tracking App**
   ```javascript
   // Initialize dFDA client
   const dfda = new DFDAClient({
     clientId: 'your-client-id',
     clientSecret: 'your-client-secret'
   });

   // Store health metrics
   await dfda.storeMetric({
     type: 'blood_pressure',
     systolic: 120,
     diastolic: 80,
     timestamp: new Date()
   });
   ```

2. **Medical Research Application**
   ```javascript
   // Request anonymized data access
   const consent = await dfda.requestConsent({
     purpose: 'Medical Research',
     dataTypes: ['vitals', 'medications'],
     anonymized: true
   });

   // Query aggregated data
   const results = await dfda.queryData({
     type: 'medication_adherence',
     timeframe: 'last_30_days',
     aggregation: 'weekly'
   });
   ```

## Troubleshooting

1. **Authentication Issues**
   - Verify client credentials
   - Check token expiration
   - Ensure proper scope configuration

2. **Data Access Issues**
   - Verify user consent status
   - Check data access permissions
   - Validate request format

3. **API Errors**
   - Check error response codes
   - Verify request parameters
   - Review rate limit status

## Updates and Versioning

- API versions are date-based (e.g., 2024-03-20)
- Breaking changes announced 6 months in advance
- Deprecation notices sent via email and API response headers
- Subscribe to the developer newsletter for updates 