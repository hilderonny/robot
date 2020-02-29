var express = require('express');
var https = require('https');
var fs = require('fs');
var binaryjs = require('binaryjs');
var spawn = require('child_process').spawn;
var PassThrough = require('stream').PassThrough;

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

var binaryServer = binaryjs.BinaryServer({server:server});
binaryServer.on('connection', function(client) {
    console.log("new connection...");
    var ps = null;
    client.on('stream', function(stream, meta) {
        console.log("Stream Start");
        ps = spawn('arecord', ['-D dmic_sv', '-c2', '-r 48000', '-f S32_LE', '-t wav', '-V stereo']);
        ps.stdout.pipe(stream);
    });
    client.on('close', function() {
        if ( ps != null ) {
            ps.kill();
            ps = null;
        }
        console.log("Connection Closed");
    });
});
