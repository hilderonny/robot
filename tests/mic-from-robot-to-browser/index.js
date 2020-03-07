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

var ps = false;

app.get('/stream', function(req, res) {
    if (ps) {
        console.log('Killing previous recording');
        ps.kill();
    }
    console.log("Stream Start");
    res.set({'Content-Type':'audio/wav'});
    ps = spawn('arecord', ['-D', 'dmic_sv', '-c2', '-r', '48000', '-f', 'S32_LE', '-t', 'wav', '-V', 'stereo']);
    ps.stderr.pipe(process.stdout);
    ps.stdout.pipe(res);
});
