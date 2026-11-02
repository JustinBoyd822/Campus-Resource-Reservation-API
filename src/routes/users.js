const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');
const validate = require('../middleware/validateRequest');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const VALID_ROLES = ['user', 'admin'];

// Admin only. password_hash is deliberately left out of the response.
router.get('/', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT user_id, full_name, email, role, created_at FROM users'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Admin only. Regular users sign up through POST /auth/register instead.
router.post(
  '/',
  auth,
  requireRole('admin'),
  validate(['full_name', 'email', 'password']),
  async (req, res, next) => {
    try {
      const { full_name, email, password, role } = req.body;

      const newRole = role || 'user';
      if (!VALID_ROLES.includes(newRole)) {
        return res.status(400).json({ error: "role must be 'user' or 'admin'" });
      }
      if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const [result] = await db.query(
        'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [full_name, email, passwordHash, newRole]
      );

      res.status(201).json({ user_id: result.insertId });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
