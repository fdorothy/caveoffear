import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBg.anchor.set(0.5, 0.5);
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    this.loaderBar.anchor.set(0.5, 0.5);

    this.load.setPreloadSprite(this.loaderBar)

    // load all tilemaps and tilesheets
    for (var key in config.levels) {
      this.load.tilemap(key, config.levels[key].asset, null, Phaser.Tilemap.TILED_JSON);
    }

    for (var key in config.images) {
      this.load.image(key, config.images[key]);
    }

    for (var key in config.sounds) {
      this.load.audio(key, config.sounds[key]);
    }
    
    this.load.atlasJSONHash('zombie', 'assets/images/zombie.png', 'assets/images/zombie.json');
    this.load.atlasJSONHash('hero', 'assets/images/hero.png', 'assets/images/hero.json');
    this.load.spritesheet('fire', 'assets/images/fire.png', 64, 64, 4);

    config.state = JSON.parse(config.initial_state);

  }

  create () {
  }

  update() {
    if (this.cache.isSoundDecoded)
      this.state.start('Game')
  }
}
