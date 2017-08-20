window.addEventListener('load', function() {
    var input = document.getElementById('input');
    var output = document.getElementById('output');
    var button = document.getElementById('button');

    var socket = io.connect();
    socket.on('message', function(message) {
        output.innerHTML += message + '\n';
    });

    button.addEventListener('click', function() {
        socket.emit('message', input.value);
        input.value = '';
    });
    
});