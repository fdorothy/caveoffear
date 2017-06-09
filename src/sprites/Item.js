import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, name }) {
    super(game, x, y, name)
    this.name = name;
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.gravity.y = config.world.gravity;
    this.anchor.setTo(0.5, 0.5);
    this.emitter = game.add.emitter(x, y, 100);
    this.emitter.makeParticles('diamond');
    this.emitter.gravity = 0;
    this.emitter.start(true, 500, null, 10);
    this.timer = 0.0;
  }

  update () {
    var dt = this.game.time.physicsElapsed;
    this.timer += dt
    if (this.timer >= 1.0) {
      this.emitter.x = this.x;
      this.emitter.y = this.y;
      this.emitter.start(true, 500, null, 10);
      this.timer = 0.0;
    }
  }
}
