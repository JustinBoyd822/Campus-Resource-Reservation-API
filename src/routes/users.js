const express = require('express');
const router = express.Router();
const db = require('../db');
 
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users');
  res.json(rows);
});
 
router.post('/', async (req, res) => {
  const { full_name, email, role } = req.body;
 
  const [result] = await db.query(
    'INSERT INTO users (full_name, email, role) VALUES (?, ?, ?)',
    [full_name, email, role || 'student']
  );
 
  res.status(201).json({ user_id: result.insertId });
});
 
module.exports = router; 
