import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5)
    this.jumps = 0.0;
    this.body.collideWorldBounds = true;
    this.body.gravity.y = config.world.gravity;
    var framenames = Phaser.Animation.generateFrameNames('run/', 0, 7);
    this.animations.add('run', framenames, 10, true, false);
    framenames = Phaser.Animation.generateFrameNames('idle/', 0, 11);
    this.animations.add('idle', framenames, 10, true, false);
    framenames = ['jump/jump.png'];
    this.animations.add('jump', framenames, 10, true, false);
    framenames = Phaser.Animation.generateFrameNames('freefall/', 0, 1);
    var anim = this.animations.add('freefall', framenames, 5, true, false);
    this.anchor.setTo(0.5, 0.5);
    this.jumping = false;
    this.game.scaleModel = Phaser.ScaleManager.SHOW_ALL;
    this.scale.setTo(config.player.scale);
    this.targetAngle = 0.0;
  }

  update () {
    if (this.body.blocked.down || this.underwater) {
      var vx = this.body.velocity.x;
      if (vx < -1.0 || vx > 1.0) {
    	this.walkAnimation();
      } else {
    	this.stopAnimation();
      }
    } else {
      if (this.jumping) {
	this.jumpAnimation();
      } else {
	this.freefallAnimation();
      }
    }

    var targetAngle = this.angle;
    var dt = this.game.time.physicsElapsed;
    var drag = 0.05;
    if (this.underwater) {
      this.body.gravity.y = -config.world.gravity / 2.0;
      var drag = 7.0;
    } else {
      this.body.gravity.y = config.world.gravity;
    }
    this.body.velocity.y = this.body.velocity.y - this.body.velocity.y * dt * drag;
    this.body.velocity.x = this.body.velocity.x - this.body.velocity.x * dt * drag;
    var diff = targetAngle - this.angle;
    if (diff > -10.0 && diff < 10.0) {
      this.angle = targetAngle;
    } else {
      this.angle += diff * dt * 3;
    }

    if ((this.body.blocked.down || this.underwater) && this.jumping) {
      this.jumping = false;
      this.jumps = 0.0;
    }
    if (this.falling && this.body.blocked.down) {
      this.sfx.jump.play(null, .1, 0.5, false, false);
      this.falling = false;
    }
    if (this.body.blocked.down == false && this.body.velocity.y > 100.0)
      this.falling = true;
  }

  moveLeft() {
    var dt = this.game.time.physicsElapsed;
    var accel = config.player.groundAccel;
    if (!this.body.blocked.down)
      accel = config.player.airAccel;
    var vx = this.body.velocity.x - accel * dt;
    if (vx < -config.player.targetSpeed) {
      vx = -config.player.targetSpeed;
    } else if (vx > -config.player.initialSpeed) {
      vx = -config.player.initialSpeed;
    }
    this.body.velocity.x = vx;
    this.scale.x = -config.player.scale;
  }

  moveRight() {
    var dt = this.game.time.physicsElapsed;
    var accel = config.player.groundAccel;
    if (!this.body.blocked.down)
      accel = config.player.airAccel;
    var vx = this.body.velocity.x + accel * dt;
    if (vx > config.player.targetSpeed) {
      vx = config.player.targetSpeed;
    } else if (vx < config.player.initialSpeed) {
      vx = config.player.initialSpeed;
    }
    this.body.velocity.x = vx;
    this.scale.x = config.player.scale;
  }

  startJump() {
    if ((this.body.blocked.down || this.underwater) && this.jumping == false) {
      if (!this.underwater)
        this.sfx.jump.play(null, .1, 0.5, false, false);
      this.jumps = config.player.jumpBurst;
      this.body.velocity.y = -config.player.jumpBurst;
      this.jumping = true;
      this.body.blocked.down = false;
    }
  }

  continueJump() {
    if (this.jumping && this.jumps < config.player.targetJumpSpeed) {
      var dt = this.game.time.physicsElapsed;
      var dv = dt * config.player.jumpAccel;
      this.body.velocity.y -= dv;
      this.jumps += dv;
    }
  }

  stop() {
    var dt = this.game.time.physicsElapsed;
    var vx = this.body.velocity.x;
    if (vx < 0) {
      vx += config.player.groundDeaccel * dt;
      if (vx > 0)
	vx = 0;
    } else if (vx > 0) {
      vx -= config.player.groundDeaccel * dt;
      if (vx < 0)
	vx = 0;
    }
    if (vx < config.player.initialSpeed && vx > -config.player.initialSpeed) {
      vx = 0;
    }
    this.body.velocity.x = vx;
  }

  walkAnimation() {
    this.animations.play('run');
  }

  stopAnimation() {
    this.animations.play('idle');
  }

  jumpAnimation() {
    this.animations.play('jump');
  }

  freefallAnimation() {
    this.animations.play('freefall');
  }
}
