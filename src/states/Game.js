/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Monster from '../sprites/Monster'
import Level from '../sprites/Level'
import Item from '../sprites/Item'

import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000'
  }
  preload () {}

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = new Level({
      game: this.game,
      asset: config.state.map
    });

    this.spriteLayerIndex = 0;
    if (this.map.boundaries.length > 0) {
      this.spriteLayerIndex = this.map.boundaries[0].z;
    }

    // create and add player
    var entranceXY = this.getEntranceXY(config.state.entrance);
    this.player = new Player({
      game: this.game,
      x: entranceXY[0],
      y: entranceXY[1],
      asset: 'hero'
    })
    this.game.world.addAt(this.player, this.spriteLayerIndex+1);
    this.game.camera.follow(this.player);

    // create and add any monsters
    this.monsters = this.game.add.group();
    for (var key in this.map.objects["monsters"]) {
      var monster = this.map.objects["monsters"][key];
      if (monster.type == "monster") {
	var sprite = new Monster({
	  game: this.game,
	  x: monster.x + monster.width / 2.0,
	  y: monster.y + monster.height / 2.0,
	  info: monster.properties
	});
	this.monsters.add(sprite);
      }
    }

    this.cursor = this.game.input.keyboard.createCursorKeys();
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
    var style = {
      font: 'bold 16px Arial',
      fill: '#000',
      align: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    this.tooltip = this.add.text(this.player.x, this.player.y, '', style);
    this.tooltip.anchor.setTo(0.5, 0.5);
  }

  render () {
    //game.debug.spriteInfo(this.player, 32, 32);
  }

  trigger(x, y) {
    if (y.props.type == "exit") {
      this.warp(y.props.properties);
    } else if (y.props.type == "item") {
      if (this.spacebar.isDown) {
	config.state.equipped = y.props.name;
	y.destroy();
      }
    } else if (y.props.type == "door") {
      if (this.spacebar.isDown) {
	this.warp(y.props.properties);
      }
    }

    // show tooltip if available
    if (y.props.properties) {
      var tooltip = y.props.properties.tooltip;
      if (tooltip != null) {
	this.tooltip.text = tooltip;
	this.tooltip.x = y.x + y.width / 2.0;
	this.tooltip.y = y.y;
      }
    }
  }

  warp(props) {
    config.state.map = props.map;
    config.state.entrance = props.entrance;
    this.state.start('Warp');
  }

  getEntranceXY(entrance_name) {
    console.log(this.map.objectMap);
    var entrance = this.map.objectMap[entrance_name];
    return [entrance.x+entrance.width/2.0,
	    entrance.y+entrance.height/2.0]
  }

  pushPlatformPhysics() {
    if (this.map.properties && this.map.properties.platforms) {
      this.player.body.checkCollision.up = false;
      this.player.body.checkCollision.left = false;
      this.player.body.checkCollision.right = false;
    }
  }

  popPlatformPhysics() {
  }

  update() {
    this.pushPlatformPhysics();
    game.physics.arcade.collide([this.player, this.monsters, this.items, this.map.items], this.map.boundaries);
    this.popPlatformPhysics();
    this.tooltip.text = '';
    game.physics.arcade.overlap(this.player, this.map.items, this.trigger, null, this);
    game.physics.arcade.overlap(this.player, this.map.triggers, this.trigger, null, this);
    game.physics.arcade.overlap(this.player, this.monsters, (x, y) => {this.state.start("GameOver");}, null, this);
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
    if (this.cursor.up.downDuration(250)) {
      this.player.startJump();
    }
    if (this.cursor.up.isDown) {
      this.player.continueJump();
    }
    if (this.map.properties.dark) {
      this.lightSprite.reset(game.camera.x, game.camera.y);
      this.updateShadowTexture();
    }
  }

  updateShadowTexture() {
    this.shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';
    this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

    var x = this.player.x - this.game.camera.x;
    var y = this.player.y - this.game.camera.y;

    if (config.state.equipped == 'flashlight') {
      this.drawLight(x, y, 150 + game.rnd.integerInRange(1,20), 1.0);
    }
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
