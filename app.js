var express		= require('express')
var app 		= express();

// app.get('/', function(req, res) {

// });

app.use(express.static(__dirname + '/public'));

if(app.listen(3000)) console.log('App Listening on ' + '3000');
