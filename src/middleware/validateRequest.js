// Checks that every required field is present and not empty.
// Returns 400 with a short message like: { "error": "start_time is required" }
module.exports = (requiredFields) => {
  return (req, res, next) => {
    const body = req.body || {};
    for (const field of requiredFields) {
      const value = body[field];
      const isMissing =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '');

      if (isMissing) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    next();
  };
};
