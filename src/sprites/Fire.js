import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y, 'fire')
    game.physics.arcade.enable(this);
    this.name = 'fire';
    this.timer = 0.0;
		this.animations.add('fire', [1, 2, 3, 4, 5], 5, true);
		this.lit = false;
		this.frame = 0;

    this.emitter = game.add.emitter(x, y, 100);
    this.emitter.makeParticles('diamond');
    this.emitter.gravity = 0;
    this.emitter.start(true, 500, null, 10);
    this.timer = 0.0;

		this.props = {type: "fire", name: "fire", properties: {tooltip: "ignite"}};
		this.anchor.setTo(0.5, 1.0);
  }

  update () {
		if (!this.lit) {
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

	ignite() {
		this.lit = true
		this.animations.play('fire');
		delete this.props.properties.tooltip;
	}
}
