import Phaser from 'phaser'

import Game from './scenes/Game';
import UI from './scenes/UI'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 600,
	height: 600,
	physics: {
		default: 'matter',
		matter: {
			debug: true
		},
	},
	// physics: {
	// 	default: 'arcade',
	// 	arcade: {
	// 		gravity: { y: 200 },
	// 	},
	// },
	scene: [Game, UI],
}

export default new Phaser.Game(config)
