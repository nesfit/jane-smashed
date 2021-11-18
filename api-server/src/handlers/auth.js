'use strict';
const users = require('../models/users');
const tokens = require('../models/token');
/**
 * Authenticate the incoming request which contains username and password
 * @param {*} req 
 * @param {*} res 
 * @returns response which contains bearer token if everything is valid
 */
module.exports.authenticate = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const host = req.body.hostname;
        if (!username || !password || !host) {
            return res.status(400).end();
        }
        const valid = await users.getUser(username, password, host);
        if (!valid) {
            return res.status(401).send('Unauthorised');
        }
        const token = await tokens.createToken(username, host);
        return res.status(200).send(token);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}