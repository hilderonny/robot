var express = require('express');
var https = require('https');
var fs = require('fs');
var spawn = require('child_process').spawn;
var P2J = require('pipe2jpeg');

// https://ffmpeg.org/ffmpeg.html
const params = [
    '-loglevel',
    'quiet',
    '-re',

/*
    '-f',
    'lavfi',
    '-i',
    'testsrc=size=1920x1080:rate=15',
*/

    '-f',
    'v4l2',
//    '-framerate',
    // '1',
    '-video_size',

// possible values: 1600x1200 2592x1944 2048x1536 1920x1080 1280x1024 1280x720 1024x768 800x600 640x480 1600x1200

    '640x480',
    '-i',
    '/dev/video0',

    '-an', // ignore audio
    // '-c:v',
    // 'mjpeg',
//    '-pix_fmt',
//    'yuvj422p',
    '-f',
    'image2pipe',//image2pipe, singlejpeg, mjpeg, or mpjpeg
    '-vf',
//    'fps=1,scale=640:360',
    'fps=10',
    '-q:v', // https://superuser.com/a/324596
    '12',
    'pipe:1'
];

// Express application
var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/image', function(request, response) {
    response.send(jpeg);
});

// HTTPS server
var options = {
  key: fs.readFileSync('ssl.key'),
  cert: fs.readFileSync('ssl.crt')
};
var server = https.createServer(options, app);
server.listen(443, function() {
  console.log('Running.');
});

var jpeg, jpegCounter=0;

var p2j = new P2J();
p2j.on('jpeg', (img) => {
    jpeg = img;
    //console.log('received jpeg', ++jpegCounter);
});

var ffmpeg = spawn('ffmpeg', params);
ffmpeg.stdout.pipe(p2j);
