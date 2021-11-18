'use strict';
const tokens = require('../models/token');
/**
 * Validate the incoming request to ensure it contains valid token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports.validateToken = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        const host = req.headers['hostname'];
        if (bearerHeader && host) {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            const valid = await tokens.validateToken(bearerToken, host);
            if (valid) {
                return next();
            }
        }
        // Forbidden
        return res.status(403).end();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }

}