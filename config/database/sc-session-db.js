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


//PARAMETERS

async function getExactParams(mMinNumber, mMaxNumber, mFloatNumber, mNumber, mAddCheck, mSubCheck, mMultCheck, mMaxAnswerCount) {
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
      `, [mMinNumber, mMaxNumber, mFloatNumber, mNumber,
      mAddCheck, mSubCheck, mMultCheck, mMaxAnswerCount]);

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

    console.log("[DB session] Retrieved params with id : " + id)
    console.log(result[0])
    return result[0];

  }catch(err){
    console.error('Error : ', err);
  }
}

async function createParam(mMinNumber, mMaxNumber, mFloatNumber, mNumber, mAddCheck, mSubCheck, mMultCheck, mMaxAnswerCount) {
  try {
    const [result] = await pool.query(`
      INSERT INTO math_session_parameters (
      mMinNumber, mMaxNumber, 
      mFloatNumber, mNumber, 
      mAdditionCheck, mSubtractionCheck, mMultiplicationCheck, 
      mMaxAnswerCount)
      VALUES (?, ?, ?, ?, 
      ?, ?, ?, ?)
      `, [mMinNumber, mMaxNumber, 
        mFloatNumber, mNumber, 
        mAddCheck, mSubCheck, mMultCheck, 
        mMaxAnswerCount]);

    return getParamWithID(result.insertId);

  } catch (error) {
    console.error('Error:', error);
  }
}



//SESSIONS
async function createSession(userID, paramID, sessionDate) {
  try {
    const [result] = await pool.query(`
      INSERT INTO math_session (mUserIdentifier, mParametersIdentifier, mSessionDate) 
      VALUES (?, ?, ?)
      `, [userID, paramID, sessionDate]);

    return getSessionWithID(result.insertId);

  } catch (error) {
    console.error('Error:', error);
  }
}

async function getSessionWithID(id){
  try{
    const [result] = await pool.query(`
      SELECT * FROM math_session 
      WHERE mSessionIdentifier = ?
      `, [id]);

    return result[0];

  }catch(err){
    console.error('Error : ', err);
  }
}

async function updateSessionDuration(mSessionIdentifier) {
  try {
    console.log("mSessionIdentifier : " + mSessionIdentifier)
    const [result] = await pool.query(`
        UPDATE math_session
        SET mSessionDuration = (
            SELECT SUM(qTime)
            FROM math_answer
            WHERE mSessionIdentifier = ?
        )
        WHERE mSessionIdentifier = ?;
      `, [mSessionIdentifier, mSessionIdentifier]);

    return getSessionWithID(mSessionIdentifier);
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  getExactParams, getParamWithID, createParam, createSession, getSessionWithID, updateSessionDuration
};