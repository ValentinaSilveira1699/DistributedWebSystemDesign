const express = require('express');
const path = require('path');
const Application = require('./application/applicationController'); 

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Route for the main application page
app.get('/application', (req, res) => {
    const applicationInstance = new Application(req); 
    const pageContent = applicationInstance.getApplicationPage();
    res.send(pageContent);
});

// Route for individual product pages
app.get('/application/:title', (req, res) => {
    const applicationInstance = new Application(req); 
    const contentPage = applicationInstance.getContentPage();
    res.send(contentPage);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});