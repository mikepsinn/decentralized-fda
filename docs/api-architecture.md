# API Management Architecture

## Overview

The dFDA platform uses Gravitee.io as its API Management layer. Gravitee acts as the API gateway and management platform that sits between third-party applications and the dFDA core services.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  3rd Party  │     │   Gravitee   │     │    dFDA     │
│    Apps     │ --> │ API Gateway  │ --> │   Backend   │
└─────────────┘     └──────────────┘     └─────────────┘
```

## What Gravitee Provides

1. **API Gateway**
   - Routes all API traffic
   - Handles authentication and authorization
   - Enforces rate limiting
   - Monitors API usage
   - Provides security features

2. **Developer Portal** (http://localhost:8085)
   - Self-service API documentation
   - API key management
   - Interactive API testing
   - Usage analytics for developers

3. **Management Console** (http://localhost:8084)
   - API lifecycle management
   - Policy configuration
   - Access control
   - Analytics and monitoring

## How It Works

1. **API Registration**
   - All dFDA APIs are registered in Gravitee
   - Policies (security, rate limiting, etc.) are configured
   - Documentation is published to the Developer Portal

2. **Developer Access**
   - Developers register in the Developer Portal
   - Create applications and get API keys
   - Subscribe to APIs they need
   - Monitor their API usage

3. **Request Flow**
   ```
   Third-Party App                        dFDA Backend
         │                                     │
         │        1. API Request              │
         │─────────────────────┐              │
         │                     │              │
         │               Gravitee Gateway     │
         │                     │              │
         │               2. Validates:        │
         │                - Authentication    │
         │                - Rate limits       │
         │                - Policies          │
         │                     │              │
         │               3. Routes Request    │
         │                     │              │
         │                     └──────────────▶
         │                                    │
         │        4. API Response            │
         │◀───────────────────────────────────│
   ```

## Key Features

1. **Authentication & Authorization**
   - OAuth2.0/OpenID Connect with Keycloak integration
   - API key validation
   - JWT token validation
   - Role-based access control

2. **Security**
   - SSL/TLS encryption
   - IP filtering
   - Request validation
   - Threat protection

3. **Monitoring & Analytics**
   - Real-time API metrics
   - Usage statistics
   - Error tracking
   - Performance monitoring

4. **Rate Limiting & Quotas**
   - Per-application limits
   - Per-user limits
   - Custom rate limit policies
   - Quota management

## Developer Portal Features

1. **API Catalog**
   - Browse available APIs
   - Interactive OpenAPI documentation
   - Try-it-out functionality
   - Code samples in multiple languages

2. **Application Management**
   - Create and manage applications
   - Generate and manage API keys
   - View application analytics
   - Manage subscriptions

3. **Documentation**
   - API reference
   - Getting started guides
   - Authentication guides
   - Best practices

## Management Console Features

1. **API Design & Configuration**
   - Create and publish APIs
   - Configure security policies
   - Set up rate limiting
   - Manage API versions

2. **Monitoring**
   - Real-time dashboard
   - API health monitoring
   - Error tracking
   - Usage analytics

3. **Access Control**
   - User management
   - Role-based access
   - API key management
   - OAuth2 configuration

## Best Practices

1. **API Versioning**
   - Use Gravitee's versioning features
   - Maintain backward compatibility
   - Document changes in the Developer Portal
   - Use proper deprecation procedures

2. **Security**
   - Configure appropriate security policies
   - Use rate limiting to prevent abuse
   - Monitor for suspicious activity
   - Regular security audits

3. **Documentation**
   - Keep API documentation up-to-date
   - Provide clear examples
   - Document error responses
   - Include use cases

## Troubleshooting

1. **Common Gateway Issues**
   - Check API gateway logs
   - Verify policy configuration
   - Check rate limit status
   - Validate API key/token

2. **Developer Portal Issues**
   - Clear browser cache
   - Check application subscription status
   - Verify API key validity
   - Contact support if needed

## Support

For Gravitee-specific issues:
- Management Console: http://localhost:8084
- Developer Portal: http://localhost:8085
- Gateway Status: http://localhost:8082
- Documentation: https://docs.gravitee.io 