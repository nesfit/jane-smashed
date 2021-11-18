'use strict';
const tokens = require('./models/token');

async function init() {
    await tokens.initTokenTable()
}

module.exports = init;