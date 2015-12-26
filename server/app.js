var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var routes = require('./routes');
var setupSocket = require('./sockets');

port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', routes);
app.use('/static', express.static(__dirname + '/../public'));

setupSocket(io);

http.listen(port, function() {
  console.log('listening on http://127.0.0.1:%d', port);
});
