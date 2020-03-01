var express = require('express');
var https = require('https');
var fs = require('fs');
var spawn = require('child_process').spawn;
var P2J = require('pipe2jpeg');

const params = [
    '-v',
    'verbose',
    '-re',
    '-i',
    'testsrc=size=1920x1080:rate=15',
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

spawn('ffmpeg', params, {stdio : ['ignore', 'pipe', 'ignore']});
