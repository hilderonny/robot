var express = require('express');
var https = require('https');
var fs = require('fs');
var socketio = require('socket.io');
var ss = require('socket.io-stream');
var speaker = require('speaker');
var stream = require('stream');

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
    var spk = new speaker({
        channels: 2,
        bitDepth: 16,
        sampleRate: 44100
    });
    socket.on('audio', function(data) {
        var readable = new stream.Readable(); // https://stackoverflow.com/a/35672668
        //readable.pipe(spk);
        var values = Object.values(data);
        //var buf = (new Float32Array(values)).buffer;
        var array8 = new Uint8Array(values);
        //readable.push(array8);
        spk.write(array8);
        values.forEach(val => {
//            readable.push(val);
        });
//        var buf = Float32Array.from(values).buffer;
//        console.log(buf);
//        spk.write(buf);
        //console.log(data);
    });
    ss(socket).on('audiostream', function(stream) {
        stream.on('data', function(chunk) {
            //spk.write(chunk);
            //console.log(chunk);
        });
        stream.pipe(spk);
    });
});