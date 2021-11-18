'use strict';
const pool = require('./pool');
const jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;

/**
 * Verifies User name and Password combination to the one stored in server
 * @param {String} username 
 * @param {String} host
 * @returns {Promise<string>} - A compressed JWT token
 */
module.exports.createToken = async function (username, host) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM users WHERE name=?", [username]);
        const name = rows[0].name;
        const secret = uuid();
        const id = uuid();
        await conn.query("DELETE FROM tokens WHERE host=?", host);
        const token = jwt.sign({
            name: name,
            host: host,
            iss: "API-Server",
            keyid: id
        }, secret, {
            keyid: id,
            expiresIn: "1d"
        });
        const op = await conn.query("INSERT INTO tokens VALUES(?,?,?,?,?, NOW())", [id, username, host, secret, token]);
        if (op.affectedRows === 0) {
            throw new Error('Failed to insert token into database');
        }
        return token;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
}

/**
 * Validate the incoming token with the one stored in DB for corresponding host
 * @param {string} token 
 * @param {string} host 
 * @returns {Promise<boolean>} True or False
 */
module.exports.validateToken = async function (token, host) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM tokens WHERE host=?", host);
        if (rows.length > 1) {
            throw new Error('Too many token entry for a host exists');
        }
        if (rows.length === 0) {
            return false;
        }
        const tokenOut = jwt.verify(token, rows[0].secret);
        if (host === tokenOut.host && rows[0].token === token) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}
/**
 * Simple function to create token table on first run
 */
module.exports.initTokenTable = async function() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(`CREATE TABLE IF NOT EXISTS tokens (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            host VARCHAR(255) NOT NULL,
            secret VARCHAR(255) NOT NULL,
            token TEXT,
            generated_at DATETIME 
        );`);
        await conn.query(`DELETE FROM tokens;`);
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}