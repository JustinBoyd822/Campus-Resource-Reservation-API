const express = require('express');
const router = express.Router();
const db = require('../db');
const validate = require('../middleware/validateRequest');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM reservations');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  validate(['user_id', 'resource_id', 'start_time', 'end_time']),
  async (req, res, next) => {
    try {
      const { user_id, resource_id, start_time, end_time } = req.body;

      // Rule 1: end time must be after start time
      const start = new Date(start_time);
      const end = new Date(end_time);
      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ error: 'start_time and end_time must be valid dates' });
      }
      if (end <= start) {
        return res.status(400).json({ error: 'end_time must be after start_time' });
      }

      // Rule 2: users cannot reserve nonexistent resources
      const [resources] = await db.query(
        'SELECT resource_id FROM resources WHERE resource_id = ?',
        [resource_id]
      );
      if (resources.length === 0) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      // Rule 3: duplicate/overlapping reservations for the same resource are rejected
      const [conflicts] = await db.query(
        `SELECT reservation_id FROM reservations
         WHERE resource_id = ? AND status = 'active'
           AND start_time < ? AND end_time > ?`,
        [resource_id, end_time, start_time]
      );
      if (conflicts.length > 0) {
        return res.status(409).json({ error: 'Resource is already reserved for that time window' });
      }

      const [result] = await db.query(
        `INSERT INTO reservations (user_id, resource_id, start_time, end_time)
         VALUES (?, ?, ?, ?)`,
        [user_id, resource_id, start_time, end_time]
      );

      res.status(201).json({ reservation_id: result.insertId });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
