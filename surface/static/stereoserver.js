function b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t+=String.fromCharCode(n[i])}return window.btoa(t)}

window.addEventListener('load', function() {
    var img = document.getElementById('img');
    var quality = document.getElementById('quality');

    var socket = io.connect();

    function request() {
        socket.emit('getimage');
    }

    socket.on('image', function(data) {
        img.src = 'data:image/png;base64,' + b64(data);
        window.setTimeout(request, 0);
    });

    socket.on('quality', function(q) {
        quality.value = q;
    });

    quality.addEventListener('change', function() {
        socket.emit('setquality', quality.value);
    });

    window.setTimeout(request, 0);
    
});