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


//Temp function for auth test
async function getUsername(username){
  try {
    const [result] = await pool.query("SELECT * from math_users WHERE mUsername=?",[username]);
    //console.log(result);
    return result;

  } catch (error) {
    console.error('Error:', error);
  }
}

async function getUser(id){
  try{
    const [result] = await pool.query(`
      SELECT *
      FROM math_users
      WHERE id = ?
      `, [id]);
      return result[0];
  }
  catch(error){
    console.error('Error : ', error);
  }
}

async function getHashedPassword(email){
  try{
    const [result] = await pool.query(`
      SELECT mHashedPassword
      FROM math_users 
      WHERE mEmail=? 
      `, [email]);
    return result[0].mHashedPassword;
  }
  catch(error){
    console.error('Error : ', error);
  }
}

async function createUser(name, email, hashedPassword, role) {
  try {
    const [result] = await pool.query(`
      INSERT INTO math_users (
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

async function checkDuplicateEmail(email){
  try{
    const [result] = await pool.query(`
      SELECT *
      FROM math_users
      WHERE mEmail = ?
      `, [email]);
      return result.length > 0;
  }
  catch(error){
    console.error('Error : ', error);
    throw error; 
  }
}


module.exports = {
  getUsers, getUser, createUser, checkDuplicateEmail, getHashedPassword, getUsername
};