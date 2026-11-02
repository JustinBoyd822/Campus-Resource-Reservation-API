// Allows the request through only if the authenticated user has the required role.
// Must be used AFTER authMiddleware, which sets req.user.
module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};
