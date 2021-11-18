'use strict';
const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const content = require('../handlers/content.js');

router.get('/content', middleware.validateToken, content.getContent);

module.exports = router;