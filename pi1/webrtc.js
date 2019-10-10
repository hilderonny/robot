var socketio = require('socket.io');

var sockets = {};

function handleSocketConnect(newsocket) {
    console.log('WebRTC: Socket ' + newsocket.id + ' connected.');
    sockets[newsocket.id] = newsocket;
    newsocket.on('disconnect', function() {
        handleSocketDisconnect(newsocket);
    });
    newsocket.on('webrtcmessage', function (message) {
        handleMessage(newsocket, message);
    });
    newsocket.broadcast.emit('webrtcmessage', { type: 'socketconnected', socketid: newsocket.id });
    Object.keys(sockets).forEach(function(connectedsocketid) {
        if (connectedsocketid === newsocket.id) return;
        newsocket.emit('webrtcmessage', { type: 'socketconnected', socketid: connectedsocketid });
    });
}

function handleSocketDisconnect(socket) {
    console.log('WebRTC: Socket ' + socket.id + ' disconnected.');
    delete sockets[socket.id];
    socket.broadcast.emit('webrtcmessage', { type: 'socketdisconnected', socketid: socket.id });
}

function handleMessage(socket, message) {
    console.log('WebRTC: Socket ' + socket.id + ' sent a message of type ' + message.type);
    message.sourcesocketid = socket.id; // Damit der Empfaenger weiss, wo die Nachricht her kommt
    if (message.targetsocketid) {
        sockets[message.targetsocketid].emit('webrtcmessage', message);
    } else {
        socket.broadcast.emit('webrtcmessage', message);
    }
}

module.exports = function(server) {

    var io = socketio.listen(server);

    io.on('connection', handleSocketConnect);

};