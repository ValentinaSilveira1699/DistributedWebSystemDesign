var path = require('path');
var express = require('express');
var router = express.Router();

var Application = require('../application/applicationController');

router.get('/', function(req, res, next) {
    const appController = new Application(req);
    const html = appController.getApplicationPage();
    res.send(html);
});

router.get('/*', function(req, res, next) {
    const appController = new Application(req);
    const html = appController.getContentPage();
    res.send(html);
});

module.exports = router;
