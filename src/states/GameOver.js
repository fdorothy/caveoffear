/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    var txt = 'game over\nretry?';
    this.text = this.add.text(
      this.game.width/2.0, this.game.height/2.0,
      txt, { font: '24px Belgrano', fill: '#aa0000', align: 'center' })
    this.text.alpha = 0.0;
    this.game.add.tween(this.text).to({alpha: 1}, 1000, "Linear", true);
    this.text.anchor.setTo(0.5, 0.5)
    this.totalTime = 3.0;
    this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.SPACEBAR
    ]);
  }

  render () {
  }

  update() {
    var dt = this.game.time.physicsElapsed;
    this.totalTime -= dt;
    if (this.totalTime <= 1.0 && this.totalTime > 0.0) {
      this.text.alpha = this.totalTime;
    }
    if (this.totalTime <= 0.0 || this.space.isDown) {
      this.state.start('Splash')
    }
  }
}
