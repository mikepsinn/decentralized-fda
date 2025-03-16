# Contributing to Decentralized FDA

Thank you for your interest in contributing to the Decentralized FDA project! This document provides guidelines and instructions for setting up your development environment and contributing to the project.

## Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js (recommended version: 16.x or higher)
- Git

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/decentralized-fda.git
   cd decentralized-fda
   ```

2. Start the services:
   ```bash
   docker-compose up -d
   ```

3. Wait for all services to initialize (this may take a few minutes)

## Accessing the Services

### Management Console
- URL: `http://localhost:8084`
- Default credentials:
  - Username: `admin`
  - Password: `admin`
- **Important**: Change the default password after first login through:
  1. Profile icon → Settings → User Settings
  2. Update your password

### Developer Portal
- URL: `http://localhost:8085`
- Register a new account or use admin credentials

### API Gateway
- URL: `http://localhost:8082`
- Managed through the Management Console
- No direct login required

## Development Workflow

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test thoroughly

3. Commit your changes:
   ```bash
   git commit -m "feat: description of your changes"
   ```
   Please follow [Conventional Commits](https://www.conventionalcommits.org/) format

4. Push your changes and create a Pull Request

## Troubleshooting

### Service Status
Check if all services are running:
```bash
docker ps
```

### Viewing Logs
- Management API logs:
  ```bash
  docker logs gio_apim_management_api
  ```
- Gateway logs:
  ```bash
  docker logs gio_apim_gateway
  ```
- Portal UI logs:
  ```bash
  docker logs gio_apim_portal_ui
  ```

### Common Issues

1. Port conflicts
   - Ensure ports 8082, 8083, 8084, and 8085 are available
   - Stop any existing containers using these ports

2. Service initialization
   - Some services may take a few minutes to fully initialize
   - Check the logs if a service appears to be stuck

## Need Help?

If you need help or have questions:
1. Check existing issues in the repository
2. Create a new issue with detailed information about your problem
3. Tag it appropriately (e.g., `help wanted`, `question`)

## Code Style and Standards

- Follow existing code style and patterns
- Include appropriate documentation
- Add tests for new features
- Keep commits focused and atomic
- Use clear and descriptive commit messages

## License

By contributing to this project, you agree that your contributions will be licensed under its MIT license. 