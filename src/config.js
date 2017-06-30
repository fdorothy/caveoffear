export default {
  localStorageName: 'phaseres6webpack',
  gameWidth: 640,
  gameHeight: 480,
  world: {
    gravity: 500
  },
  player: {
    scale: 1.2,
    initialSpeed: 50,
    targetSpeed: 150,
    targetJumpSpeed: 450,
    jumpAccel: 450,
    jumpBurst: 250,
    airAccel: 30,
    groundAccel: 200,
    groundDeaccel: 500
  },
  levels: {
    playground: {asset: 'assets/maps/playground.json', desc: 'playground'},
    island1: {asset: 'assets/maps/island1.json', desc: 'island'},
    hallway: {asset: 'assets/maps/hallway.json', desc: 'large cavern'},
    drop1: {asset: 'assets/maps/drop1.json', desc: 'flooded passage'},
    drop2: {asset: 'assets/maps/drop2.json', desc: 'flooded passage'},
    passage1: {asset: 'assets/maps/passage1.json', desc: 'flooded cavern'},
    passage2: {asset: 'assets/maps/passage2.json', desc: 'flooded cavern'}
  },
  monsters: {
    'mummy': {
      asset: {key: 'ms', path: 'assets/images/metalslug_mummy37x45.png'},
      scale: 1.0,
      initialSpeed: 50,
      targetSpeed: 75,
      airAcceleration: 30,
      acceleration: 200,
    }
  },
  sounds: {
    wave_audio: 'assets/sounds/waves.ogg',
    cave_audio: 'assets/sounds/cave.ogg',
    jump_audio: 'assets/sounds/jump.mp3',
    monster1_audio: 'assets/sounds/monster1.mp3',
    monster2_audio: 'assets/sounds/monster2.mp3',
    death_audio: 'assets/sounds/death.mp3',
    win_audio: 'assets/sounds/win.wav',
    pickup_audio: 'assets/sounds/pickup.mp3',
    fire_audio: 'assets/sounds/fire.wav',
    noise_audio: 'assets/sounds/noise.wav',
    splash_audio: 'assets/sounds/splash.wav'
  },
  images: {
    flashlight: 'assets/images/flashlight.png',
    flaregun: 'assets/images/flaregun.png',
    gold: 'assets/images/gold.png',
    radio: 'assets/images/radio.png',
    island1: 'assets/images/tiles2.png',
    cavetiles: 'assets/images/cavetiles.png',
    diamond: 'assets/images/diamond.png',
    starfield: 'assets/images/starfield.png',
    rock: 'assets/images/rock.png'
  },
  // state: {
  //   map: 'playground',
  //   entrance: 'game_start',
  //   equipped: 'flashlight',
  //   items: null,
  //   fires: null,
  //   rescueTime: 0.0,
  //   rescued: false,
  //   deadTime: 999
  // }
  // state: {
  //   map: 'drop1',
  //   entrance: 'entrance_left',
  //   equipped: 'flashlight',
  //   items: null,
  //   fires: null,
  //   rescueTime: 0.0,
  //   rescued: false,
  //   deadTime: 999
  // }
  state: {
    map: 'island1',
    entrance: 'game_start',
    equipped: null,
    items: null,
    fires: null,
    rescueTime: 0.0,
    rescued: false,
    deadTime: 999
  }
}
