var express = require('express');
var router = express.Router();
const path = require("path");

router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/index.html') );
});

router.get('/*', function(req, res, next) {
    res.sendFile(path.resolve('public/' + req.url) );
});



module.exports = router;