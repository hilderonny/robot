var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var binaryjs = require('binaryjs');
var speaker = require('speaker');
var spawn = require('child_process').spawn;

// Express application
var app = express();
app.use(express.static(__dirname + '/public'));

// HTTP Server
http.createServer(options, app).listen(80, function() {
    console.log('Running 80.');
});

// HTTPS server
var options = {
    key: fs.readFileSync('ssl.key'),
    cert: fs.readFileSync('ssl.crt')
};
var httpsServer = https.createServer(options, app);
httpsServer.listen(443, function() {
    console.log('Running 443.');
});

// Tonausgabe
var binaryServer = binaryjs.BinaryServer({server:httpsServer});
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

// Mikrofone
var ps = false;
app.get('/stream', function(_, res) {
    if (ps) {
        console.log('Killing previous recording');
        ps.kill();
    }
    console.log("Stream Start");
    res.set({'Content-Type':'audio/wav'});
    ps = spawn('arecord', ['-D', 'dmic_sv', '-c2', '-f', 'S32_LE']);
    ps.stderr.pipe(process.stdout);
    ps.stdout.pipe(res);
});
