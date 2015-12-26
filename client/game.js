sockets = require('./sockets.js');

var width = window.innerWidth;
var height = window.innerHeight;

var game = new Phaser.Game(width, height, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
});

var background;
var player;
var flame_emitters = [];
var cursors;

function preload() {
  game.load.image('space-bg', '/static/assets/img/space-bg.jpg');
  game.load.image('ship', '/static/assets/img/ship.png');
  game.load.image('fireblob', '/static/assets/img/fireblob.png');
}

function create() {
  background = game.add.tileSprite(0, 0, width, height, 'space-bg');
  background.velocity = { x: 0, y: 0 };
  
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');
  game.physics.arcade.enable(player);
  player.anchor.setTo(0.5, 0.5);
  var tint = get_tint();
  player.tint = tint;

  var thruster_x = 28;
  var thruster_y = 39;
  flame_emitters.push(game.add.emitter(-thruster_x, thruster_y, 1000));
  flame_emitters.push(game.add.emitter(thruster_x, thruster_y, 1000));
  for (var i = 0; i < flame_emitters.length; i++) {
    flame_emitters[i].makeParticles('fireblob');
    player.addChild(flame_emitters[i]);
    flame_emitters[i].lifespan = 150;
    flame_emitters[i].minParticleSpeed = new Phaser.Point(-10, 10);
    flame_emitters[i].maxParticleSpeed = new Phaser.Point(10, 50);
    flame_emitters[i].tint = tint;
    flame_emitters[i].forEach(function(particle) {
      particle.tint = tint;
    });
  }

  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  var speed = 0.1;
  var max_speed = 20;
  var rotation_speed = 10;
  var max_rotation_speed = 200;
  var slow_down_rate = 1.01;

  if (cursors.up.isDown) {
    background.velocity.x -= Math.sin(player.rotation) * speed;
    background.velocity.y += Math.cos(player.rotation) * speed;
    for (var i = 0; i < flame_emitters.length; i++) {
      flame_emitters[i].emitParticle();
    }
  } else {
    background.velocity.x /= slow_down_rate;
    background.velocity.y /= slow_down_rate;
  }
  background.velocity.x = value_or_max(background.velocity.x, max_speed);
  background.velocity.y = value_or_max(background.velocity.y, max_speed);
  background.tilePosition.x += background.velocity.x;
  background.tilePosition.y += background.velocity.y;

  if (cursors.left.isDown) {
    player.body.angularVelocity -= rotation_speed;
    flame_emitters[1].emitParticle();
  }
  if (cursors.right.isDown) {
    player.body.angularVelocity += rotation_speed;
    flame_emitters[0].emitParticle();
  }
  if (!cursors.left.isDown && !cursors.right.isDown) {
    player.body.angularVelocity /= slow_down_rate;
  }
  player.body.angularVelocity = value_or_max(player.body.angularVelocity,
                                             max_rotation_speed);
}

function get_tint() {
  var r = (0x77 + 0x88 * Math.random());
  var g = (0x77 + 0x88 * Math.random());
  var b = (0x77 + 0x88 * Math.random());
  return (r << 16) + (g << 8) + (b << 0);
}

function value_or_max(value, max) {
  var abs_value = Math.abs(value);
  if (abs_value > max) {
    var sign = value / abs_value;
    return sign * max;
  }
  return value;
}
