var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

port = 3000;

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket) {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', function() {
    console.log('A user disconnected:', socket.id);
  });
});

http.listen(port, function() {
  console.log('listening on http://127.0.0.1:%d', port);
});
