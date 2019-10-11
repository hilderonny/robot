// Socket.IO einbinden
var knownsocketidscript  = document.createElement('script');
knownsocketidscript.src = '/socket.io/socket.io.js';
document.head.appendChild(knownsocketidscript);

// events: socketconnected, socketdisconnected, deviceslisted, remotestream, remotedevicelist
var WebRTC = new EventTarget();

window.addEventListener('load', function() {

    var knownsocketids = {};
    var ownsocket = io();

    var connections = {};

    var audioAvailable = false;
    var videoAvailable = false;
    var audioDevices = [];
    var videoDevices = [];

    async function addLocalDevicesToConnection(connection, deviceIdOnly) {
        for (var i = 0; i < videoDevices.length; i++) {
            var videoDevice = videoDevices[i];
            if (deviceIdOnly && videoDevice.deviceId !== deviceIdOnly) continue;
            try {
                var stream = await navigator.mediaDevices.getUserMedia({ video: { 
                    deviceId: videoDevice.deviceId,
                    width: { exact: 1920 },
                    height: { exact: 1080 }
                 } });
                var tracks = stream.getTracks();
                for (var j = 0; j < tracks.length; j++) {
                    connection.addTrack(tracks[j], stream);
                }
            } catch (error) {
                console.error(error.name + ': ' + error.message);
            }
        }
        for (var i = 0; i < audioDevices.length; i++) {
            var audioDevice = audioDevices[i];
            if (deviceIdOnly && audioDevice.deviceId !== deviceIdOnly) continue;
            try {
                var stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: audioDevice.deviceId } });
                var tracks = stream.getTracks();
                for (var j = 0; j < tracks.length; j++) {
                    connection.addTrack(tracks[j], stream);
                }
            } catch (error) {
                console.error(error.name + ': ' + error.message);
            }
        }
    }

    WebRTC.connect = async function(targetsocketid, targetdeviceid) {
        console.log('WebRTC Connecting ' + targetsocketid + ' / ' + targetdeviceid + '...');
        var connection = new RTCPeerConnection(null);
        connection.targetdeviceid = targetdeviceid;
        var connectionId = ownsocket.id + targetdeviceid + Date.now();
        connections[connectionId] = connection;

        connection.onicecandidate = function(event) {
            if (!event.candidate) return;
            ownsocket.emit('webrtcmessage', { 
                type: 'icecandidate', 
                targetsocketid: targetsocketid,
                connectionId: connectionId,
                iceCandidate: event.candidate
            });
        };

        connection.onaddstream = function(event) {
            var stream = event.stream;
            WebRTC.dispatchEvent(new CustomEvent('remotestream', { detail: stream }));
        };

        await addLocalDevicesToConnection(connection);

        // Damit onicecandidate funktioniert, hier eine Anpassung: https://stackoverflow.com/a/27758788
        // Damit kann man Offers machen, auch wenn man keinen lokalen Stream bereit stellt
        var localSessionDescription = await connection.createOffer({
            offerToReceiveAudio: true, // Zwingt die Gegenstelle, Ton bereit zu stellen
            offerToReceiveVideo: true, // Zwingt die Gegenstelle, Bild bereit zu stellen
        });
        connection.setLocalDescription(localSessionDescription);
        ownsocket.emit('webrtcmessage', { 
            type: 'connect', 
            targetsocketid: targetsocketid,
            deviceId: targetdeviceid,
            connectionId: connectionId,
            sessionDescription: localSessionDescription
        });

    };

    function handleSocketConnect(socketid) {
        console.log('WebRTC Socket ID ' + socketid + ' added to known socket ids');
        knownsocketids[socketid] = {};
        WebRTC.dispatchEvent(new CustomEvent('socketconnected', { detail: socketid }));
        // Infos über verfügbare Geräte senden
        ownsocket.emit('webrtcmessage', { 
            type: 'devicelist', 
            targetsocketid: socketid,
            audioDevices: audioDevices,
            videoDevices: videoDevices            
        });
    }

    function handleSocketDisconnect(socketid) {
        console.log('WebRTC Socket ID ' + socketid + ' removed from known socket ids');
        delete knownsocketids[socketid];
        WebRTC.dispatchEvent(new CustomEvent('socketdisconnected', { detail: socketid }));
    }

    async function handleIncomingConnection(sourcesocketid, deviceId, remoteConnectionId, remoteSessionDescription) {
        console.log('WebRTC Connection incoming from: ', sourcesocketid);
        var connection = new RTCPeerConnection(null);
        connection.setRemoteDescription(new RTCSessionDescription(remoteSessionDescription));
        connections[remoteConnectionId] = connection;

        connection.onicecandidate = function(event) {
            if (!event.candidate) return;
            ownsocket.emit('webrtcmessage', { 
                type: 'icecandidate', 
                targetsocketid: sourcesocketid,
                connectionId: remoteConnectionId,
                iceCandidate: event.candidate
            });
        };

        await addLocalDevicesToConnection(connection, deviceId);

        var localSessionDescription = await connection.createAnswer();
        connection.setLocalDescription(localSessionDescription);
        var data = { 
            type: 'acceptconnection', 
            targetsocketid: sourcesocketid,
            connectionId: remoteConnectionId,
            sessionDescription: localSessionDescription
        };
        console.log('WebRTC Accepting connection with: ', data);
        ownsocket.emit('webrtcmessage', data);
    }

    function handleConnectionAccepted(connectionId, remoteSessionDescription) {
        console.log('WebRTC Connection accepted for connection: ', connectionId);
        var connection = connections[connectionId];
        connection.setRemoteDescription(new RTCSessionDescription(remoteSessionDescription));
    }

    function handleIceCandidate(connectionId, remoteIceCandidate) {
        console.log('WebRTC Getting ICE candidate for connection: ', connectionId);
        var connection = connections[connectionId];
        connection.addIceCandidate(new RTCIceCandidate(remoteIceCandidate));
    }

    function handleDeviceList(sourcesocketid, audioDevices, videoDevices) {
        // Das muss die Anwendung entscheiden
        WebRTC.dispatchEvent(new CustomEvent('remotedevicelist', { detail: {
            socketid: sourcesocketid,
            audioDevices: audioDevices,
            videoDevices: videoDevices
        } }));
    }

    ownsocket.on('connect', async function() {
        console.log('WebRTC Connectd as socket ' + ownsocket.id);

        ownsocket.on('webrtcmessage', function(message) {
            console.log('WebRTC message received', message);
            switch (message.type) {
                case 'socketconnected': handleSocketConnect(message.socketid); break;
                case 'socketdisconnected': handleSocketDisconnect(message.socketid); break;
                case 'connect': handleIncomingConnection(message.sourcesocketid, message.deviceId, message.connectionId, message.sessionDescription); break;
                case 'acceptconnection': handleConnectionAccepted(message.connectionId, message.sessionDescription); break;
                case 'icecandidate': handleIceCandidate(message.connectionId, message.iceCandidate); break;
                case 'devicelist': handleDeviceList(message.sourcesocketid, message.audioDevices, message.videoDevices); break;
            }
        });

        // Mikrofone und Kameras ermitteln, dabei Berechtigungen beachten
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            audioAvailable = true;
        } catch (error) {
            console.error('Kein Zugriff auf Mikrofon möglich: ' + error.message);
        }
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            videoAvailable = true;
        } catch (error) {
            console.error('Kein Zugriff auf Kamera möglich: ' + error.message);
        }
        var devices = await navigator.mediaDevices.enumerateDevices();
        for (var i = 0; i < devices.length; i++) {
            var device = devices[i];
            if (device.kind === 'audioinput' && audioAvailable) audioDevices.push(device);
            else if (device.kind === 'videoinput' && videoAvailable) videoDevices.push(device);
        }
        console.log('WebRTC audio and video devices determined: ', audioDevices, videoDevices);

        WebRTC.dispatchEvent(new CustomEvent('deviceslisted', { detail: { audioDevices: audioDevices, videoDevices: videoDevices } }));

    });

});