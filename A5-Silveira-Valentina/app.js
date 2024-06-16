
var express = require('express');
var path = require('path');
const PORT = 3050;

var applicationRouter = require('./routes/application');

var publicRouter = require('./routes/public');

var app = express();
app.use(express.urlencoded({extended:true}));

app.use('/application/', applicationRouter);
app.use('/', publicRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});