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

    // load all tilemaps and tilesheets
    for (var key in config.levels) {
      this.load.tilemap(key, config.levels[key], null, Phaser.Tilemap.TILED_JSON);
    }

    for (var key in config.images) {
      this.load.image(key, config.images[key]);
    }

    for (var key in config.sounds) {
      this.load.audio(key, config.sounds[key]);
    }

    this.load.spritesheet('ms', 'assets/images/metalslug_mummy37x45.png', 37, 45, 18);
    this.load.spritesheet('fire', 'assets/images/fire.png', 64, 64, 4);
    var result = this.load.atlasJSONHash('hero', 'assets/images/hero.png', 'assets/images/hero.json');

    config.state = JSON.parse(config.initial_state);
  }

  create () {
    this.state.start('Game')
  }
}
