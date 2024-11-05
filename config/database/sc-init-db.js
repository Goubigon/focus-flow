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
  console.log("Done executing : " + path.basename(filePath));
}

async function seedingDatabase(connection) {
  // Execute seed.sql statements
  await executeSQLFile(connection, path.join(__dirname, '../../db_installation/2_math_user_credential_seed.sql'));
  await executeSQLFile(connection, path.join(__dirname, '../../db_installation/3_math_user_stat_seed.sql'));
  await executeSQLFile(connection, path.join(__dirname, '../../db_installation/4_math_session_parameters_seed.sql'));
  await executeSQLFile(connection, path.join(__dirname, '../../db_installation/5_math_session_seed.sql'));
  await executeSQLFile(connection, path.join(__dirname, '../../db_installation/6_math_answer_seed.sql'));
}

async function initializeDatabase() {
  let connection;

  try {
    
    // Check if the database exists
    connection = await pool.getConnection();
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [process.env.DB_NAME_MATH]);

    if (databases.length === 0) {
      console.log(`Database ${process.env.DB_NAME_MATH} does not exist. Creating and seeding...`);
      await executeSQLFile(connection, path.join(__dirname, '../../db_installation/1_math_db_schema.sql'));
      await seedingDatabase(connection);
      console.log(`Database ${process.env.DB_NAME_MATH} created and seeded successfully.`);
    }

    else {
      console.log(`Database ${process.env.DB_NAME_MATH} already exists. Skipping creation.`);

      await connection.query(`USE ${process.env.DB_NAME_MATH}`);
      const [user_cred_table] = await connection.query("SELECT COUNT(*) AS count FROM math_user_credential");
      const [user_answer_table] = await connection.query('SELECT COUNT(*) AS count FROM math_answer');
      
      if (user_cred_table[0].count === 0 || user_answer_table[0].count < 200) {
        console.log(`Database ${process.env.DB_NAME_MATH} has no content, creating guest data...`);
        await seedingDatabase(connection);
      }
      else{
        console.log(`Database ${process.env.DB_NAME_MATH} already has guest data. Skipping seeding.`);
      }

    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {initializeDatabase};
