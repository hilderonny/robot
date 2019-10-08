/*
// Siehe https://www.npmjs.com/package/express-http-proxy
var proxy = require('express-http-proxy');
var express = require('express');

var app = express();
 
app.use(express.static(__dirname + '/public'));

app.listen(80, function () {
  console.log('Läuft');
});
*/

// Siehe https://github.com/nodejitsu/node-http-proxy/blob/master/lib/http-proxy.js#L22-L50
var express = require('express');
var httpProxy = require('http-proxy');
var https = require('https');
var fs = require('fs');

/*httpProxy.createProxyServer({target:'http://10.0.0.2:80'}).listen(82);
httpProxy.createProxyServer({target:'http://10.0.0.3:80'}).listen(83);
httpProxy.createProxyServer({target:'http://10.0.0.4:80'}).listen(84);
httpProxy.createProxyServer({target:'http://10.0.0.5:80'}).listen(85);
*/

var proxy = httpProxy.createProxyServer({});

var app = express();

// Redirect to https, see https://www.tonyerwin.com/2014/09/redirecting-http-to-https-with-nodejs.html
app.enable('trust proxy');
app.use (function (req, res, next) {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});
var options = {
  key: fs.readFileSync('/etc/ssl/private/selfsigned.key'),
  cert: fs.readFileSync('/etc/ssl/certs/selfsigned.crt')
};
https.createServer(options, app).listen(443);

app.use(express.static(__dirname + '/public'));

app.get('/pi/:id', function(req, res) {
  proxy.web(req, res, { ignorePath: true, target: `http://10.0.0.${req.params.id}:80/video_feed` });
});

app.get('/pi1', function(req, res) {
  proxy.web(req, res, { ignorePath: true, target: `http://10.0.0.1:81/video_feed` });
});

app.get('/pi4/:port/:value', function(req, res) {
  proxy.web(req, res, { ignorePath: true, target: `http://10.0.0.4/move/${req.params.port}/${req.params.value}` });
});


app.get('/odroid/video0', function(req, res) {
  proxy.web(req, res, { ignorePath: true, target: `http://10.0.0.2:8080` });
});


app.listen(80, function () {
  console.log('Running');
});
