const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function executeSQLFile(connection, filePath) {
    const sql = fs.readFileSync(filePath, 'utf-8');
    const statements = sql.split(/;\s*$/m); // Split by semicolon and remove empty strings
  
    for (const statement of statements) {
      if (statement.trim()) { // Skip empty statements
        await connection.query(statement);
      }
    }
  }

async function initializeDatabase() {
  let connection;

  try {
    connection = await pool.getConnection();

    // Check if the database exists
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [process.env.DB_NAME_MATH]);

    if (databases.length === 0) {
      console.log(`Database ${process.env.DB_NAME_MATH} does not exist. Creating and seeding...`);

      // Execute schema.sql statements
      await executeSQLFile(connection, path.join(__dirname, '../../db_installation/math_db_schema.sql'));

      // Execute seed.sql statements
      await executeSQLFile(connection, path.join(__dirname, '../../db_installation/math_user_credential_seed.sql'));
      await executeSQLFile(connection, path.join(__dirname, '../../db_installation/math_user_stat_seed.sql'));
      await executeSQLFile(connection, path.join(__dirname, '../../db_installation/math_session_parameters_seed.sql'));
      await executeSQLFile(connection, path.join(__dirname, '../../db_installation/math_session_seed.sql'));
      await executeSQLFile(connection, path.join(__dirname, '../../db_installation/math_answer_seed.sql'));


      console.log(`Database ${process.env.DB_NAME_MATH} created and seeded successfully.`);
    } else {
      console.log(`Database ${process.env.DB_NAME_MATH} already exists. Skipping creation.`);
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = initializeDatabase;
