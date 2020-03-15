// Motorensteuerung
var i2cBus = require('i2c-bus');
var driver = require('pca9685').Pca9685Driver;

var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
};

var pwm;

var motors = {
    init: () => {
        pwm = new driver(options, function(err) {
            if (err) console.log(err);
        });
        process.on('SIGINT', () => {
            pwm.dispose();
        });
    },
    setPulse: (channel, pulse) => {
        pwm.setPulseLength(channel, pulse);
    }
};

module.exports = motors;