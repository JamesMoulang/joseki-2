import Maths from '../joseki/Maths';
import Entity from '../joseki/Entity';
import Vector from '../joseki/Vector';
import _ from '../joseki/underscore';
import HintHighlightRect from './HintHighlightRect';

class HintHighlighter extends Entity {
	constructor(game, canvas) {
		super(game, canvas);
		this.showing = false;
		this.hiding = false;
		this.alpha = 0;
		this.showAlpha = 0.75;
		this.canvas = game.getCanvas(canvas);
		this.tint = this.game.backColor;
		this.shapes = [];
		this.lerpSpeed = 0.2;

		window.hide = this.hide.bind(this);
		window.show = this.show.bind(this);
	}

	addShape(shape) {
		this.shapes.push(shape);
		return shape;
	}

	removeShape(shape) {
		this.shapes = _.without(this.shapes, shape);
	}

	clearShapes() {
		this.shapes = [];
	}

	show() {
		this.showing = true;
		this.hiding = false;
	}

	hide(clearShapes) {
		this.hiding = true;
		this.clearShapesOnHide = true;
	}

	update() {
		this.tint = this.game.backColor;

		if (this.showing) {
			if (this.hiding) {
				this.alpha = Maths.lerp(this.alpha, 0, this.lerpSpeed, 0.01);
				if (this.showing && this.alpha == 0) {
					this.showing = false;
					this.hiding = false;
					if (this.clearShapesOnHide) {
						this.clearShapes();
					}
				}
			} else {
				this.alpha = Maths.lerp(this.alpha, this.showAlpha, this.lerpSpeed, 0.01);
			}
		}

		_.each(this.shapes, (shape) => {
			shape.update(this.game);
		});
	}

	render() {
		if (this.showing && !this.game.paused) {
			// Draw shade.
			this.canvas.ctx.fillStyle = this.tint;
			this.canvas.ctx.globalAlpha = this.alpha;
			this.canvas.ctx.fillRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);

			_.each(this.shapes, (shape) => {
				shape.render(this.canvas, this.game);
			});

			_.each(this.game.entities, (e) => {
				e._hintRender(this.canvas);
			});
		}
	}
}

export default HintHighlighter;