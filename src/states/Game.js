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

    var map_config = config.levels[config.state.map]
    this.map = new Level({
      game: this.game,
      def: map_config
    });

    this.spriteLayerIndex = 0;
    if (this.map.boundaries.length > 0) {
      this.spriteLayerIndex = this.map.boundaries[0].z;
    }

    var entranceXY = this.getEntranceXY(config.state.entrance);
    this.player = new Player({
      game: this.game,
      x: entranceXY[0],
      y: entranceXY[1],
      asset: 'ms'
    })
    this.game.world.addAt(this.player, this.spriteLayerIndex);
    this.game.camera.follow(this.player);

    this.cursor = this.game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addKeyCapture([
    	Phaser.Keyboard.LEFT,
    	Phaser.Keyboard.RIGHT,
    	Phaser.Keyboard.UP,
    	Phaser.Keyboard.DOWN,
    	Phaser.Keyboard.SPACEBAR
    ]);

    this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
    this.lightSprite = this.game.add.image(this.game.camera.x, this.game.camera.y, this.shadowTexture);
    this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
  }

  render () {
  }

  trigger(x, y) {
    if (y.props.type == "exit") {
      this.warp(y.props.properties);
    }
  }

  warp(props) {
    config.state.map = props.map;
    config.state.entrance = props.entrance;
    this.state.start('Warp');
  }

  getEntranceXY(entrance_name) {
    var entrance = this.map.objects["entrances"].filter(function (x) {return x.name == entrance_name;})[0]
    return [entrance.x+entrance.width/2.0,
	    entrance.y+entrance.height/2.0]
  }

  update() {
    game.physics.arcade.collide(this.player, this.map.boundaries);
    game.physics.arcade.overlap(this.player, this.map.objectGroup, this.trigger, null, this);
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
    if (!this.map.def.lights) {
      this.lightSprite.reset(game.camera.x, game.camera.y);
      this.updateShadowTexture();
    }
  }

  updateShadowTexture() {
    this.shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';
    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

    var x = this.player.x - this.game.camera.x;
    var y = this.player.y - this.game.camera.y;

    this.drawLight(x, y, 150 + game.rnd.integerInRange(1,20), 1.0);
  }

  drawLight(x, y, radius, brightness) {
    var gradient = this.shadowTexture.context.createRadialGradient(
      x, y, 0.0,
      x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, ' + brightness + ')');
    gradient.addColorStop(1, 'rgba(255, 255, 200, 0.0)');

    this.shadowTexture.context.beginPath();
    this.shadowTexture.context.fillStyle = gradient;
    this.shadowTexture.context.arc(x, y, radius, 0, Math.PI*2, false);
    this.shadowTexture.context.fill();

    this.shadowTexture.dirty = true;
  }
}
