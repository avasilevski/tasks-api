var express = require('express');
var router = express.Router();
require("dotenv").config();


router.get('/', (req, res, next) => {
    res.render('index.pug', {title: 'Tasks API Documentation'});
});

module.exports = router;