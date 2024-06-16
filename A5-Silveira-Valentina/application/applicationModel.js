const fs = require('fs');

class applicationModel {
    constructor() {
        this.initialize();
    }

    //initialize the bookList with books
    initialize() {
        this.products = JSON.parse(fs.readFileSync('./application/applicationData.json'));

        this.filters = this.generateFilters();
    }

    generateFilters() {
        const filters = {};
        this.products.forEach(product => {
            product.tags.forEach(tag => {
                if (filters[tag]) {
                    filters[tag]++;
                } else {
                    filters[tag] = 1;
                }
            });
        });
        return filters;
    }

    getAllProducts() {
        return this.products;
    }

    getAllFilters() {
        return this.filters;
    }

    getAllSearch() {
        return this.search;
    }

    getProductById(id) {
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id == id) {
                const product = this.products[i];
                const nextProductId = this.products[i + 1] ? this.products[i + 1].id : null;
                return { ...product, nextProductId };
            }
        }
        return null;
    }

    getProductBySearchValue(searchValue) {
        let filteredData = [];
            for (let i = 0; i < data.length; i++) {
                let product = data[i];
                if (product.short_description.toLowerCase().includes(searchValue) || 
                    product.long_description.toLowerCase().includes(searchValue)) {
                    filteredData.push(product);
                }
            }
        return filteredData;
    }
}

module.exports = applicationModel;