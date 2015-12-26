require('./sockets.js');

var width = window.innerWidth;
var height = window.innerHeight;

game = new Phaser.Game(width, height, Phaser.AUTO, '', null);

game.state.add('play', require('./playState.js')(game));

game.state.start('play');
