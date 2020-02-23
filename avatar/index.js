var express = require('express');
var https = require('https');
var fs = require('fs');
var socketio = require('socket.io');

// Express application
var app = express();
app.use(express.static(__dirname + '/public'));

// HTTPS server
var options = {
    key: fs.readFileSync('ssl.key'),
    cert: fs.readFileSync('ssl.crt')
};
var server = https.createServer(options, app);
server.listen(443, function() {
    console.log('Running.');
});

// Websockets
var io = socketio(server);
io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('audio', function(data) {
        console.log(data);
    });
});