const fs = require('fs');
const path = require("path");

class Application {
    constructor(req) {
        this.template = fs.readFileSync(path.resolve(__dirname, "template/application.template")).toString();
        this.content = fs.readFileSync(path.resolve(__dirname, "template/content.template")).toString();
        this.jsonData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "applicationData.json")));
        this.req = req;
    }

    getApplicationPage() {
        let boxes = "";
        this.jsonData.forEach(element => {
            boxes += `<div class="box">
                        <img src="/img/${element.image}" alt="${element.title}">
                        <h2>
                            <a href="/application/${encodeURIComponent(element.title)}" target="_blank">${element.title}</a>
                        </h2>
                        <p class="Description">${element.shortDescription}</p>
                    </div>`;
        });
        this.template = this.template.replace("{{boxes}}", boxes);
        return this.template;
    }

    getContentPage() {
        let item = decodeURIComponent(this.req.params.title);
        let selectedItem = this.jsonData.find(element => element.title === item);
        let box = "";

        if (selectedItem) {
            let currentIndex = this.jsonData.findIndex(element => element.title === item);
            let nextIndex = (currentIndex + 1) % this.jsonData.length;
            let previousIndex = (currentIndex - 1 + this.jsonData.length) % this.jsonData.length;
            let nextItem = this.jsonData[nextIndex];
            let previousItem = this.jsonData[previousIndex];
            let tagsHtml = this.generateTagsHtml(selectedItem.tags);

            box = `
                <div id="product-container">
                    <div class="image-container">
                        <img src="/img/${selectedItem.image}" alt="${selectedItem.title}">
                    </div>
                    <div class="description-container">
                        <h2>${selectedItem.title}</h2>
                        <p class="price">Price: $${selectedItem.price}</p>
                        <p>${selectedItem.longDescription}</p>
                        <ul id="tags">${tagsHtml}</ul>
                    </div>
                </div>
                <div class="navigation">
                    <a href="/application">Home Page</a>
                    <a href="/application/${encodeURIComponent(previousItem.title)}">Previous: ${previousItem.title}</a>
                    <a href="/application/${encodeURIComponent(nextItem.title)}">Next: ${nextItem.title}</a>
                </div>`;
        } else {
            box = '<p>Item not found</p>';
        }

        this.content = this.content.replace("{{box}}", box);
        return this.content;
    }

    generateTagsHtml(tagsString) {
        let tags = tagsString.split(',').map(tag => tag.trim());
        return tags.map(tag => `<li>${tag}</li>`).join('');
    }
}

module.exports = Application;
