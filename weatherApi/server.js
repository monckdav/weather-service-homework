var express = require('express');
var	app = express();
var	port = process.env.PORT || 3001;
var	bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.listen(port);

var routes = require('./api/routes/routes')(app); // importing route

console.log('RESTful API server started on port: ' + port);