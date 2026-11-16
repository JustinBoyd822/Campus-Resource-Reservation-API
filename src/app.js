const express = require('express');

// Route files
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const resourcesRoutes = require('./routes/resources');
const reservationsRoutes = require('./routes/reservations');

// Middleware
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. Request logger (first, so every request is logged, even ones that fail)
app.use(requestLogger);

// 2. Parse JSON request bodies (must come before the routes)
app.use(express.json());

// 3. Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 4. API routes
app.use('/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/reservations', reservationsRoutes);

// 5. Unknown routes: forward a 404 to the error handler
app.use((req, res, next) => {
  const err = new Error('Route not found');
  err.status = 404;
  next(err);
});

// 6. Error handler (must come last, after all the routes)
app.use(errorHandler);

module.exports = app;
