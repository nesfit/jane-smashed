'use strict';
const pool = require('./pool');
const bcrypt = require('bcrypt');

/**
 * Verifies User name and Password combination to the one stored in server
 * @param {String} username 
 * @param {String} password 
 * @returns {Promise<boolean>} - True or False
 */
module.exports.getUser = async function(username, password) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE name=?",[username]);
        if (rows.length > 1) {
            throw new Error('Multiple Users detected');
        }
        return await bcrypt.compare(password, rows[0].password);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
}
