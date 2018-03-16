function b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t+=String.fromCharCode(n[i])}return window.btoa(t)}

window.addEventListener('load', function() {
    
    var img = document.getElementById('img');
    var debug = document.getElementById('debug');
    var socket = io.connect();

    document.getElementById('wrapper').onclick = function() {
        var fs = this.requestFullscreen || this.webkitRequestFullscreen || this.mozRequestFullscreen;
        fs.call(this);
    };

    var startOrientation = false;

    window.addEventListener('deviceorientation', function(evt) {
        var orientation = [evt.alpha, evt.beta, evt.gamma];
        if (!startOrientation) startOrientation = orientation;
        h = orientation[0] - startOrientation[0];
        v = 90 - (orientation[2] - startOrientation[2]);
        debug.innerText = 'H: ' + h + ' V: ' + v;
    }, false);
    
    function request() {
        socket.emit('getimage');
    }

    socket.on('image', function(data) {
        base64 = 'data:image/jpeg;base64,' + b64(data); //'url(data:image/png;base64,' + b64(data) + ')';
        img.src = base64;
        window.setTimeout(request, 0);
    });

    window.setTimeout(request, 0);
    
});