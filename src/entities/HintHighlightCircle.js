import Entity from '../joseki/Entity';
import Vector from '../joseki/Vector';
import Maths from '../joseki/Maths';
import _ from '../joseki/underscore';

class HintHighlightCircle {
	constructor(x, y, radius, ping=true) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.ping = ping;

		this.pingAlpha1 = 1;
		this.pingAlpha2 = 1;
	}

	update(game) {
		if (this.ping) {
			this.pingAlpha1 = Maths.lerp(this.pingAlpha1, 0, 0.05, 0.01);
			this.pingAlpha2 = Maths.lerp(this.pingAlpha2, 0, 0.03, 0.05);
		}
	}

	render(canvas, game) {
		var x = canvas.topLeft.x + this.x * canvas.scale;
		var y = canvas.topLeft.y + this.y * canvas.scale;
		var radius = this.radius * canvas.scale;

		canvas.ctx.beginPath();
		canvas.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

		canvas.ctx.save();
		canvas.ctx.clip();
		canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
		canvas.ctx.restore();

		if (!this.ping) return;

		canvas.circle(new Vector(this.x, this.y), this.radius, {
			fillAlpha: 0,
			strokeColor: game.textColor,
			strokeAlpha: this.pingAlpha1
		});

		return;

		const r = 1.5 - this.pingAlpha2 * 0.5;
		canvas.circle(
			new Vector(this.x, this.y),
			r * this.radius,
			{
				fillAlpha: 0,
				strokeColor: game.textColor,
				strokeAlpha: this.pingAlpha2 * 0.5
			}
		);
	}
}

export default HintHighlightCircle;