var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var binaryjs = require('binaryjs');
var speaker = require('speaker');
var spawn = require('child_process').spawn;

var app = express();
app.use(express.static(__dirname + '/public')); // Serve HTML files from ./public directory

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
    });
    // Handle incoming messages with tag "Message"
    socket.on('Message', (message) => {
        message.from = socket.id;
        if (message.type === 'WebRTCclientName') {
            socket.name = message.content;
        }
        if (message.to) { // Direct message to other peer
            sockets[message.to].emit('Message', message);
            console.log(`Sent message type "${message.type}" from ${message.from} to ${message.to}`);
        } else { // Broadcast message
            socket.broadcast.emit('Message', message);
            console.log(`Sent message type "${message.type}" from ${message.from} to all other`);
        }
    });
    console.log(`Socket ${socket.id} connected.`);
    socket.broadcast.emit('Message', { // Inform all other peers about new connection
        type: 'WebRTCclientConnected',
        content: socket.id
    });
    socket.emit('Message', { // Send list of already connected clients to new peer
        type: 'WebRTCclientList',
        content: Object.keys(sockets).filter((id) => id !== socket.id).map((id) => {
            return { id: id, name: sockets[id].name }
        })
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
