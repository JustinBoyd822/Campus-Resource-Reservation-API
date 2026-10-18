const express = require('express');
const router = express.Router();
const db = require('../db');
const validate = require('../middleware/validateRequest');

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM resources');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(['resource_name', 'resource_type']), async (req, res, next) => {
  try {
    const { resource_name, resource_type, location } = req.body;

    const [result] = await db.query(
      'INSERT INTO resources (resource_name, resource_type, location) VALUES (?, ?, ?)',
      [resource_name, resource_type, location || null]
    );

    res.status(201).json({ resource_id: result.insertId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
