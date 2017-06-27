import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, name }) {
    var info = config.monsters.mummy;
    super(game, x, y, info.asset.key)
    this.info = info;
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.gravity.y = config.world.gravity;
    this.anchor.setTo(0.5, 0.5);
    this.game.scaleModel = Phaser.ScaleManager.SHOW_ALL;
    this.scale.setTo(this.info.scale);
    this.direction = 1;
    this.animations.add('run');
    var h = this.body.height * 0.6;
    this.body.setSize(this.body.width * 0.8, h, 0, this.body.height - h);
  }

  update () {
    if (this.body.blocked.down) {
      if (this.body.velocity.x != 0.0) {
	this.walkAnimation();
      } else {
	this.stopAnimation();
      }
    } else {
      this.freefallAnimation();
    }

    if (this.body.blocked.left) {
      this.direction = -1;
    } else if (this.body.blocked.right) {
      this.direction = 1;
    }

    if (this.direction == 1)
      this.moveLeft();
    else
      this.moveRight();
  }

  moveLeft() {
    var dt = this.game.time.physicsElapsed;
    var accel = this.info.acceleration;
    if (!this.body.blocked.down)
      accel = this.info.airAcceleration;
    var vx = this.body.velocity.x - accel * dt;
    if (vx < -this.info.targetSpeed) {
      vx = -this.info.targetSpeed;
    } else if (vx > -this.info.initialSpeed) {
      vx = -this.info.initialSpeed;
    }
    this.body.velocity.x = vx;
    this.scale.x = -this.info.scale;
  }

  moveRight() {
    var dt = this.game.time.physicsElapsed;
    var accel = this.info.acceleration;
    if (!this.body.blocked.down)
      accel = this.info.airAcceleration;
    var vx = this.body.velocity.x + accel * dt;
    if (vx > this.info.targetSpeed) {
      vx = this.info.targetSpeed;
    } else if (vx < this.info.initialSpeed) {
      vx = this.info.initialSpeed;
    }
    this.body.velocity.x = vx;
    this.scale.x = this.info.scale;
  }

  walkAnimation() {
    this.animations.play('run');
  }

  stopAnimation() {
    this.animations.stop();
    this.frame = 4;
  }

  freefallAnimation() {
    this.animations.stop();
    this.frame = 0;
  }
}
