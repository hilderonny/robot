var express = require('express');
var https = require('https');
var fs = require('fs');
var binaryjs = require('binaryjs');
var speaker = require('speaker');

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
    var spk = null;
    client.on('stream', function(stream, meta) {
        console.log("Stream Start@" + meta.sampleRate +"Hz");
        spk = new speaker({
            channels: 1,
            bitDepth: 16,
            sampleRate: meta.sampleRate
        });
        stream.pipe(spk);
    });
    client.on('close', function() {
        if ( spk != null ) {
            spk.close();
        }
        console.log("Connection Closed");
    });
});
