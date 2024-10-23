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
    const [result] = await pool.query("SELECT * from math_user_credential");
    //console.log(result);
    return result;

  } catch (error) {
    console.error('Error:', error);
  }
}


//Temp function for auth test
async function getUsername(username) {
  try {
    const [result] = await pool.query("SELECT * from math_user_credential WHERE mUsername=?", [username]);
    //console.log(result);
    return result;

  } catch (error) {
    console.error('Error:', error);
  }
}

//temp function for auth test
async function getUserWithEmail(email) {
  try {
    const [result] = await pool.query("SELECT * from math_user_credential WHERE mEmail=?", [email]);
    //console.log(result);
    return result[0];

  } catch (error) {
    console.error('Error:', error);
  }
}

async function getUser(id) {
  try {
    const [result] = await pool.query(`
      SELECT *
      FROM math_user_credential
      WHERE mUserIdentifier = ?
      `, [id]);
    return result[0];
  }
  catch (error) {
    console.error('Error : ', error);
  }
}

async function deleteUser(id) {
  try {
    const [result] = await pool.query(`
      DELETE 
      FROM math_user_credential 
      WHERE mUserIdentifier = ?
      `, [id]);
    return result.affectedRows > 0;
  }
  catch (error) {
    console.error('Error : ', error);
  }
}

async function getHashedPassword(email) {
  try {
    const [result] = await pool.query(`
      SELECT mHashedPassword
      FROM math_user_credential 
      WHERE mEmail=? 
      `, [email]);
    return result[0].mHashedPassword;
  }
  catch (error) {
    console.error('Error : ', error);
  }
}

async function createUser(name, email, hashedPassword, role) {
  try {
    const [result] = await pool.query(`
      INSERT INTO math_user_credential (
        mUsername, mEmail, 
        mHashedPassword, mRole)
      VALUES (?, ?, 
        ?, ?)
      `, [
      name, email,
      hashedPassword, role
    ]);

    return getUser(result.insertId);
  }
  catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function createUserStat(mUserIdentifier) {
  try {
    const [result] = await pool.query(`
      INSERT INTO math_user_stat (mUserIdentifier) VALUES (?)
      `, [mUserIdentifier]);

    return true;
  }
  catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function incrementLogNumber(mUserIdentifier) {
  try {
    const [result] = await pool.query(`
      UPDATE math_user_stat
      SET mLogNumber = mLogNumber + 1
      WHERE mUserIdentifier = ?
      `, [mUserIdentifier]);

    return true;
  }
  catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function checkDuplicateEmail(email) {
  try {
    const [result] = await pool.query(`
      SELECT *
      FROM math_user_credential
      WHERE mEmail = ?
      `, [email]);
    return result.length > 0;
  }
  catch (error) {
    console.error('Error : ', error);
    throw error;
  }
}

async function incrementSessionCountInStat(mUserIdentifier) {
  try {
    const [result] = await pool.query(`
      UPDATE math_user_stat
      SET mSessionCount = mSessionCount + 1
      WHERE mUserIdentifier = ?
      `, [mUserIdentifier]);

    return true;
  } catch (error) {
    console.error('Error:', error);
  }
}



async function changeLastSessionDateInStat(mSessionIdentifier, lastDate) {
  try {
    const [result] = await pool.query(`
        UPDATE math_user_stat
        SET mLastSessionDate = ?
        WHERE mUserIdentifier = ?
      `, [lastDate, mSessionIdentifier]);

    return true;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function updateTotalSessionTime(mUserIdentifier) {
  try {
    const [result] = await pool.query(`
        UPDATE math_user_stat
        SET mTotalSessionTime = (
            SELECT SUM(mSessionDuration)
            FROM math_session
            WHERE mUserIdentifier = ?
        )
        WHERE mUserIdentifier = ?;
      `, [mUserIdentifier, mUserIdentifier]);

    console.log("updated total session time")
    return getUser(mUserIdentifier);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getUserSessionData(mUserIdentifier) {
  try {
    const [result] = await pool.query(`
        SELECT 
            DATE(mSessionDate) AS sessionDateGroup, 
            FORMAT(SUM(mSessionDuration), 2) AS durationSum
        FROM 
            math_session
        WHERE 
            mUserIdentifier = ?
        GROUP BY 
            sessionDateGroup
        ORDER BY 
            sessionDateGroup;
      `, [mUserIdentifier]);


    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getUserSessionCountByDay(mUserIdentifier) {
  try {
    const [result] = await pool.query(`
        SELECT 
            DATE(mSessionDate) AS sessionDateGroup, 
            COUNT(mSessionIdentifier) AS sessionCount
        FROM 
            math_session
        WHERE 
            mUserIdentifier = ?
        GROUP BY 
            sessionDateGroup
        ORDER BY 
            sessionDateGroup;
      `, [mUserIdentifier]);


    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getLatestResults(mUserIdentifier) {
  try {
    const [result] = await pool.query(`
        SELECT 
            SUM(CASE WHEN isCorrect = 1 THEN 1 ELSE 0 END) AS CorrectCount,
            SUM(CASE WHEN isCorrect = 0 THEN 1 ELSE 0 END) AS IncorrectCount
        FROM 
            math_answer
        WHERE mSessionIdentifier = (
              SELECT mSessionIdentifier 
              FROM math_session 
              WHERE mUserIdentifier = ? 
              ORDER BY mSessionDate DESC LIMIT 1);
      `, [mUserIdentifier]);


    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}


async function getResultsByDay(mUserIdentifier) {
  try {
    const [result] = await pool.query(`
        SELECT 
          DATE(ms.mSessionDate) AS sessionDateGroup,
          SUM(CASE WHEN isCorrect = 1 THEN 1 ELSE 0 END) AS CorrectCount,
            SUM(CASE WHEN isCorrect = 0 THEN 1 ELSE 0 END) AS IncorrectCount
        FROM math_answer ma 
        JOIN math_session ms ON ma.mSessionIdentifier = ms.mSessionIdentifier 
        WHERE ms.mUserIdentifier = ?
        GROUP BY 
            sessionDateGroup
        ORDER BY 
            sessionDateGroup;
      `, [mUserIdentifier]);


    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}


async function getResultByLevel(mUserIdentifier, level) {
  try {
    const [result] = await pool.query(`
        SELECT ms.mSessionIdentifier, ms.mSessionDate, ms.mSessionDuration,
          SUM(CASE WHEN isCorrect = 1 THEN 1 ELSE 0 END) AS CorrectCount,
            SUM(CASE WHEN isCorrect = 0 THEN 1 ELSE 0 END) AS IncorrectCount
        FROM math_answer ma 
        JOIN math_session ms ON ma.mSessionIdentifier = ms.mSessionIdentifier 
        WHERE ms.mUserIdentifier = ? AND  ms.mParametersIdentifier = ?
        GROUP BY ms.mSessionIdentifier
        ORDER BY ms.mSessionDate ASC;
      `, [mUserIdentifier, level]);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}



module.exports = {
  getUsers, getUser, createUser, checkDuplicateEmail, getHashedPassword, getUsername,
  getUserWithEmail, deleteUser, createUserStat,
  incrementLogNumber, incrementSessionCountInStat, changeLastSessionDateInStat, updateTotalSessionTime,
  getUserSessionData, getUserSessionCountByDay,
  getLatestResults, getResultsByDay, getResultByLevel
};