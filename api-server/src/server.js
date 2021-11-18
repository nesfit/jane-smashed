'use strict';
const express = require('express');
const app = express();
const router = require('./routes');
const startup = require('./startup');
app.use(express.json());
router(app);
startup().then(() => {
    app.listen(80, () => {
        console.log('Started on port 80');
    });
}).catch((rej) => {
    console.error(rej)
})
