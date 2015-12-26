var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/../public'));

app.get('/', function(req, res) {
  res.render('index');
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
