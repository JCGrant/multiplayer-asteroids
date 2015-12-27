function playState(game) {
  this.background = null;
  this.player = null;
  this.flame_emitters = [];
  this.keys = null;

  this.preload = function() {
    game.load.image('space-bg', '/static/assets/img/space-bg.jpg');
    game.load.image('ship', '/static/assets/img/ship.png');
    game.load.image('fireblob', '/static/assets/img/fireblob.png');
  }

  this.create = function() {
    
    // Set up background
    this.background = game.add.tileSprite(0, 0, game.width, game.height, 'space-bg');
    this.background.velocity = { x: 0, y: 0 };
    
    // Setup player
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');
    game.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5, 0.5);
    var tint = get_tint();
    this.player.tint = tint;
     
    // Setup thrusters
    var thruster_x = 28;
    var thruster_y = 39;
    this.flame_emitters.push(game.add.emitter(-thruster_x, thruster_y, 1000));
    this.flame_emitters.push(game.add.emitter(thruster_x, thruster_y, 1000));
    for (var i = 0; i < this.flame_emitters.length; i++) {
      var flame_emitter = flame_emitters[i];
      flame_emitter.makeParticles('fireblob');
      this.player.addChild(flame_emitter);
      flame_emitter.liflame_emitterspan = 150;
      flame_emitter.minParticleSpeed = new Phaser.Point(-10, 10);
      flame_emitter.maxParticleSpeed = new Phaser.Point(10, 50);
      flame_emitter.tint = tint;
      flame_emitter.forEach(function(particle) {
        particle.tint = tint;
      });
    }

    this.keys = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
  }

  this.update = function() {
    var speed = 0.1;
    var max_speed = 20;
    var rotation_speed = 10;
    var max_rotation_speed = 200;
    var slow_down_rate = 1.01;
    
    // Accelerate forward 
    if (this.keys.up.isDown) {
      this.background.velocity.x -= Math.sin(this.player.rotation) * speed;
      this.background.velocity.y += Math.cos(this.player.rotation) * speed;
      for (var i = 0; i < this.flame_emitters.length; i++) {
        this.flame_emitters[i].emitParticle();
      }
    } else {
      this.background.velocity.x /= slow_down_rate;
      this.background.velocity.y /= slow_down_rate;
    }
    this.background.velocity.x = value_or_max(this.background.velocity.x, max_speed);
    this.background.velocity.y = value_or_max(this.background.velocity.y, max_speed);
    this.background.tilePosition.x += this.background.velocity.x;
    this.background.tilePosition.y += this.background.velocity.y;

    // Rotate left or right
    if (this.keys.left.isDown) {
      this.player.body.angularVelocity -= rotation_speed;
      this.flame_emitters[1].emitParticle();
    }
    if (this.keys.right.isDown) {
      this.player.body.angularVelocity += rotation_speed;
      this.flame_emitters[0].emitParticle();
    }
    if (!keys.left.isDown && !keys.right.isDown) {
      this.player.body.angularVelocity /= slow_down_rate;
    }
    this.player.body.angularVelocity = value_or_max(this.player.body.angularVelocity,
                                                    max_rotation_speed);
  }

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

module.exports = playState;
