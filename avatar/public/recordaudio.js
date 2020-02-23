function startrecording() {
    console.log('STARTING');
    navigator.mediaDevices.getUserMedia({audio: true}).then(function(mediaStream) {
        console.log(mediaStream);
        var audioCtx = new window.AudioContext();
        var sourceNode = audioCtx.createMediaStreamSource(mediaStream);
        var recorder = audioCtx.createScriptProcessor(4096, 1, 1);
        recorder.onaudioprocess = function(evt) {
          var inputBuffer = evt.inputBuffer;
          var data = inputBuffer.getChannelData(0);
          socket.emit('audio', data);
          console.log(data);
        }
        sourceNode.connect(recorder);
        recorder.connect(audioCtx.destination);
      }, function(err) {
        console.log(err);
      });
    
}