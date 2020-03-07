function startrecording() {

  var convertFloat32ToInt16 = function(buffer) {
    var l = buffer.length;
    var buf = new Int16Array(l);
    while (l--) {
        buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf.buffer;
  };

  navigator.mediaDevices.getUserMedia({audio: true}).then(function(mediaStream) {
    var client = new BinaryClient('wss://' + location.host);
    client.on('open', function () {
      var audioCtx = new window.AudioContext();
      var bStream = client.createStream({sampleRate: audioCtx.sampleRate});
      var audioInput = audioCtx.createMediaStreamSource(mediaStream);
      var recorder = audioCtx.createScriptProcessor(0, 1, 1);
      recorder.onaudioprocess = function(evt) {
        var left = evt.inputBuffer.getChannelData(0);
        bStream.write(convertFloat32ToInt16(left));
      };
      audioInput.connect(recorder);
      recorder.connect(audioCtx.destination);
    });
  }, function(err) {
    console.log(err);
  });
}