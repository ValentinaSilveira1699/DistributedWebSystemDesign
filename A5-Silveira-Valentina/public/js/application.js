class PageModel {
    makeRequest(method, url, callback) {
        const xhttp = new XMLHttpRequest();
        xhttp.open(method, url, true);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) { 
                if (xhttp.status === 200) {
                    try {
                        const response = JSON.parse(xhttp.responseText);
                        this.products = response;
                        callback(null, response);
                    } catch (error) {
                        callback(`Failed to parse response: ${error.message}`);
                    }
                } else {
                    callback(`Request failed with status: ${xhttp.status}`);
                }
            }
        };
        xhttp.send();
        return this.products;
    }

    

    getProducts(callback) {
        this.makeRequest("GET", "http://localhost:3050/application/product", callback);
    }

    getFilters(callback) {
        this.makeRequest("GET", "http://localhost:3050/application/filters", callback);
    }

    getProductById(productId, callback) {
        this.makeRequest("GET", `http://localhost:3050/application/product/${productId}`, callback);
    }

    getProductByTag(tag, callback) {
        this.makeRequest("GET", `http://localhost:3050/application/product?filter=${tag}`, callback);
    }

    getProductBySearchValue(searchValue, callback) {
        this.makeRequest("GET", `http://localhost:3050/application/search?searchvalue=${searchValue}`, callback);
    }

    getCartItems(callback) {
        this.makeRequest("GET", "http://localhost:3050/application/cart", callback);
    }

    addToCart(productId, callback) {
        console.log("Sending request to add product to cart, product ID:", productId);
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3050/application/cart/add", true);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "text/plain");
        // console.log(body)
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    callback(null, JSON.parse(xhttp.responseText));
                } else {
                    callback(`Request failed with status: ${xhttp.status}`);
                }
            }
        };
        xhttp.send(productId);
    }

    removeFromCart(productId, callback) {
        console.log("Sending request to remove product from cart, product ID:", productId);
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3050/application/cart/remove", true);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "text/plain");
        // console.log("Request body:", body); 
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    console.log("removing item: "+ productId)
                    callback(null, JSON.parse(xhttp.responseText));
                } else {
                    callback(`Request failed with status: ${xhttp.status}`);
                }
            }
        };
        xhttp.send(productId);
    }

    getCart(callback) {
        this.makeRequest("GET", "http://localhost:3050/application/cart", callback);
    }
}


class PageView {
    constructor(pageController) {
        this.pageController = pageController;
    }

    createMainPage(products) {
        let boxContainer;
        let resultsCounter;
        if (document.getElementById("box-container")){
            boxContainer = document.getElementById("box-container");
            resultsCounter = document.getElementById("results-counter");
        } else {
            document.querySelector("#content").innerHTML = ""
            boxContainer = document.createElement("div");
            boxContainer.id = "box-container";
            boxContainer.className = "box-container"

            resultsCounter = document.createElement("div");
            resultsCounter.id = "results-counter"
        }
        
        

        boxContainer.innerHTML = products.map(product => `
            <div class="box">
                <img src="/img/${product.image}" alt="${product.title}">
                <h2><a href="#" onclick="app.showProduct('${product.id}'); return false;">${product.title}</a></h2>
                <p class="Description">${product.shortDescription}</p>
            </div>
        `).join('');
        document.querySelector("#content").append(resultsCounter)
        document.querySelector("#content").append(boxContainer)
        resultsCounter.innerText = `${products.length} product${products.length !== 1 ? 's' : ''} shown`;
    }

