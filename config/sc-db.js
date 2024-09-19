const mysql = require('mysql2/promise');
require('dotenv').config();

//create pool to database
//it's a collection of reusable connections 
const pool = mysql.createPool({
    //using environment variable
    //relative to the user running the code
    //also hides the values
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function getData(){
    try {
        const [result] = await pool.query("SELECT * from my_table");
        //console.log(result);
        return result;
        
      } catch (error) {
        console.error('Error:', error);
      }
}

async function getLine(id){
    try {
        //use `` (backticks) to write query on multiple lines
        //use ? instead of ${id} so mysql can catch errors/untrusted data
        //syntax name : prepared statement
        //sending sequel and values to DB separately
        const [result] = await pool.query(
            `SELECT * 
            from my_table 
            WHERE id = ?`
            , [id]);
        
        //returns the first val of array
        //there will be only one value anyway
        return result[0];
        
      } catch (error) {
        console.error('Error:', error);
      }
}

async function createLine(name, value){
    const [result] = await pool.query(`
        INSERT INTO my_table (name, value)
        VALUES (?, ?)
        `, [name, value]
    )
    //return the line that just got created
    //insertId is a property of object returned by mySQL
    return getLine(result.insertId)
}


module.exports = { getData, getLine, createLine };