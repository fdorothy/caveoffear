/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Monster from '../sprites/Monster'
import Level from '../sprites/Level'
import Item from '../sprites/Item'
import Fire from '../sprites/Fire'

import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#000'
  }
  preload () {
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.time.advancedTiming = true;
    this.itemPickupCooldown = 1.0;

    this.backgroundLayer = this.game.add.group();
    this.map = new Level({
      game: this.game,
      asset: config.state.map
    });

    // background if needed
    this.bg = new Phaser.TileSprite(this.game, 0, 0, this.game.world.width, this.game.world.height, 'starfield');
    this.bg.tilePosition.y += 2;
    this.bg.anchor.setTo(0.5, 0.5);
    this.backgroundLayer.add(this.bg);

    // create and add player
    var entranceXY = this.getEntranceXY(config.state.entrance);
    this.player = new Player({
      game: this.game,
      x: entranceXY[0],
      y: entranceXY[1],
      asset: 'hero'
    })
    this.map.spriteLayer.add(this.player);
    this.game.camera.follow(this.player);

    this.cursor = this.game.input.keyboard.createCursorKeys();
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.dropkey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.SPACEBAR
    ]);

    this.shadowTexture = this.game.add.bitmapData(this.game.width+100, this.game.height+100);
    this.lightSprite = this.game.add.image(this.game.camera.x-50, this.game.camera.y-50, this.shadowTexture);
    this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    var style = {
      font: 'bold 16px Belgrano',
      fill: '#222288',
      align: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      boundsAlignH: "center",
      boundsAlignV: "middle",
    };
    this.tooltip = this.add.text(this.player.x, this.player.y, '', style);
    this.tooltip.anchor.setTo(0.5, 0.5);

    this.emitterLayer = this.game.add.group();

    // spawn items
    this.items = new Phaser.Group(this.game);
    this.map.spriteLayer.add(this.items);
    if (config.state.items == null)
      config.state.items = {};
    if (config.state.fires == null)
      config.state.fires = {};
    for (var key in config.state.items) {
      var obj = config.state.items[key];
      if (obj != "equipped" && obj.map == this.map.asset) {
       	this.spawnItem(key, obj.x, obj.y);
      }
    }
    for (var key in this.map.allObjects) {
      var obj = this.map.allObjects[key];
      if (obj.type == "item_spawn") {
	if (config.state.items[obj.name] == null) {
	  this.spawnItem(obj.name, obj.x + obj.width/2.0, obj.y+obj.height/2.0);
	}
      } else if (obj.type == "fire_spawn") {
	this.fire = new Fire({
	  game: this.game,
	  x: obj.x + obj.width / 2.0,
	  y: obj.y + obj.height*1.1,
	});
	if (config.state.fires[config.state.map])
	  this.ignite();
	this.items.add(this.fire);
      }
    }
    this.dark = !config.state.fires[config.state.map];

    // spawn monsters
    if (this.dark) {
      this.monsters = new Phaser.Group(this.game);
      this.map.spriteLayer.add(this.monsters);
      for (var key in this.map.allObjects) {
	var monster = this.map.allObjects[key];
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
    }
  }

  spawnItem(name, x, y) {
    var sprite = new Item({
      game: this.game,
      x: x,
      y: y,
      name: name
    });
    sprite.props = {name: name, type: "item", properties: {tooltip: name}}
    this.items.add(sprite);
    this.emitterLayer.add(sprite.emitter);
    this.updateItemState(sprite);
    return sprite;
  }

  updateItemState(sprite) {
    config.state.items[sprite.props.name] = {
      map: this.map.asset,
      x: sprite.x,
      y: sprite.y
    };
  }

  pickupItem(sprite) {
    if (this.itemPickupCooldown <= 0.0) {
      this.dropItem();
      config.state.equipped = sprite.props.name;
      sprite.destroy();
      config.state.items[sprite.props.name] = "equipped";
      this.itemPickupCooldown = 1.0;
    }
  }

  dropItem() {
    if (config.state.equipped != null) {
      var sprite = this.spawnItem(config.state.equipped, this.player.x, this.player.y);
      sprite.body.velocity.x = this.player.body.velocity.x * 3;
      sprite.body.velocity.y = this.player.body.velocity.y * 2;
      this.game.add.tween(sprite.body.velocity).to({x: 0}, 1200, Phaser.Easing.Linear.None, true);
      config.state.equipped = null;
    }
  }

  ignite() {
    this.fire.ignite();
    config.state.fires[config.state.map] = true;
    this.dark = false;
  }

  render () {
    //game.debug.spriteInfo(this.player, 32, 32);
    //game.debug.text(game.time.fps || '--', 2, 14, "#fff");
    this.game.debug.text(game.time.fps || '--', 2, 14);   
  }

  trigger(x, y) {
    if (y.props.type == "exit") {
      this.warp(y.props.properties);
    } else if (y.props.type == "item") {
      if (this.spacebar.isDown) {
	this.pickupItem(y);
      }
    } else if (y.props.type == "door") {
      if (this.spacebar.isDown) {
	this.warp(y.props.properties);
      }
    } else if (y.props.type == "fire") {
      if (this.spacebar.isDown) {
	this.ignite();
      }
    }

    // show tooltip if available
    if (y.props.properties) {
      var tooltip = y.props.properties.tooltip;
      if (tooltip != null) {
	this.tooltip.text = tooltip;
	this.tooltip.x = (y.left + y.right) / 2.0;
	this.tooltip.y = y.bottom - 64;
      }
    }
  }

  warp(props) {
    config.state.map = props.map;
    config.state.entrance = props.entrance;
    this.state.start('Warp');
  }

  getEntranceXY(entrance_name) {
    var entrance = this.map.objectMap[entrance_name];
    return [entrance.x+entrance.width/2.0,
	    entrance.y+entrance.height/2.0]
  }

  pushPlatformPhysics(sprite) {
    if (this.map.properties && this.map.properties.platforms) {
      sprite.body.checkCollision.up = false;
      sprite.body.checkCollision.left = false;
      sprite.body.checkCollision.right = false;
    }
  }

  popPlatformPhysics(sprite) {
    if (this.map.properties && this.map.properties.platforms) {
      sprite.body.checkCollision.up = true;
      sprite.body.checkCollision.left = true;
      sprite.body.checkCollision.right = true;
    }
  }

  update() {
    this.bg.x = (this.camera.x - this.world.width / 2.0) * 0.5 + this.bg.width/2.0;
    this.bg.y = (this.camera.y - this.world.height / 2.0) * 0.5 + this.bg.height/2.0;
    var dt = this.game.time.physicsElapsed;
    if (this.itemPickupCooldown > 0.0)
      this.itemPickupCooldown -= dt;
    this.pushPlatformPhysics(this.player);
    game.physics.arcade.collide([this.player, this.monsters, this.items], this.map.boundaries);
    this.popPlatformPhysics(this.player);
    this.tooltip.text = '';

    this.player.underwater = false;
    for (var idx in this.map.water) {
      var layer = this.map.water[idx];
      var tiles = layer.getTiles(this.player.x - 16, this.player.y - 16 - this.player.height / 2.0, 32, 32);
      this.player.underwater = tiles.filter((x) => x.index != -1).length > 0;
    }

    game.physics.arcade.overlap(this.player, this.items, this.trigger, null, this);
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
    if (this.dropkey.isDown) {
      this.dropItem();
    }
    this.lightSprite.reset(game.camera.x-50, game.camera.y-50);
    this.updateShadowTexture();
  }

  updateShadowTexture() {
    if (this.dark) {
      if (!this.map.properties.dark) {
	this.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
      } else {
	this.shadowTexture.context.fillStyle = 'rgb(10, 10, 10)';
      }
    } else {
      this.shadowTexture.context.fillStyle = 'rgb(128, 128, 128)';
    }
    this.shadowTexture.context.fillRect(0, 0, this.game.width+100, this.game.height+100);

    var x = this.player.x - this.game.camera.x + 50;
    var y = this.player.y - this.game.camera.y + 50;

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
