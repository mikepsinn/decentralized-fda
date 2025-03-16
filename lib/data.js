const crypto = require('crypto');

const validateDataAccess = async (userRoles, studyId) => {
  const accessMap = {
    'RESEARCHER': 'READ_WRITE',
    'DATA_VIEWER': 'READ',
    'GUEST': null
  };

  const highestRole = userRoles.find(role => accessMap[role]) || 'GUEST';
  const accessLevel = accessMap[highestRole];

  return {
    hasAccess: !!accessLevel,
    accessLevel
  };
};

const encryptData = async (data) => {
  if (!data) {
    throw new Error('Invalid data for encryption');
  }

  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '0'.repeat(32), 'utf8');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), 'utf8'),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();
  return JSON.stringify({
    iv: iv.toString('hex'),
    data: encrypted.toString('hex'),
    tag: tag.toString('hex')
  });
};

const decryptData = async (encryptedString) => {
  const { iv, data, tag } = JSON.parse(encryptedString);
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '0'.repeat(32), 'utf8');
  
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data, 'hex')),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString('utf8'));
};

module.exports = {
  validateDataAccess,
  encryptData,
  decryptData
}; 