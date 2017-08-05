/*
// Siehe https://www.npmjs.com/package/express-http-proxy
var proxy = require('express-http-proxy');
var express = require('express');

var app = express();
 
app.use('/pi2', proxy('10.0.0.2'));
app.use('/pi3', proxy('10.0.0.3'));
app.use('/pi4', proxy('10.0.0.4'));
app.use('/pi5', proxy('10.0.0.5'));

app.use(express.static(__dirname + '/public'));

app.listen(80, function () {
  console.log('Läuft');
});
*/

// Siehe https://github.com/nodejitsu/node-http-proxy/blob/master/lib/http-proxy.js#L22-L50
var express = require('express');
var httpProxy = require('http-proxy');

httpProxy.createProxyServer({target:'http://10.0.0.2:80'}).listen(82);
httpProxy.createProxyServer({target:'http://10.0.0.3:80'}).listen(83);
httpProxy.createProxyServer({target:'http://10.0.0.4:80'}).listen(84);
httpProxy.createProxyServer({target:'http://10.0.0.5:80'}).listen(85);

var app = express();
app.use(express.static(__dirname + '/public'));
app.listen(80, function () {
  console.log('Läuft');
});
