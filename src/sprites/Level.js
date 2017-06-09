import Phaser from 'phaser'
import config from '../config'
import Item from './Item'

export default class extends Phaser.Tilemap {
  constructor ({ game, def }) {
    super(game, def.tilemap.key)
    this.def = def

    for (var key in def.tilesheets) {
      this.addTilesetImage(key, def.tilesheets[key].key);
    }

    this.layerMap = {};
    for (var layer in def.layers) {
      var key = def.layers[layer];
      layer = this.createLayer(key);
      this.layerMap[key] = layer;
    }
    this.boundaries = [];
    for (var layer in def.boundaries) {
      var key = def.boundaries[layer];
      this.boundaries = [this.layerMap[key]];
      this.setCollisionBetween(1, 2000, true, key);
      this.layerMap[key].resizeWorld();
    }

    if (this.layerMap['water']) {
      this.layerMap['water'].alpha = 0.5;
    }

    this.objectGroup = this.game.add.group();
    for (var key in this.objects) {
      for (var obj in this.objects[key]) {
	var props = this.objects[key][obj];
	if (props.type == "item") {
	  var sprite = new Item({
	    game: this.game,
	    x: props.x + props.width / 2.0,
	    y: props.y + props.height / 2.0,
	    name: props.name
	  });
	  sprite.props = props
	  this.objectGroup.add(sprite);
	} else {
	  var rect = this.objectGroup.create(props.x, props.y, null);
	  this.game.physics.enable(rect, Phaser.Physics.ARCADE);
	  rect.body.setSize(props.width, props.height, 0, 0);
	  rect.props = props;
	}
      }
    }
  }

  update () {
  }
}
