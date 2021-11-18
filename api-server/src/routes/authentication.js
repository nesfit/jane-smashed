'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../handlers/auth.js');

router.post('/authenticate', auth.authenticate);

module.exports = router;