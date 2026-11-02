const express = require('express');

// Route files
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const resourcesRoutes = require('./routes/resources');
const reservationsRoutes = require('./routes/reservations');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. Parse JSON request bodies (must come before the routes)
app.use(express.json());

// 2. Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 3. API routes
app.use('/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/reservations', reservationsRoutes);

// 4. Error handler (must come last, after all the routes)
app.use(errorHandler);

module.exports = app;
