
// Centralized error handler. Registered in app.js after all routes.
// Any route that calls next(err) ends up here.
//
// - Logs the error on the server (console) so it can be debugged.
// - Sends the same JSON shape every time: { "error": "<message>" }.
// - Never sends stack traces or database details to the client.
module.exports = (err, req, res, next) => {
  // If a response has already started, let Express close the connection.
  if (res.headersSent) {
    return next(err);
  }

  // Errors from express.json() (bad JSON body) carry status 400.
  const status = err.status || err.statusCode || 500;
  const timestamp = new Date().toISOString();

  // Full details stay on the server only.
  console.error(`[${timestamp}] ERROR ${status} ${req.method} ${req.originalUrl} - ${err.message}`);
  if (status >= 500 && err.stack) {
    console.error(err.stack);
  }

  // 4xx errors have safe, short messages. 5xx errors (like SQL failures)
  // could expose internals, so the client gets a generic message instead.
  let message;
  if (status >= 500) {
    message = 'Internal server error';
  } else if (err.type === 'entity.parse.failed') {
    message = 'Request body contains invalid JSON';
  } else {
    message = err.message || 'Bad request';
  }

  res.status(status).json({ error: message });
};
