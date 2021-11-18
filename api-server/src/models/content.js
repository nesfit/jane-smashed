'use strict';
const pool = require('./pool');

/**
 * Method to extract the content which contains the details of all the logged known mining pool addresses
 * @returns {Readable} - A Readable stream of output
 */
module.exports.extractContent = async function() {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `SELECT a.id, a.address, s.fqdn, p.name as pool_name, p.url, pts.number as port_number, 
            c.name as crypto_name, c.abbreviation, c.url FROM addresses a INNER JOIN 
            servers s ON a.server_id = s.id INNER JOIN
            pools p ON s.pool_id = p.id INNER JOIN
            ports pts ON pts.server_id = s.id INNER JOIN
            cryptos c ON c.id = pts.crypto_id;`;
        return conn.queryStream(query);
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (conn) {conn.release()}
    }
}