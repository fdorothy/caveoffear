export default {
  gameWidth: 20*32,
  gameHeight: 17*32,
  localStorageName: 'phaseres6webpack',
  world: {
    gravity: 300
  },
  player: {
    initialSpeed: 50,
    targetSpeed: 150,
    targetJumpSpeed: 300,
    jumps: 2,
    airAccel: 100,
    groundAccel: 200,
    groundDeaccel: 2000
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
      boundaries: ['bounds']
    }
  },
  initial: {
    map: 'level',
    start: {
      x: 100,
      y: 60
    }
  }
}
