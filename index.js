var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var mongoose = require('mongoose');
mongoose.connect('mongodb://nh-db-admin:mongo4life@ds049084.mongolab.com:49084/nh-db');

require('./models/add_test_data');
require('./routes/routes.js')(app);

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function () {
    console.log('app is listening on port', app.get('port'));
});
