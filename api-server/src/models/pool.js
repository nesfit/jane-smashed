'use strict';
const mariadb = require('mariadb');
const config = require('../../data/config')
const pool = mariadb.createPool(config.database);

module.exports = pool;