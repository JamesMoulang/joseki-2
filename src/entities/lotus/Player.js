import Entity from '../../joseki/Entity';
import Maths from '../../joseki/Maths';
import Vector from '../../joseki/Vector';
import _ from '../../joseki/underscore';

class Player extends Entity {
	constructor(game, canvas, position) {
		super(game, canvas);
		this.position = position;
		
		this.heading = new Vector(0.1, 1);
		this.rotateSpeed = 0.1;
	}

	update() {
		const toMouse = this.game.mousePos.minus(this.position).normalised();
		// this.game.debug(Maths.rad2Deg(this.rotateSpeed * this.game.delta));
		this.heading = this.heading.rotateTowards(toMouse, this.rotateSpeed * this.game.delta, this.game);
	}

	render() {
		this.canvas.circle(
			this.position,
			4,
			{
				strokeColor: this.game.altHighlightColor,
				strokeAlpha: 1,
				fillColor: this.game.altHighlightColor,
				fillAlpha: 0.5,
			}
		);

		this.canvas.drawLine(
			this.position.x,
			this.position.y,
			this.position.x + this.heading.x * 64,
			this.position.y + this.heading.y * 64,
			this.game.textColor,
			0.5,
			1
		);

		const toMouse = this.game.mousePos.minus(this.position).normalised();

		this.canvas.drawLine(
			this.position.x,
			this.position.y,
			this.position.x + toMouse.x * 64,
			this.position.y + toMouse.y * 64,
			this.game.highlightColor,
			0.5,
			1
		);
	}
}

export default Player;