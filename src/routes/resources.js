const express = require('express');
const router = express.Router();
const db = require('../db');
 
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM resources');
  res.json(rows);
});
 
router.post('/', async (req, res) => {
  const { resource_name, resource_type, location } = req.body;
 
  const [result] = await db.query(
    'INSERT INTO resources (resource_name, resource_type, location) VALUES (?, ?, ?)',
    [resource_name, resource_type, location]
  );
 
  res.status(201).json({ resource_id: result.insertId });
});
 
module.exports = router; 
