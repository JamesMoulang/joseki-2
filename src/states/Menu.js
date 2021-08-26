import _ from '../joseki/underscore';

import State from '../joseki/State';
import Sprite from '../joseki/Entities/Sprite';
import Group from '../joseki/Entities/Group';
import Vector from '../joseki/Vector';
import Maths from '../joseki/Maths';

import SpriteString from '../entities/lotus/SpriteString';
import Player from '../entities/lotus/Player';

class Menu extends State {
	constructor(key='menu') {
		super(key);
	}

	enter(game) {
		super.enter(game);

		const title = game.addEntity(new SpriteString(
			game,
			'game',
			new Vector(game.width * 0.5, game.height * 0.5),
			'joseki #02',
			0.25
		));

		title.tintMap = [
			'textColor',
			'textColor',
			'textColor',
			'textColor',
			'textColor',
			'textColor',
			'textColor',
			'highlightColor',
			'highlightColor',
			'highlightColor',
		];

		const player = this.game.addEntity(new Player(
			game,
			'game',
			new Vector(game.width * 0.5, game.height * 0.5))
		);
	}

	update() {
		super.update();
	}

	exit(nextState) {
		super.exit(nextState);
	}
	
	render() {
		super.render();
		const canvas = this.game.getCanvas('game');
		canvas.drawRect(0, 0, this.game.width, this.game.height, {fillAlpha: 0, strokeColor: this.game.textColor, strokeAlpha: 1, strokeWidth: 2});
	}
}

export default Menu;