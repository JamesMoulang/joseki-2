import Entity from '../../Entity';

class Rect extends Entity {
	constructor(game, canvas, x, y, width, height, options) {
		super(game, 'game');
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.options = options;
		this.shouldRender = true;

		this.hovered = false;
	}

	update() {
		if (this.options.inputEnabled) {
			const mousePos = this.game.mousePos;
			const hovered = (
				mousePos.x >= this.x &&
				mousePos.x <= this.x + this.width &&
				mousePos.y >= this.y &&
				mousePos.y <= this.y + this.height
			);

			if (this.hovered != hovered) {
				this.hovered = hovered;
				if (this.hovered && this.options.onHoverEnter) this.options.onHoverEnter();
				if (!this.hovered && this.options.onHoverExit) this.options.onHoverExit();
			}

			if (this.hovered && this.options.onClick) {
				this.game.setCursorStyle('pointer');
				if (this.game.mouseinput.just_down) {
					this.options.onClick();
				}
			}
		}
	}

	render() {
		super.render();

		if (!this.alive) return;

		if (this.shouldRender) {
			this.canvas.rect(
				this.x,
				this.y,
				this.width,
				this.height,
				this.options
			);
		}
	}
}

export default Rect;