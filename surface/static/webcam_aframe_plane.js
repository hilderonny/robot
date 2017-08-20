function b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t+=String.fromCharCode(n[i])}return window.btoa(t)}

window.addEventListener('load', function() {
    
    var ctx = document.getElementById('canvas').getContext('2d');
    var socket = io.connect();
    var img = new Image();

    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };

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