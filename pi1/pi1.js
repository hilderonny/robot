var express = require('express');
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
var server = https.createServer(options, app).listen(443, function() {
  console.log('Running.');
});

// WebRTC server
webrtc(server);