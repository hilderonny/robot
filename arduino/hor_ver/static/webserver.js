
window.addEventListener('load', function() {
    var img = document.getElementById('img');
    var horiz = document.getElementById('horiz');
    var horizValue = document.getElementById('horizValue');
    var vert = document.getElementById('vert');
    var vertValue = document.getElementById('vertValue');
    var requestObject = {
        horiz: 90,
        vert: 90
    };
    
    var socket = io.connect();

    function send() {
        socket.emit('move', requestObject);
        horizValue.innerText = requestObject.horiz;
        vertValue.innerText = requestObject.vert;
    }

    horiz.addEventListener('input', function() {
        requestObject.horiz = horiz.value;
        send();
    });

    vert.addEventListener('input', function() {
        requestObject.vert = vert.value;
        send();
    });
    
});