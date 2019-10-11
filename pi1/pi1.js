var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var webrtc = require('./webrtc');

// Express application
var app = express();
app.use(express.static(__dirname + '/public'));

// HTTPS server
var options = {
  key: fs.readFileSync('ssl.key'),
  cert: fs.readFileSync('ssl.crt')
};
var httpsServer = https.createServer(options, app).listen(443, function() {
  console.log('Running HTTPS.');
});
http.createServer(app).listen(80, function() {
  console.log('Running HTTP.');
});

// WebRTC server
webrtc(httpsServer);