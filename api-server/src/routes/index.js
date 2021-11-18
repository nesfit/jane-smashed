'use strict';
const authentication = require('./authentication.js');
const downloadContent = require('./downloadContent');
module.exports = (app) => {
    app.use(authentication);
    app.use(downloadContent);
}