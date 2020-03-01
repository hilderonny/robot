var express = require('express');
var https = require('https');
var fs = require('fs');
var spawn = require('child_process').spawn;
var P2J = require('pipe2jpeg');

const params = [
    /* log info to console */
    '-loglevel',
    'quiet',

    /* use an artificial video input */
    '-re',
    '-f',
    'lavfi',
    '-i',
    'testsrc=size=1920x1080:rate=15',

    /* set output flags */
    '-an',
    '-c:v',
    'mjpeg',
    '-pix_fmt',
    'yuvj422p',
    '-f',
    'image2pipe',//image2pipe, singlejpeg, mjpeg, or mpjpeg
    '-vf',
    'fps=1,scale=640:360',
    '-q',
    '1',
    '-frames',
    '100',
    'pipe:1'
];

// Express application
var app = express();
app.use(express.static(__dirname + '/public'));

// HTTPS server
var options = {
  key: fs.readFileSync('ssl.key'),
  cert: fs.readFileSync('ssl.crt')
};
var server = https.createServer(options, app);
server.listen(443, function() {
  console.log('Running.');
});

var p2j = new P2J();
var lastImage;

p2j.on('jpeg', function(jpeg) {
  console.log('Bild');
  lastImage = jpeg;
});

const ffmpeg = spawn('ffmpeg', params, {stdio : ['ignore', 'pipe', 'ignore']});
ffmpeg.stdout.pipe(p2j);

app.get('/stillimage', function(req, res) {
  res.set({'Content-Type':'image/jpeg'});
  res.send(lastImage);
});
