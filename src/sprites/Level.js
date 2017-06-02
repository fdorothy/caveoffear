import Phaser from 'phaser'
import config from '../config'

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
      this.layerMap[key] = this.createLayer(key);
    }
    this.boundaries = [];
    for (var layer in def.boundaries) {
      var key = def.boundaries[layer];
      console.log(key);
      this.boundaries = [this.layerMap[key]];
      this.setCollisionBetween(1, 2000, true, key);
      this.layerMap[key].resizeWorld();
    }
  }

  update () {
  }
}
