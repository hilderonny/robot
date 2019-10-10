var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();

var options = {
  key: fs.readFileSync('ssl.key'),
  cert: fs.readFileSync('ssl.crt')
};
https.createServer(options, app).listen(443);

app.use(express.static(__dirname + '/public'));