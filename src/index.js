import Game from './joseki/Game';
import States from './States';

class JosekiGame extends Game {
	constructor() {
		super(
			'root',
			States,
			60,
			// 900,
			// 1600,
			1200,
			900,
			32
		);
		this.ignoreFocus = true;
		// this.isDemo = true;
		
		this.ignoreKeyShortcuts = true;
		// this.hideAllDebug = true;
		
		this.skipStateKey = 'test';
		// this.showSteamID = true;
		// this.debugBlankBackground = true;

		this.steamID = 'no_steam_id';
	}
}

var game = new JosekiGame();
game.start('$preload');