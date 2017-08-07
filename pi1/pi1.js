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

/*httpProxy.createProxyServer({target:'http://10.0.0.2:80'}).listen(82);
httpProxy.createProxyServer({target:'http://10.0.0.3:80'}).listen(83);
httpProxy.createProxyServer({target:'http://10.0.0.4:80'}).listen(84);
httpProxy.createProxyServer({target:'http://10.0.0.5:80'}).listen(85);
*/

var proxy = httpProxy.createProxyServer({});

var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/pi/:id', function(req, res) {
  proxy.web(req, res, { ignorePath: true, target: `http://10.0.0.${req.params.id}:80/video_feed` });
});

app.listen(80, function () {
  console.log('Läuft');
});
