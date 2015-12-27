var Game = require('./game.js');
var game = new Game();

function setupSocket(io) {
  io.on('connection', function(socket) {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', function() {
      console.log('A user disconnected:', socket.id);
    });
  });
}

module.exports = setupSocket;
