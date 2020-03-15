// Lässt die Motoren hin- und her pendeln
var motors = require('./motors');

motors.init();

var channels = [14];
var pulseLengths = [800, 1600, 2500, 1600];
var currentPulseLength = 0;
var interval = setInterval(loop, 500);

process.on('SIGINT', () => {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
});

function loop() {
    channels.forEach((ch) => {
        var pl = pulseLengths[currentPulseLength];
        console.log('Setze Kanal ' + ch + ' auf ' + pl);
        motors.setPulse(ch, pl);
    });
    currentPulseLength = (currentPulseLength + 1) % pulseLengths.length;
}
