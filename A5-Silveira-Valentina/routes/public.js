var express = require('express');
var router = express.Router();
const path = require("path");

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/*', function(req, res, next) {
    res.sendFile(path.resolve('public/' + req.url) );
});

module.exports = router;