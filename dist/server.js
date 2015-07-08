
var express = require('express');
var logger = require('morgan');
var app = express();

app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.static(__dirname + '/'));////

app.listen(app.get('port'), function() {
});
