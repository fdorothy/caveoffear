/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Level from '../sprites/Level'

import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000'
  }
  preload () {}

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = new Player({
      game: this.game,
      x: config.initial.start.x,
      y: config.initial.start.y,
      asset: 'ms'
    })

    var map_config = config.levels[config.initial.map]
    console.log(map_config);
    this.map = new Level({
      game: this.game,
      def: map_config
    });

    this.game.add.existing(this.player)

    //this.water.alpha = 0.6;

    this.cursor = this.game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addKeyCapture([
    	Phaser.Keyboard.LEFT,
    	Phaser.Keyboard.RIGHT,
    	Phaser.Keyboard.UP,
    	Phaser.Keyboard.DOWN,
    	Phaser.Keyboard.SPACEBAR
    ]);

    // shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    // lightSprite = this.game.add.image(this.game.camera.x, this.game.camera.y, shadowTexture);
    // lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
  }

  render () {
  }

  update() {
    game.physics.arcade.collide(this.player, this.map.boundaries);
    var blocked = this.player.body.blocked.down;
    if (this.cursor.left.isDown) {
      this.player.moveLeft();
    }
    else if (this.cursor.right.isDown) {
      this.player.moveRight();
    }
    else if (blocked) {
      this.player.stop();
    }
    if (this.cursor.up.isDown) {
      this.player.jump();
    }
    //lightSprite.reset(game.camera.x, game.camera.y);
    //updateShadowTexture();
  }
}
