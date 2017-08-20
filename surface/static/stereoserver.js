function b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t+=String.fromCharCode(n[i])}return window.btoa(t)}

window.addEventListener('load', function() {
    var img = document.getElementById('img');
    var quality = document.getElementById('quality');
    var qualityValue = document.getElementById('qualityValue');
    var brightness = document.getElementById('brightness');
    var brightnessValue = document.getElementById('brightnessValue');
    
    var socket = io.connect();

    function request() {
        socket.emit('getimage');
    }

    socket.on('image', function(data) {
        img.src = 'data:image/png;base64,' + b64(data);
        window.setTimeout(request, 0);
    });

    socket.on('quality', function(v) {
        quality.value = v;
        qualityValue.innerText = v;
    });

    socket.on('brightness', function(v) {
        brightness.value = v;
        brightnessValue.innerText = v;
    });

    quality.addEventListener('change', function() {
        socket.emit('setquality', quality.value);
    });

    brightness.addEventListener('change', function() {
        socket.emit('setbrightness', brightness.value);
    });

    window.setTimeout(request, 0);
    
});