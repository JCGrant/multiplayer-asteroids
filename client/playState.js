function playState(game) {
  this.background = null;
  this.player = null;
  this.keys = null;
  this.debug_text = null;
  this.debug = true;
  this.other_players = [];

  var thruster_x = 28;
  var thruster_y = 39;
  var thruster_lifespan = 150;
  var num_thruster_particles = 1000;
  var thruster_min_particle_speed = new Phaser.Point(-10, 10);
  var thruster_max_particle_speed = new Phaser.Point(10, 50);

  var EPSILON = 0.01;

  this.init = function() {
    // Keeps the game running even when window is not focused on.
    game.stage.disableVisibilityChange = true;
  }

  this.preload = function() {
    game.load.image('space-bg', '/static/assets/img/space-bg.jpg');
    game.load.image('ship', '/static/assets/img/ship.png');
    game.load.image('fireblob', '/static/assets/img/fireblob.png');
  };

  this.initBackground = function() {
    this.background = game.add.tileSprite(0, 0, game.width, game.height, 'space-bg');
    this.background.velocity = { x: 0, y: 0 };
  };

  this.createPlayer = function(x, y) {
    var player = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');
    game.physics.arcade.enable(player)
    player.anchor.setTo(0.5, 0.5);
    var tint = get_tint();
    player.tint = tint;
    player.data = {
      x: x,
      y: y,
      r: 0,
      dx: 0,
      dy: 0,
      dr: 0,
      tint: tint,
    };

    player.thrusters = [];
    // Adds a thruster to each side of the ship
    [-1, 1].forEach(function(side) {
    player.thrusters.push(game.add.emitter(side * thruster_x,
                                           thruster_y,
                                           num_thruster_particles));
    });
    player.thrusters.forEach(function(fe) {
      fe.makeParticles('fireblob');
      player.addChild(fe);
      fe.lifespan = thruster_lifespan;
      fe.minParticleSpeed = thruster_min_particle_speed;
      fe.maxParticleSpeed = thruster_max_particle_speed;
      fe.tint = tint;
      fe.forEach(function(particle) {
        particle.tint = tint;
      });
    });
    return player;
  };

  this.initInput = function() {
    this.keys = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
  };

  this.initDebugging = function() {
    this.debug_text = game.add.text(10, 10, '', {
      font: '12px Arial',
      fill: '#ffff00',
    });
  };

  this.create = function() {
    this.initBackground();
    this.player = this.createPlayer(0, 0);
    this.other_players.push(this.createPlayer(100, 100));
    this.initInput();
    this.initDebugging();
  };

  this.updatePlayer = function() {
    if (this.keys.up.isDown) {
      this.player.thrusters.forEach(function(fe) {
        fe.emitParticle();
      });
    }
    if (this.keys.left.isDown) {
      this.player.thrusters[1].emitParticle();
    }
    if (this.keys.right.isDown) {
      this.player.thrusters[0].emitParticle();
    }
  }

  this.updateOtherPlayers = function() {
    this.other_players.forEach(function(op) {
      op.x = game.world.centerX + op.data.x - this.player.data.x;
      op.y = game.world.centerY - op.data.y + this.player.data.y;
      op.rotation = op.data.r;
    });
  };

  this.updateBackground = function() {
  };

  this.updateDebuggingText = function() {
    var text = '';
    for (key in this.player.data) {
      if (this.player.data.hasOwnProperty(key)) {
        text += key + ': ' + this.player.data[key] + '\n';
      }
    }
    this.debug_text.text = text;
  };

  this.sync = function() {
  };

  this.update = function() {
    this.updatePlayer();
    this.updateOtherPlayers();
    this.updateBackground();
    if (this.debug) {
      this.updateDebuggingText();
    }
    this.sync();
  };

  return this;
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

function value_or_zero(value) {
  if (Math.abs(value) < EPSILON) {
    return 0;
  }
  return value;
}

module.exports = playState;
