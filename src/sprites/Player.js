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
    this.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], 60, true);
    this.anchor.setTo(0.5, 0.5);
    this.jumping = false;
  }

  update () {
    if (this.body.blocked.down) {
      if (this.body.velocity.x != 0.0) {
	this.walkAnimation();
      } else {
	this.stopAnimation();
      }
    } else {
      this.jumpAnimation();
    }

    if (this.body.blocked.down && this.jumping) {
      this.jumping = false;
      this.jumps = 0.0;
    }
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
    this.scale.x = -1;
    this.walkAnimation();
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
    this.scale.x = 1;
    this.walkAnimation();
  }

  startJump() {
    if (this.body.blocked.down && this.jumping == false) {
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
    this.stopAnimation();
    this.body.velocity.x = vx;
  }

  walkAnimation() {
    this.animations.play('walk');
  }

  stopAnimation() {
    this.animations.stop();
    this.frame = 4;
  }

  stoppingAnimation() {
    this.animations.stop();
    this.frame = 4;
  }

  jumpAnimation() {
    this.animations.stop();
    this.frame = 0;
  }
}
