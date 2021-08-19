const util = require('util');
const mysql = require('mysql');
/**
 * Connection to the database.
 *  */
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'test.cnzirv97gxkx.eu-west-2.rds.amazonaws.com',
    user: 'admin', // use your mysql username.
    password: 'chelseaApp', // user your mysql password.
    database: 'test'
});

pool.getConnection((err, connection) => {
    if(err) 
        console.error("Something went wrong connecting to the database ...");
    
    if(connection)
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;
