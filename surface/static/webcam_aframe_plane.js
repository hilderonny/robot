function b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t+=String.fromCharCode(n[i])}return window.btoa(t)}

window.addEventListener('load', function() {
    
    var context1 = document.getElementById('canvas1').getContext('2d');
    var context2 = document.getElementById('canvas2').getContext('2d');
    var socket = io.connect();
    var img = new Image();

    img.onload = function() {
        context1.drawImage(img, 0, 0, 640, 480, 0, 6, 640, 480);
        context2.drawImage(img, 640, 0, 640, 480, 0, -6, 640, 480);
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