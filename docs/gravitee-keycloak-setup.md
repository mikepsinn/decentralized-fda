# Setting up Keycloak Integration with Gravitee

## Overview

This guide explains how to integrate Keycloak authentication with Gravitee API Management. This integration enables:
- Single Sign-On (SSO) for the Management UI and Portal UI
- OAuth2/OpenID Connect authentication for APIs
- Unified user management

## Step 1: Configure Keycloak

1. Log into Keycloak Admin Console:
   - URL: http://localhost:8080
   - Username: admin
   - Password: admin

2. Create a new realm for Gravitee:
   - Click "Create Realm"
   - Name: `gravitee`
   - Click "Create"

3. Create clients for Gravitee components:

   a. Management UI Client:
   ```
   Client ID: gravitee-management
   Client Protocol: openid-connect
   Root URL: http://localhost:8084
   Valid redirect URIs: http://localhost:8084/*
   Web Origins: http://localhost:8084
   Access Type: confidential
   ```

   b. Portal UI Client:
   ```
   Client ID: gravitee-portal
   Client Protocol: openid-connect
   Root URL: http://localhost:8085
   Valid redirect URIs: http://localhost:8085/*
   Web Origins: http://localhost:8085
   Access Type: confidential
   ```

4. Create roles:
   - ORGANIZATION_ADMIN
   - ENVIRONMENT_ADMIN
   - API_PUBLISHER
   - API_DEVELOPER
   - USER

5. Create a test user:
   - Username: gravitee-admin
   - Email: admin@example.com
   - Password: password
   - Assign role: ORGANIZATION_ADMIN

## Step 2: Configure Gravitee

1. Update Management API configuration:

```yaml
security:
  providers:
    - type: oauth2
      configuration:
        clientId: gravitee-management
        clientSecret: <your-client-secret>
        tokenEndpoint: http://keycloak:8080/realms/gravitee/protocol/openid-connect/token
        authorizationEndpoint: http://localhost:8080/realms/gravitee/protocol/openid-connect/auth
        userInfoEndpoint: http://keycloak:8080/realms/gravitee/protocol/openid-connect/userinfo
        accessTokenProperty: access_token
        authorizationHeader: "Bearer %s"
        mapping:
          id: sub
          email: email
          firstname: given_name
          lastname: family_name
          roles: roles
```

2. Update Management UI configuration:

```yaml
authentication:
  oauth2:
    clientId: gravitee-management
    clientSecret: <your-client-secret>
    authorizeEndpoint: http://localhost:8080/realms/gravitee/protocol/openid-connect/auth
    tokenEndpoint: http://localhost:8080/realms/gravitee/protocol/openid-connect/token
    userInfoEndpoint: http://localhost:8080/realms/gravitee/protocol/openid-connect/userinfo
    logoutEndpoint: http://localhost:8080/realms/gravitee/protocol/openid-connect/logout
    scope: ["openid", "profile", "email"]
```

3. Update Portal UI configuration:

```yaml
authentication:
  oauth2:
    clientId: gravitee-portal
    clientSecret: <your-client-secret>
    authorizeEndpoint: http://localhost:8080/realms/gravitee/protocol/openid-connect/auth
    tokenEndpoint: http://localhost:8080/realms/gravitee/protocol/openid-connect/token
    userInfoEndpoint: http://localhost:8080/realms/gravitee/protocol/openid-connect/userinfo
    logoutEndpoint: http://localhost:8080/realms/gravitee/protocol/openid-connect/logout
    scope: ["openid", "profile", "email"]
```

## Step 3: Update Docker Compose

Add the following environment variables to the services:

