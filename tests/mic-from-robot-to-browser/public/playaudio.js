function startplaying() {

  var client = new BinaryClient('wss://' + location.host);
  client.on('open', function () {
    var bStream = client.createStream({});
    bStream.write(convertFloat32ToInt16(left));
  });
}
