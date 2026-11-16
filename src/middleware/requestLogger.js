// Logs every incoming request: timestamp, HTTP method, and route path.
// Registered in app.js before all routes so nothing is missed.
module.exports = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};