```yaml
  management_api:
    environment:
      - gravitee_security_providers_0_type=oauth2
      - gravitee_security_providers_0_configuration_clientId=gravitee-management
      - gravitee_security_providers_0_configuration_clientSecret=<your-client-secret>
      - gravitee_security_providers_0_configuration_tokenEndpoint=http://keycloak:8080/realms/gravitee/protocol/openid-connect/token
      - gravitee_security_providers_0_configuration_authorizationEndpoint=http://localhost:8080/realms/gravitee/protocol/openid-connect/auth
      - gravitee_security_providers_0_configuration_userInfoEndpoint=http://keycloak:8080/realms/gravitee/protocol/openid-connect/userinfo

  management_ui:
    environment:
      - GRAVITEEIO_SECURITY_TYPE=oauth2
      - GRAVITEEIO_SECURITY_OAUTH2_CLIENT_ID=gravitee-management
      - GRAVITEEIO_SECURITY_OAUTH2_CLIENT_SECRET=<your-client-secret>
      - GRAVITEEIO_SECURITY_OAUTH2_AUTHORIZE_ENDPOINT=http://localhost:8080/realms/gravitee/protocol/openid-connect/auth
      - GRAVITEEIO_SECURITY_OAUTH2_TOKEN_ENDPOINT=http://localhost:8080/realms/gravitee/protocol/openid-connect/token
      - GRAVITEEIO_SECURITY_OAUTH2_USERINFO_ENDPOINT=http://localhost:8080/realms/gravitee/protocol/openid-connect/userinfo
      - GRAVITEEIO_SECURITY_OAUTH2_LOGOUT_ENDPOINT=http://localhost:8080/realms/gravitee/protocol/openid-connect/logout

  portal_ui:
    environment:
      - GRAVITEEIO_SECURITY_TYPE=oauth2
      - GRAVITEEIO_SECURITY_OAUTH2_CLIENT_ID=gravitee-portal
      - GRAVITEEIO_SECURITY_OAUTH2_CLIENT_SECRET=<your-client-secret>
      - GRAVITEEIO_SECURITY_OAUTH2_AUTHORIZE_ENDPOINT=http://localhost:8080/realms/gravitee/protocol/openid-connect/auth
      - GRAVITEEIO_SECURITY_OAUTH2_TOKEN_ENDPOINT=http://localhost:8080/realms/gravitee/protocol/openid-connect/token
      - GRAVITEEIO_SECURITY_OAUTH2_USERINFO_ENDPOINT=http://localhost:8080/realms/gravitee/protocol/openid-connect/userinfo
      - GRAVITEEIO_SECURITY_OAUTH2_LOGOUT_ENDPOINT=http://localhost:8080/realms/gravitee/protocol/openid-connect/logout
```

## Step 4: Testing the Integration

1. Restart all services:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

2. Access the Management UI (http://localhost:8084):
   - You should be redirected to Keycloak login
   - Log in with the gravitee-admin user
   - Verify you have admin access

3. Access the Portal UI (http://localhost:8085):
   - You should be redirected to Keycloak login
   - Log in with any user account
   - Verify appropriate access levels

## Troubleshooting

1. **Login Redirect Issues**
   - Check client configuration in Keycloak
   - Verify redirect URIs match exactly
   - Check network connectivity between containers

2. **Authorization Issues**
   - Verify role mappings in Keycloak
   - Check user has appropriate roles assigned
   - Verify client scopes in Keycloak

3. **Network Issues**
   - Ensure Keycloak is accessible from Gravitee containers
   - Check container DNS resolution
   - Verify port mappings

## Security Considerations

1. **Production Setup**
   - Use HTTPS for all endpoints
   - Configure secure session settings
   - Use strong client secrets
   - Enable Keycloak security features

2. **Role Management**
   - Create specific roles for different access levels
   - Use role mappings for fine-grained control
   - Regularly audit user roles and permissions

## Additional Resources

- [Gravitee Security Documentation](https://docs.gravitee.io/apim/3.x/apim_installguide_authentication.html)
- [Keycloak Server Administration](https://www.keycloak.org/docs/latest/server_admin/)
- [OAuth2 Configuration Guide](https://docs.gravitee.io/apim/3.x/apim_installguide_authentication_oauth2.html) 