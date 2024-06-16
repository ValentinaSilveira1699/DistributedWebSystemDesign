
var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');

var app = express();

app.use('/', indexRouter);
app.use('/img',express.static(path.join(__dirname,"public/img")));

const PORT  = process.env.PORT || 3050
app.listen(PORT,()=> console.info(`Server has started on ${PORT}`))


module.exports = app;