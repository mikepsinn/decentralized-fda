# Integrating Keycloak Authentication

This guide explains how to integrate Keycloak authentication into your application within the Decentralized FDA project.

## Prerequisites

- Running Keycloak instance (available at `http://localhost:8080`)
- Access to the Keycloak admin console
- Your application codebase ready for authentication integration

## Step 1: Configure Keycloak

1. Log into the Keycloak Admin Console:
   - URL: `http://localhost:8080/admin`
   - Username: `admin`
   - Password: `admin`

2. Create a New Client:
   - Navigate to "Clients" → "Create client"
   - Fill in the following:
     ```
     Client type: OpenID Connect
     Client ID: your-app-name
     Name: Your App Name
     ```
   - Click "Next"

3. Configure Client Settings:
   ```
   Client authentication: On
   Authorization: On
   Valid redirect URIs: 
   - http://localhost:YOUR_APP_PORT/*
   Web origins: 
   - http://localhost:YOUR_APP_PORT
   ```

4. Save the client configuration and note down:
   - Client ID
   - Client Secret (found in the "Credentials" tab)

## Step 2: Frontend Integration

### For React Applications

1. Install required dependencies:
   ```bash
   npm install @react-keycloak/web keycloak-js
   ```

2. Create a Keycloak configuration file (`src/keycloak.js`):
   ```javascript
   import Keycloak from 'keycloak-js';

   const keycloakConfig = {
     url: 'http://localhost:8080',
     realm: 'dfda',
     clientId: 'your-app-name'
   };

   export const keycloak = new Keycloak(keycloakConfig);
   ```

3. Wrap your app with KeycloakProvider:
   ```javascript
   import { ReactKeycloakProvider } from '@react-keycloak/web';
   import { keycloak } from './keycloak';

   function App() {
     return (
       <ReactKeycloakProvider authClient={keycloak}>
         <YourAppComponents />
       </ReactKeycloakProvider>
     );
   }
   ```

4. Use authentication in components:
   ```javascript
   import { useKeycloak } from '@react-keycloak/web';

   function SecureComponent() {
     const { keycloak, initialized } = useKeycloak();

     if (!initialized) {
       return <div>Loading...</div>;
     }

     if (!keycloak.authenticated) {
       return <button onClick={() => keycloak.login()}>Login</button>;
     }

     return <div>Secure Content</div>;
   }
   ```

### For Angular Applications

1. Install dependencies:
   ```bash
   npm install keycloak-angular keycloak-js
   ```

2. Create a Keycloak service (`src/app/services/keycloak.service.ts`):
   ```typescript
   import { Injectable } from '@angular/core';
   import { KeycloakService } from 'keycloak-angular';

   @Injectable({
     providedIn: 'root'
   })
   export class KeycloakInitService {
     constructor(private keycloak: KeycloakService) {}

     async initialize() {
       await this.keycloak.init({
         config: {
           url: 'http://localhost:8080',
           realm: 'dfda',
           clientId: 'your-app-name'
         },
         initOptions: {
           onLoad: 'check-sso',
           checkLoginIframe: false
         }
       });
     }
   }
   ```

3. Initialize in `app.module.ts`:
   ```typescript
   import { APP_INITIALIZER, NgModule } from '@angular/core';
   import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
   import { KeycloakInitService } from './services/keycloak.service';

   function initializeKeycloak(
     keycloak: KeycloakInitService
   ) {
     return () => keycloak.initialize();
   }

   @NgModule({
     imports: [KeycloakAngularModule],
     providers: [
       {
         provide: APP_INITIALIZER,
         useFactory: initializeKeycloak,
         multi: true,
         deps: [KeycloakInitService]
       }
     ]
   })
   export class AppModule { }
   ```

## Step 3: Backend Integration

### For Node.js/Express Applications

1. Install dependencies:
   ```bash
   npm install keycloak-connect express-session
   ```

2. Configure Keycloak middleware:
   ```javascript
   const express = require('express');
   const session = require('express-session');
   const Keycloak = require('keycloak-connect');

   const app = express();

   // Session configuration
   const memoryStore = new session.MemoryStore();
   app.use(session({
     secret: 'some-secret',
     resave: false,
     saveUninitialized: true,
     store: memoryStore
   }));

   // Keycloak configuration
   const keycloak = new Keycloak({
     store: memoryStore
   }, {
     "realm": "dfda",
     "auth-server-url": "http://localhost:8080",
     "ssl-required": "external",
     "resource": "your-app-name",
     "confidential-port": 0,
     "clientId": "your-app-name",
     "clientSecret": "your-client-secret"
   });

   // Install Keycloak middleware
   app.use(keycloak.middleware());

   // Protect routes
   app.get('/protected', keycloak.protect(), (req, res) => {
     res.json({ message: 'Protected resource' });
   });
   ```

### For Spring Boot Applications

1. Add dependencies to `pom.xml`:
   ```xml
   <dependency>
       <groupId>org.keycloak</groupId>
       <artifactId>keycloak-spring-boot-starter</artifactId>
   </dependency>
   ```

2. Configure `application.properties`:
   ```properties
   keycloak.auth-server-url=http://localhost:8080
   keycloak.realm=dfda
   keycloak.resource=your-app-name
   keycloak.credentials.secret=your-client-secret
   keycloak.public-client=false
   keycloak.bearer-only=true
   ```

3. Configure security:
   ```java
   @Configuration
   @EnableWebSecurity
   class SecurityConfig extends KeycloakWebSecurityConfigurerAdapter {

       @Override
       protected void configure(HttpSecurity http) throws Exception {
           super.configure(http);
           http.authorizeRequests()
               .antMatchers("/public/**").permitAll()
               .anyRequest().authenticated();
       }

       @Autowired
       public void configureGlobal(AuthenticationManagerBuilder auth) {
           auth.authenticationProvider(keycloakAuthenticationProvider());
       }

       @Bean
       @Override
       protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
           return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
       }
   }
   ```

## Testing Authentication

1. Start your application
2. Try accessing a protected route
3. You should be redirected to the Keycloak login page
4. After successful login, you'll be redirected back to your application

## Common Issues and Troubleshooting

1. CORS Issues
   - Ensure Web Origins are properly configured in Keycloak client settings
   - Check that your application is using the exact URL specified in Valid Redirect URIs

2. Token Validation Failures
   - Verify client secret is correct
   - Check realm name and client ID in configuration
   - Ensure clocks are synchronized between Keycloak and your application

3. Redirect URI Mismatch
   - Double-check the redirect URI in Keycloak matches your application's callback URL
   - URLs must match exactly, including trailing slashes

## Security Best Practices

1. Always use HTTPS in production
2. Keep client secrets secure and never commit them to version control
3. Use environment variables for sensitive configuration
4. Implement proper token validation
5. Set appropriate token lifetimes
6. Regularly update dependencies

## Additional Resources

- [Keycloak Official Documentation](https://www.keycloak.org/documentation)
- [Keycloak JavaScript Adapter Documentation](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)
- [Spring Boot with Keycloak](https://www.keycloak.org/docs/latest/securing_apps/#_spring_boot_adapter) 