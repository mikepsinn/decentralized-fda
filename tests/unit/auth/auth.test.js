const { verifyToken, hasPermission, getRoles } = require('../../../lib/auth');

describe('Authentication Unit Tests', () => {
  describe('verifyToken', () => {
    test('should verify valid JWT token', async () => {
      const mockToken = 'valid.mock.token';
      const result = await verifyToken(mockToken);
      expect(result).toBeTruthy();
      expect(result.sub).toBeDefined();
    });

    test('should reject expired token', async () => {
      const expiredToken = 'expired.mock.token';
      await expect(verifyToken(expiredToken)).rejects.toThrow('Token expired');
    });
  });

  describe('hasPermission', () => {
    test('should check user permissions correctly', () => {
      const userRoles = ['RESEARCHER', 'DATA_VIEWER'];
      expect(hasPermission(userRoles, 'VIEW_DATA')).toBe(true);
      expect(hasPermission(userRoles, 'ADMIN')).toBe(false);
    });
  });

  describe('getRoles', () => {
    test('should extract roles from JWT token', async () => {
      const mockToken = 'valid.mock.token';
      const roles = await getRoles(mockToken);
      expect(Array.isArray(roles)).toBe(true);
      expect(roles).toContain('RESEARCHER');
    });
  });
}); 