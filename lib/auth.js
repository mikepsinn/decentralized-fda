const jwt = require('jsonwebtoken');

const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw error;
  }
};

const hasPermission = (userRoles, requiredPermission) => {
  const permissionMap = {
    'VIEW_DATA': ['RESEARCHER', 'DATA_VIEWER', 'ADMIN'],
    'ADMIN': ['ADMIN']
  };
  return userRoles.some(role => permissionMap[requiredPermission]?.includes(role));
};

const getRoles = async (token) => {
  const decoded = await verifyToken(token);
  return decoded.roles || [];
};

module.exports = {
  verifyToken,
  hasPermission,
  getRoles
}; 