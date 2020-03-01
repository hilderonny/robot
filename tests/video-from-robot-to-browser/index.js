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


app.get('/mjpeg', function(req, res) {
  res.setHeader('Content-Type', 'multipart/x-mixed-replace;boundary=Ba4oTvQMY8ew04N8dcnM');
  res.setHeader('Connection', 'close');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Expires', -1);
  res.setHeader('Max-Age', 0);

  ffmpeg.stdout.pipe(res);

});
