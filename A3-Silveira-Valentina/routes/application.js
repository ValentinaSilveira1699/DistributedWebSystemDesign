const express = require('express');
const path = require('path');
const router = express.Router();

const Application = require('../application/applicationController');

router.get('/', function(req, res) {
    const appController = new Application(req);
    const html = appController.getApplicationPage();
    res.send(html);
});

router.get('/search', function(req, res) {
    const appController = new Application(req);
    const html = appController.getApplicationPage();
    res.send(html);
});

router.get('/:title', function(req, res) {
    const appController = new Application(req);
    const html = appController.getContentPage();
    res.send(html);
});

module.exports = router;