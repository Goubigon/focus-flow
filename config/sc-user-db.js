const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_MATH,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



async function getUsers() {
  try {
    const [result] = await pool.query("SELECT * from math_users");
    //console.log(result);
    return result;

  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  getUsers
};