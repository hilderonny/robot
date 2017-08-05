var http = require('http');
var httpProxy = require('http-proxy');

httpProxy.createProxyServer({target:'http://10.0.0.2:80'}).listen(80);

