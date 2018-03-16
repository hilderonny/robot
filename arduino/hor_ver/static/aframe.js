var socket = io.connect();

AFRAME.registerComponent('send-change', {
    schema: {},
  
    init: function () {
        var eventName = this.data;
        this.el.addEventListener('componentchanged', function (evt) {
            if (evt.detail.name !== 'rotation') { return; }
            var x = Math.round(evt.detail.newData.x) + 90;
            var y = Math.round(evt.detail.newData.y) + 90;
            if (x < 40) x = 40;
            if (x > 140) x = 140;
            if (y < 70) y = 70;
            if (y > 110) y = 110;
            var requestObject = {
                horiz: y,
                vert: x
            };
            socket.emit('move', requestObject);
        });
    }
  });