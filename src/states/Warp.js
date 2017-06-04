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

    this.cursor = this.game.input.keyboard.createCursorKeys();
    this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.game.input.keyboard.addKeyCapture([
    	Phaser.Keyboard.SPACEBAR
    ]);
  }

  create () {
    var txt = 'entering ' + config.state.map + "\n[press space]";
    this.text = this.add.text(
      config.gameWidth/2.0, config.gameHeight/2.0,
      txt, { font: '16px Arial', fill: '#aaaaaa', align: 'center' })
    this.text.anchor.setTo(0.5, 0.5)
    this.totalTime = 5.0;
  }

  update() {
    var dt = this.game.time.physicsElapsed;
    this.totalTime -= dt;
    console.log(this.cursor);
    if (this.totalTime <= 0.0 || this.space.isDown) {
      this.state.start('Game')
    }
  }
}
