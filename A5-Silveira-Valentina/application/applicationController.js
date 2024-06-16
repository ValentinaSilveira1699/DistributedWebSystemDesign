var ApplicationModel = require('./ApplicationModel');
var applicationModel = new ApplicationModel();

class ApplicationController {
    constructor() {
        this.cart = [];
    }

    getAllProducts() {
        return applicationModel.getAllProducts();
    }

    getAllFilters() {
        return applicationModel.getAllFilters();
    }

    getAllSearch() {
        return applicationModel.getAllSearch();
    }

    getProductBySearchValue(searchValue) {
        return applicationModel.getProductBySearchValue(searchValue);
    }

    getProductById(id) {
        return applicationModel.getProductById(id);
    }

    getProductsByTag(tag) {
        var products = this.getAllProducts();
        return products.filter(product => product.tags.includes(tag));
    }

    getApplicationPage() {
        // Implement the logic to get content page here
        return "<html><body>Content Page</body></html>";
    }

    getCart() {
        let total = this.cart.reduce((sum, product) => sum + product.price, 0);
        return { products: this.cart, total };
    }

    addToCart(productId) {
        console.log("in application controller: " + productId);
    
        let productExists = this.cart.some(product => product.id == productId);
        
        if (productExists) {
            return this.getCart();
        }
        
        let product = this.getProductById(productId);
        this.cart.push(product);
        console.log(this.cart);
        return this.getCart();
    }

    removeFromCart(productId) {
        console.log("deleting product: " + productId)
        this.cart = this.cart.filter(product => product.id !== parseInt(productId));
        return this.getCart();
    }
}

module.exports = ApplicationController;