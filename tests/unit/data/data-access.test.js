const { validateDataAccess, encryptData, decryptData } = require('../../../lib/data');

describe('Data Access Unit Tests', () => {
  describe('validateDataAccess', () => {
    test('should validate researcher access to study data', async () => {
      const userRoles = ['RESEARCHER'];
      const studyId = 'study123';
      const result = await validateDataAccess(userRoles, studyId);
      expect(result.hasAccess).toBe(true);
      expect(result.accessLevel).toBe('READ_WRITE');
    });

    test('should deny access to unauthorized users', async () => {
      const userRoles = ['GUEST'];
      const studyId = 'study123';
      const result = await validateDataAccess(userRoles, studyId);
      expect(result.hasAccess).toBe(false);
    });
  });

  describe('Data Encryption', () => {
    const testData = {
      patientId: '12345',
      diagnosis: 'Test Diagnosis',
      medications: ['Med1', 'Med2']
    };

    test('should encrypt sensitive data', async () => {
      const encrypted = await encryptData(testData);
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toContain(testData.patientId);
    });

    test('should decrypt data correctly', async () => {
      const encrypted = await encryptData(testData);
      const decrypted = await decryptData(encrypted);
      expect(decrypted).toEqual(testData);
    });

    test('should handle invalid encryption data', async () => {
      await expect(encryptData(null)).rejects.toThrow('Invalid data for encryption');
    });
  });
}); 