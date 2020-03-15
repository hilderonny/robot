// Tastatursteuerung
// Links: -1 [D (name:left)
// Hoch: +10 code:[A (name:up)
// Rechts: +1 code:[C (name:right)
// Unten: -10 code:[B (name:down)
// ESC: Beenden sequence: \u001b (name:escape)

var keypress = require('keypress');
keypress(process.stdin);

var motors = require('./motors');
motors.init();
var channel = 15;
var pos = 1500;
steer(pos);

process.stdin.on('keypress', function (_, key) {
    if (!key) return;
    // Abbruch mit CTRL+C
    switch (key.name) {
        case 'c': if (key.ctrl) process.stdin.pause(); break;
        case 'escape': process.stdin.pause(); break;
        case 'up': steer(pos + 10); break;
        case 'down': steer(pos - 10); break;
        case 'left': steer(pos - 1); break;
        case 'right': steer(pos + 1); break;
    }
});

function steer(pulse) {
    console.log(pulse);
    motors.setPulse(channel, pulse);
    pos = pulse;
}

console.log('ESCAPE: Beenden');
console.log('HOCH: +10');
console.log('RUNTER: -10');
console.log('LINKS: -1');
console.log('RECHTS: +1');

process.stdin.setRawMode(true);
process.stdin.resume();
