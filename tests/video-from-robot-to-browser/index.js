var express = require('express');
var https = require('https');
var fs = require('fs');
var spawn = require('child_process').spawn;
var P2J = require('pipe2jpeg');

const params = [
    '-v',
    'verbose',
    '-re',

/*
    '-f',
    'lavfi',
    '-i',
    'testsrc=size=1920x1080:rate=15',
*/

    '-f',
    'v4l2',
    '-framerate',
    '25',
    '-video_size',

// possible values: 1600x1200 2592x1944 2048x1536 1920x1080 1280x1024 1280x720 1024x768 800x600 640x480 1600x1200

    '640x480',
    '-i',
    '/dev/video0',

    '-c:v',
    'libx264',
    '-b:v',
    '5000k',
    '-f',
    'hls',
    '-hls_time',
    '6',
    '-hls_list_size',
    '4',
    '-hls_wrap',
    '40',
    '-hls_delete_threshold',
    '1',
    '-hls_flags',
    'delete_segments',
    '-hls_start_number_source',
    'datetime',
    '-preset',
    'superfast',
    '-start_number',
    '10',
    './public/stream.m3u8'
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

spawn('ffmpeg', params);

