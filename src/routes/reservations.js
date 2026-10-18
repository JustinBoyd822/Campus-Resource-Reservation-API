const express = require('express');
const router = express.Router();
const db = require('../db');
 
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM reservations');
  res.json(rows);
});
 
router.post('/', async (req, res) => {
  const { user_id, resource_id, start_time, end_time } = req.body;
 
  const [result] = await db.query(
    `INSERT INTO reservations (user_id, resource_id, start_time, end_time)
     VALUES (?, ?, ?, ?)`,
    [user_id, resource_id, start_time, end_time]
  );
 
  res.status(201).json({ reservation_id: result.insertId });
});
 
module.exports = router;
