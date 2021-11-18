'use strict';
const content = require('../models/content');
const Stream = require('stream/promises')

const { Transform } = require('json2csv');

/**
 * Handler to stream the content file to the agent
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getContent = async (req, res) => {
    try {
        const transformOpts = { objectMode: true };
        const csvStream = new Transform({}, transformOpts);
        const rowStream = await content.extractContent();
    
        res.attachment('content.csv');
        res.status(200);
        await Stream.pipeline(rowStream, csvStream, res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

}