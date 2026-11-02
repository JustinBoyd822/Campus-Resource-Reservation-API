const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');
const validate = require('../middleware/validateRequest');

const SALT_ROUNDS = 10;

// POST /auth/register
// Creates a new user with a hashed password. Role is always 'user';
// an admin has to be promoted in the database.
router.post(
  '/register',
  validate(['full_name', 'email', 'password']),
  async (req, res, next) => {
    try {
      const { full_name, email, password } = req.body;

      if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const [result] = await db.query(
        'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [full_name, email, passwordHash, 'user']
      );

      res.status(201).json({ user_id: result.insertId, role: 'user' });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'A user with that email already exists' });
      }
      next(err);
    }
  }
);

// POST /auth/login
// Verifies email + password and returns a JWT.
router.post('/login', validate(['email', 'password']), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      'SELECT user_id, email, role, password_hash FROM users WHERE email = ?',
      [email]
    );

    const user = rows[0];

    // Same message for "no such user" and "wrong password" so the API
    // does not reveal which emails are registered.
    // Users with no password_hash (older seed data) cannot log in.
    const passwordMatches =
      user && user.password_hash
        ? await bcrypt.compare(String(password), user.password_hash)
        : false;

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
