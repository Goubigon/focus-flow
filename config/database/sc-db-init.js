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
    connection = await pool.getConnection();

    const [math_db] = await connection.query('SHOW DATABASES LIKE ?', [process.env.DB_NAME_MATH]);
    if (math_db.length > 0) {
      console.log(`Database ${process.env.DB_NAME_MATH} exists.`);
      await connection.query(`USE ${process.env.DB_NAME_MATH}`);

      const [user_cred_table] = await connection.query('SHOW TABLES LIKE ?', ['math_user_credential']);
      if (user_cred_table.length > 0) {
        console.log(`Table math_user_credential exists.`);

        const [user_cred_rows] = await connection.query("SELECT COUNT(*) AS count FROM math_user_credential");
        const [user_answer_rows] = await connection.query('SELECT COUNT(*) AS count FROM math_answer');

        if (user_cred_rows[0].count > 0 && user_answer_rows[0].count > 200) {
          console.log(`Database ${process.env.DB_NAME_MATH} already has guest data. Skipping seeding.`);
        }
        else { // no data
          console.log(`Table math_user_credential has no content, creating guest data...`);
          await seedingDatabase(connection);
        }

      }
      else { // no tables
        console.log(`Database ${process.env.DB_NAME_MATH} doesn't have tables. Creating and seeding...`);
        await executeSQLFile(connection, path.join(__dirname, '../../db_installation/1_math_db_schema.sql'));
        await seedingDatabase(connection);
        console.log(`Tables created successfully.`);
      }
    }
    else { // no database
      console.log(`Database ${process.env.DB_NAME_MATH} doesn't exist. Creating and seeding...`);
      await executeSQLFile(connection, path.join(__dirname, '../../db_installation/1_math_db_schema.sql'));
      await seedingDatabase(connection);
      console.log(`Database ${process.env.DB_NAME_MATH} created and seeded successfully.`);
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { initializeDatabase };
