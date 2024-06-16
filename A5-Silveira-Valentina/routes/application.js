var path = require('path');
var express = require('express');
var router = express.Router();
let bodyParser = require("body-parser");

router.use(bodyParser.text({ type: "text/plain" })); 

var applicationController = require('../application/applicationController');
appController = new applicationController();

router.get('/', function(req, res, next) {
    html = appController.getApplicationPage();
    res.send(html);
});

router.get('/product', function(req, res, next) {
    if (req.query.filter) {

        const filteredProducts = appController.getProductsByTag(req.query.filter);
        filteredProducts.forEach(element => {
            console.log(element.tag)
            console.log(element)
        });
        res.send(filteredProducts);
    } else {
        const data = appController.getAllProducts();
        res.send(data);
    }
});

router.get('/product/:id', function(req, res, next) {
    // console.log(req.params.id)
    const json = appController.getProductById(req.params.id);
    res.send(json);
});

router.get('/filters', function(req, res, next) {
    data = appController.getAllFilters();
    res.send(data);
});

router.get('/search', function(req, res, next) {
    data = appController.getAllSearch();

    // console.log(data)
    if(req.query && req.query.searchvalue) {
        data = appController.getProductBySearchValue(req.query.searchValue);
    }
    else {
        data = appController.getAllProducts();
    }

    res.send(data);
});

// Shopping Cart Routes
router.get('/cart', function(req, res, next) {
    res.json(appController.getCart());
});

router.post('/cart/add', function(req, res, next) {
    console.log("adding to cart: " + req.body)
    res.json(appController.addToCart(req.body));
});

router.post('/cart/remove', function(req, res, next) {
    res.json(appController.removeFromCart(req.body));
});

router.get('/*', function(req, res, next) {
    html = appController.getApplicationPage();
    res.send(html);
});

module.exports = router;