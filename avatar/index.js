var fs = require('fs'); // For reading certificate files
var express = require('express'); // Webserver
var https = require('https'); // WebRTC needs SSL connections
var socketio = require('socket.io'); // Broadcast handshake messages

var httpsPort = 443; // Change to your needs

var app = express();
app.use(express.static(__dirname + '/public')); // Serve HTML files from ./public directory

// Prepare SSL certificates for server. Will result in browser warning about untrusted certificates, but it is okay for local tests
var credentials = { 
    key: fs.readFileSync('./priv.key', 'utf8'), 
    cert: fs.readFileSync('./pub.cert', 'utf8')
};

// Prepare HTTPS server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(httpsPort, () => { // Start HTTPS server
    console.log(`HTTPS server is running at port ${httpsPort}.`);
});

// Motorensteuerung vorbereiten
var motors = require('./motors');
motors.init();

// Limits und sowas festlegen
var headsettings = {
    rotation: { channel: 14, min: 800, center: 1600, max: 2500 },
    tilt: { channel: 13, min: 800, center: 1350, max: 2100 },
    mouth: { channel: 15, min: 1050, center: 1050, max: 1500 },
};

var mouthPositions = [headsettings.mouth.min, headsettings.mouth.max];
var currentMouthPosision = 0;
function speakInterval() {
    currentMouthPosision = (currentMouthPosision + 1) % mouthPositions.length;
    motors.setPulse(headsettings.mouth.channel, mouthPositions[currentMouthPosision]);
}
var speakIntervalPointer = null;

// List of connected sockets for direct messaging
var sockets = {};
// Prepare websockets and bind them to the HTTPS server
var io = socketio.listen(httpsServer);
// Handle incoming connections
io.on('connection', (socket) => {
    sockets[socket.id] = socket; // Remember connected socket
    socket.on('disconnect', () => {
        delete sockets[socket.id];
        console.log(`Socket ${socket.id} disconnected.`);
        // Inform other clients that the peer has disconnected
        socket.broadcast.emit('Message', {
            type: 'WebRTCclientDisconnected',
            content: socket.id
        });
    });
    // Motoren zentrieren
    socket.on('Center', () => {
        Object.values(headsettings).forEach((setting) => {
            motors.setPulse(setting.channel, setting.center);
        });
    });
    // Handle motor steering
    // message.key: 'rotation', 'tilt' or 'mouth'
    // message.value: 800 .. 2500
    // TODO: In Gradzahlen umbauen, die werden vom Headset gesendet (oder?) oder halt auf Clientseite umrechnen, ist vermutlich performanter
    socket.on('Steer', (message)  => {
        Object.keys(message).forEach((key) => {
            var value = message[key];
            var setting = headsettings[key];
            if (setting && setting.min <= value <= setting.max) motors.setPulse(setting.channel, value);
        });
    });
    socket.on('StartSpeak', () => {
        speakIntervalPointer = setInterval(speakInterval, 250);
        speakInterval();
    });
    socket.on('StopSpeak', () => {
        if (!speakIntervalPointer) return;
        clearInterval(speakIntervalPointer);
        motors.setPulse(headsettings.mouth.channel, headsettings.mouth.min);
    });
    // Handle incoming messages with tag "Message"
    socket.on('Message', (message) => {
        message.from = socket.id;
        if (message.type === 'WebRTCclientName') {
            socket.name = message.content;
        }
        if (message.to) { // Direct message to other peer
            var s = sockets[message.to];
            if (s) s.emit('Message', message);
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
