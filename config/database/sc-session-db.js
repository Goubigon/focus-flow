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



async function getExactParams(minNumber, maxNumber, floatNumber, nNumber, additionCheck, subtractionCheck, multiplicationCheck, maxAnswerCount) {
  try {
    const [result] = await pool.query(`
      SELECT mParametersIdentifier
      FROM math_session_parameters
      WHERE mMinNumber = ? AND
       mMaxNumber = ? AND
       mFloatNumber = ? AND
       mNumber = ? AND
       mAdditionCheck = ? AND
       mSubtractionCheck = ? AND
       mMultiplicationCheck = ? AND
       mMaxAnswerCount = ?
      `, [minNumber, maxNumber, floatNumber, nNumber,
      additionCheck, subtractionCheck, multiplicationCheck, maxAnswerCount]);

    if (result.length === 0) {
      return 0;
    }

    return result[0].mParametersIdentifier;

  } catch (error) {
    console.error('Error:', error);
  }
}

async function getParamWithID(id){
  try{
    const [result] = await pool.query(`
      SELECT * FROM math_session_parameters 
      WHERE mParametersIdentifier = ?
      `, [id]);

    return result[0];

  }catch(err){
    console.error('Error : ', err);
  }
}

async function createParam(minNumber, maxNumber, floatNumber, nNumber, additionCheck, subtractionCheck, multiplicationCheck, maxAnswerCount) {
  try {
    const [result] = await pool.query(`
      INSERT INTO math_session_parameters (mMinNumber, mMaxNumber, mFloatNumber, mNumber, mAdditionCheck, mSubtractionCheck, mMultiplicationCheck, mMaxAnswerCount)
      VALUES (?, ?, ?, ?, 
      ?, ?, ?, ?)
      `, [minNumber, maxNumber, floatNumber, nNumber,
      additionCheck, subtractionCheck, multiplicationCheck, maxAnswerCount]);

    return getParamWithID(result.insertId);

  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  getExactParams, getParamWithID, createParam
};