const mysql = require('mysql2');
 
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password_here',
  database: 'campus_reservation',
  waitForConnections: true,
  connectionLimit: 10
});
 
module.exports = pool.promise();
