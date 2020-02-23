function startrecording() {
  navigator.mediaDevices.getUserMedia({audio: true}).then(function(mediaStream) {
    console.log(mediaStream.getAudioTracks()[0].getSettings());
    var audioCtx = new window.AudioContext();
    var sourceNode = audioCtx.createMediaStreamSource(mediaStream);
    var recorder = audioCtx.createScriptProcessor(4096, 1, 1);
    recorder.onaudioprocess = function(evt) {
      var inputBuffer = evt.inputBuffer;
      var data = inputBuffer.getChannelData(0);
      var buf = (new Float32Array(data)).buffer;
      var array8 = new Uint8Array(buf);
    socket.emit('audio', array8);
//      console.log(data);
    }
    sourceNode.connect(recorder);
    recorder.connect(audioCtx.destination);
  }, function(err) {
    console.log(err);
  });
}

function startstreamrecording() {
  navigator.mediaDevices.getUserMedia({audio: true}).then(function(mediaStream) {
    console.log(mediaStream);
    var audioCtx = new window.AudioContext();
    var sourceNode = audioCtx.createMediaStreamSource(mediaStream);
    var recorder = audioCtx.createScriptProcessor(4096, 1, 1);

    var stream = ss.createStream();
    ss(socket).emit('audiostream', stream);


    recorder.onaudioprocess = function(evt) {
      var inputBuffer = evt.inputBuffer;
      var data = inputBuffer.getChannelData(0);
      //console.log(data);
      //stream.write(data);
      var buf = (new Float32Array(data)).buffer;
      var array8 = new Uint8Array(buf);
      console.log(array8);
      stream.write(array8);
      //socket.emit('audio', data);
    }
    sourceNode.connect(recorder);
    recorder.connect(audioCtx.destination);
  }, function(err) {
    console.log(err);
  });
}