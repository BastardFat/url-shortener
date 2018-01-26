const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())


app.use(express.static(__dirname + '/static/html'));

var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress(__dirname + '/views//partials', '.mustache'));
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');


app.use('/', require('./routers'));


app.listen(process.env.PORT || 3000, () => console.log('App started on port 3000'));
