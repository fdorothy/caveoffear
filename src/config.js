export default {
  gameWidth: 20*32,
  gameHeight: 17*32,
  localStorageName: 'phaseres6webpack',
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
    level: {
      name: 'level',
      tilemap: {key: 'level', path: 'assets/maps/level2.json'},
      tilesheets: {
	tiles: {key: 'gametiles', path: 'assets/images/tiles2.png'}
      },
      layers: ['doors', 'background', 'bounds', 'water', 'foreground'],
      playerLayer: 'bounds',
      boundaries: ['bounds'],
      lights: false,
      checkCollisionUp: true
    },
    island1: {
      name: 'island1',
      tilemap: {key: 'island1', path: 'assets/maps/island1.json'},
      tilesheets: {
	island1: {key: 'gametiles', path: 'assets/images/tiles2.png'}
      },
      layers: ['sky', 'background', 'doors', 'bounds', 'water', 'foreground'],
      playerLayer: 'bounds',
      boundaries: ['bounds'],
      lights: true,
      checkCollisionUp: false
    },
    hallway: {
      name: 'hallway',
      tilemap: {key: 'hallway', path: 'assets/maps/hallway.json'},
      tilesheets: {
	cavetiles: {key: 'cavetiles', path: 'assets/images/cavetiles.png'}
      },
      layers: ['background', 'bounds', 'water', 'foreground'],
      playerLayer: 'bounds',
      boundaries: ['bounds'],
      lights: false,
      checkCollisionUp: true
    },
    drop1: {
      name: 'drop1',
      tilemap: {key: 'drop1', path: 'assets/maps/drop1.json'},
      tilesheets: {
	cavetiles: {key: 'cavetiles', path: 'assets/images/cavetiles.png'}
      },
      layers: ['background', 'bounds', 'foreground'],
      playerLayer: 'bounds',
      boundaries: ['bounds'],
      lights: false,
      checkCollisionUp: true
    }
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
  state: {
    map: 'island1',
    entrance: 'game_start'
  }
}
