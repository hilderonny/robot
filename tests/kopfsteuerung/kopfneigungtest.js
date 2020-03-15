// Lässt die Motoren hin- und her pendeln
var motors = require('./motors');

motors.init();

var channels = [13];
var pulseLengths = [800, 1350, 2100, 1350];
var currentPulseLength = 0;
var interval = setInterval(loop, 1000);

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
