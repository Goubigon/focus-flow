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

async function getAnswers() {
  try {
    const [result] = await pool.query("SELECT * from answers");
    //console.log(result);
    return result;

  } catch (error) {
    console.error('Error:', error);
  }
}

async function getAnswer(id) {
  try {
    const [result] = await pool.query(
      `SELECT * 
          from Answers 
          WHERE id = ?`
      , [id]);
    return result[0];

  } catch (error) {
    console.error('Error:', error);
  }
}


async function createAnswer(
  leftOperation, mathOperation, rightOperation,
  qResult, qAnswer, isCorrect,
  qTime, qDate,
  minNumber, maxNumber, floatNumber, nNumber,
  additionCheck, subtractionCheck, multiplicationCheck) {

  try {
    const [result] = await pool.query(`
      INSERT INTO Answers (
        leftOperation, mathOperation, rightOperation, 
        qResult, qAnswer, isCorrect, 
        qTime, qDate, 
        minNumber, maxNumber, floatNumber, nNumber,
        additionCheck, subtractionCheck, multiplicationCheck)
      VALUES (
        ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?
      )
    `, [
      leftOperation, mathOperation, rightOperation,
      qResult, qAnswer, isCorrect,
      qTime, qDate,
      minNumber, maxNumber, floatNumber, nNumber,
      additionCheck, subtractionCheck, multiplicationCheck
    ]);

    return getAnswer(result.insertId); // Return the result if needed

  } catch (error) {
    console.error("Error creating answer:", error);
    throw error; // Rethrow the error if you want it to propagate
  }
}



module.exports = { getAnswers, getAnswer, createAnswer };