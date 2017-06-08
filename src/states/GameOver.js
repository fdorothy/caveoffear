/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'GAME OVER\nretry?'
    let banner = this.add.text(this.game.width / 2.0, this.game.height / 2.0, bannerText)
    banner.font = 'Arial'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#fff'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    //var retry = game.make.sprite(this.world.centerX, this.game.height / 2.0, 'retry');
    banner.inputEnabled = true;
    banner.input.priorityID = 1;
    banner.input.useHandCursor = true;
    banner.events.onInputDown.add(this.onretry, this);
  }

  onretry () {
    this.state.start('Splash');
  }

render () {
  }
}