    createProductPage(product) {
        console.log("product page")        
        let productHtml = `
                    <div id="product-container">
                <div class="image-container">
                    <img src="/img/${product.image}" alt="${product.title}">
                </div>
                <div class="product-details">
                    <div class="title-container">
                        <h2>${product.title}</h2>
                        <button id="addToCart" class="cart-button">
                            <img src="/img/cart.png"></img>
                        </button>
                    </div>
                    <div class="description-container">
                        <p class="price">Price: $${product.price}</p>
                        <p>${product.longDescription}</p>
                        <ul id="tags">
                            ${product.tags.map(tag => `<li>${tag}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="navigation">
                <a href="#" onclick="app.createMainPage(); return false;">Home Page</a>
                <a href="#" onclick="app.showProduct(${product.id - 1}); return false;" id="previousProduct">Previous</a>
                <a href="#" onclick="app.showProduct(${product.id + 1}); return false;" id="nextProduct">Next</a>
            </div>`;

        document.querySelector("#content").innerHTML = productHtml;

        document.querySelector("#nextProduct").addEventListener("click",function(){
            let nextNum = product.id + 1;
            app.showProduct(nextNum)
        });

        document.querySelector("#previousProduct").addEventListener("click",function(){
            let previousNum = product.id - 1;
            app.showProduct(previousNum)
        });

        document.querySelector("#addToCart").addEventListener("click", function() {
            console.log("Add to Cart button clicked for product ID:", product.id);
            app.addToCart(product.id);
        });

        document.getElementById("tags").classList.add("tags");
    }

    updateFilters(tagCounts) {
        const filtersHtml = `<a href="#" onclick="app.createMainPage(); return false;">Remove All Filters</a>` +
            Object.entries(tagCounts).map(([tag, count]) => 
                `<a class="tags" href="#" onclick="app.showFiltered('${tag}'); return false;">${tag} (${count})</a>`
            ).join('');

        document.getElementById("filters").innerHTML = filtersHtml;
    }

    updateProductCountWithSearch(count, searchTerm) {
        const resultsCount = document.getElementById("results-counter");
        if (searchTerm) {
            resultsCount.innerText = `${count} results shown using search term '${searchTerm}'`;
        } else {
            resultsCount.innerText = `${count} results shown`;
        }
    }

    updateProductCountWithFilter(count, filter) {
        const resultsCount = document.getElementById("results-counter");
        if (filter) {
            resultsCount.innerText = `${count} products shown for filter '${filter}'`;
        } else {
            resultsCount.innerText = `${count} products shown`;
        }
    }

    createCart(cart) {
        const cartItems = document.getElementById("cart-items");
        const cartTotal = document.getElementById("total-price");
        
        cartItems.innerHTML = cart.products.map(product => `
            <div class="cart-items">
                <p>${product.title} - $${product.price}</p>
                <button id="remove-button" onclick="app.removeFromCart(${product.id});" id="removeItem">Remove</button>
            </div>
        `).join('');
        
        cartTotal.innerText = `Total: $${cart.total.toFixed(2)}`;
    }
}

class PageController {
    constructor(pageModel, pageView) {
        this.pageModel = pageModel;
        this.pageView = pageView;


        document.getElementById('search-button').addEventListener('click', () => this.search());

        this.createMainPage();
        this.updateFilters();
        this.showCart();
    }

    createMainPage() {
        this.pageModel.getProducts((error, data) => {
            if (error) {
                console.error(error);
            } else {
                this.pageView.createMainPage(data);
                this.updateFilters();
            }
        });
    }

    showProduct(productId) {
        this.pageModel.getProductById(productId, (error, data) => {
            if (error) {
                console.error(error);
            } else {
                this.pageView.createProductPage(data);
                // return data
            }
        });
    }

    findProduct(productId) {
        return new Promise((resolve, reject) => {
            this.pageModel.getProductById(productId, (error, data) => {
                if (error) {
                    console.error(error);
                    reject(error); // Reject the promise if there's an error
                } else {
                    console.log(data.title);
                    resolve(data.title); // Resolve the promise with the title
                }
            });
        });
    }

    showFiltered(tag) {
        this.pageModel.getProductByTag(tag, (error, data) => {
            if (error) {
                console.error(error);
            } else {
                this.pageView.createMainPage(data);
                this.pageView.updateProductCountWithFilter(data.length, tag);
                this.updateFilters();
            }
        });
    }

    search() {
        let searchval = document.getElementById("searchValue").value.trim();

        this.pageModel.getProducts((error, data) => {
            if (error) {
                console.error(error);
                return;
            }

            let filteredData = [];
            for (let i = 0; i < data.length; i++) {
                let product = data[i];
                if (product.shortDescription.toLowerCase().includes(searchval) || 
                    product.longDescription.toLowerCase().includes(searchval)) {
                    filteredData.push(product);
                }
            }

            this.pageView.createMainPage(filteredData);
            this.pageView.updateProductCountWithSearch(filteredData.length, searchval);
        });
    }

    showCart(){
        this.pageModel.getCart((error,data) => {
            if (error){
                console.log(error)
            } else {
                this.pageView.createCart(data)
            }
        })
    }

    addToCart(productId) {
        this.pageModel.addToCart(productId, (error, cartData) => {
            if (error) {
                console.error(error);
            } else {
                this.pageView.createCart(cartData);
            }
        });
    }

    removeFromCart(productId) {
        this.pageModel.removeFromCart(productId, (error, cartData) => {
            if (error) {
                console.error(error);
            } else {
                this.pageView.createCart(cartData);
            }
        });
    }

    updateCart() {
        this.pageModel.getCartItems((error, cartItems) => {
            if (error) {
                console.error(error);
            } else {
                this.pageView.updateCart(cartItems);
            }
        });
    }

    updateFilters() {
        this.pageModel.getFilters((error, data) => {
            if (error) {
                console.error(error);
            } else {
                this.pageView.updateFilters(data);
            }
        });
    }
}

const app = new PageController(new PageModel(), new PageView());