module.exports = (requiredFields) => {
  return (req, res, next) => {
    const body = req.body || {};
    for (const field of requiredFields) {
      if (!body[field]) {
        return res.status(400).json({
          error: `Missing required field: ${field}`
        });
      }
    }
    next();
  };
};
