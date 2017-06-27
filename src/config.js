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
    playground: 'assets/maps/playground.json',
    island1: 'assets/maps/island1.json',
    hallway: 'assets/maps/hallway.json',
    drop1: 'assets/maps/drop1.json',
    drop2: 'assets/maps/drop2.json',
    passage1: 'assets/maps/passage1.json',
    passage2: 'assets/maps/passage2.json',
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
  images: {
    flashlight: 'assets/images/flashlight.png',
    flaregun: 'assets/images/flaregun.png',
    gold: 'assets/images/gold.png',
    radio: 'assets/images/radio.png',
    island1: 'assets/images/tiles2.png',
    cavetiles: 'assets/images/cavetiles.png',
    diamond: 'assets/images/diamond.png',
    starfield: 'assets/images/starfield.png',
  },
  // state: {
  //   map: 'playground',
  //   entrance: 'game_start',
  //   equipped: 'flashlight',
  //   items: null,
  //   fires: null,
  //   rescueTime: 0.0,
  //   rescued: false
  // }
  // state: {
  //   map: 'drop1',
  //   entrance: 'entrance_left',
  //   equipped: 'flashlight',
  //   items: null,
  //   fires: null,
  //   rescueTime: 0.0,
  //   rescued: false
  // }
  state: {
    map: 'island1',
    entrance: 'game_start',
    equipped: null,
    items: null,
    fires: null,
    rescueTime: 0.0,
    rescued: false
  }
}
