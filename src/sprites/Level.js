import Phaser from 'phaser'
import config from '../config'
import Item from './Item'

export default class extends Phaser.Tilemap {
  constructor ({ game, asset }) {
    super(game, asset)

    for (var i in this.tilesets) {
      key = this.tilesets[i].name;
      this.addTilesetImage(key);
    }

    // load all tile layers
    this.layerMap = {};
    this.boundaries = [];
    for (var i in this.layers) {
      var info = this.layers[i];
      var name = info.name;
      var layer = this.createLayer(info.name);
      if (info.properties.collides) {
	this.setCollisionBetween(1, 2000, true, name);
	this.boundaries.push(layer);
      }
      layer.alpha = info.alpha;
      layer.resizeWorld();
      this.layerMap[info.name] = layer;
    }

    // load all objects
    this.items = this.game.add.group();
    this.triggers = [];
    this.objectGroup = this.game.add.group();
    this.objectMap = {}
    for (var key in this.objects) {
      for (var obj in this.objects[key]) {
	var props = this.objects[key][obj];
	this.objectMap[props.name] = props;
	var sprite;
	if (props.type == "item") {
	  sprite = new Item({
	    game: this.game,
	    x: props.x + props.width / 2.0,
	    y: props.y + props.height / 2.0,
	    name: props.name
	  });
	  sprite.props = props
	  this.items.add(sprite);
	} else {
	  sprite = this.objectGroup.create(props.x, props.y, null);
	  this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
	  sprite.body.setSize(props.width, props.height, 0, 0);
	  sprite.props = props;
	  this.triggers.push(sprite);
	}
      }
    }
  }

  update () {
  }
}
