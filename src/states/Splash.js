import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import config from '../config'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //

    // load all tilemaps and tilesheets
    for (var key in config.levels) {
      var tilemap = config.levels[key].tilemap;
      this.load.tilemap(tilemap.key, tilemap.path, null, Phaser.Tilemap.TILED_JSON);
      var tilesheets = config.levels[key].tilesheets
      for (var sheet_key in tilesheets) {
	var tilesheet = tilesheets[sheet_key];
	this.load.image(tilesheet.key, tilesheet.path);
      }
    }

    this.load.spritesheet('ms', 'assets/images/metalslug_mummy37x45.png', 37, 45, 18);
    var result = this.load.atlasJSONHash('hero', 'assets/images/hero.png', 'assets/images/hero.json');
    console.log(result);
  }

  create () {
    this.state.start('Game')
  }
}
