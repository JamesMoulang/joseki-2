import Entity from '../Entity';
import Vector from '../Vector';
import Maths from '../Maths';

class Sprite extends Entity {
	constructor(
		game,
		canvas,
		position,
		key,
		width,
		height,
		anchor = new Vector(0.5, 0.5),
		alpha = 1
	) {
		super(game, canvas, position);
		this.key = key;
		const img = game.getImage(key);
		if (img) {
			this.width = width ? width : img.width;
			this.height = height ? height : img.height;

			if (width && !height) {
				this.width = width;
				const ratio = img.height / img.width;
				this.height = this.width * ratio;
			}

			if (height && !width) {
				this.height = height;
				const ratio = img.width / img.height;
				this.width = this.height * ratio;
			}
		} else {
			this.width = 32;
			this.height = 32;
		}
		this.anchor = anchor;
		this.alpha = alpha;
		this.lerpySprite = false;
		this.lerpBounce = 1.5;
		this.lerpSpeed = 0.3;
		this.widthTarget = this.width;
		this.heightTarget = this.height;
		this.tintCache = false;
		this.inputEnabled = false;
		this.inputMargin = 0;
		this.shouldRender = true;
		
		// this.debugBounds = true;
	}

	updateKey(key, updateWidth=true) {
		if (key != this.key) {
			const img = this.game.getImage(key);
			if (img) {
				this.key = key;
				if (updateWidth) {
					if (this.lerpySprite) {
						this.widthTarget = img.width;
						this.heightTarget = img.height;

						this.width = img.width * this.lerpBounce;
						this.height = img.height * this.lerpBounce;
					} else {
						this.widthTarget = this.width = img.width;
						this.heightTarget = this.height = img.height;
					}
				}
			}
		}
	}

	update() {
		super.update();
		if (this.lerpySprite) {
			this.width = Maths.lerp(this.width, this.widthTarget, this.lerpSpeed);
			this.height = Maths.lerp(this.height, this.heightTarget, this.lerpSpeed);
		}

		if (this.inputEnabled) {
			const mousePos = this.game.mousePos;
			const width = this.width + this.inputMargin;
			const height = this.height + this.inputMargin;
			const topLeft = this.position.minus(
				new Vector(
					this.anchor.x * width,
					this.anchor.y * height
				)
			);

			if (
				mousePos.x >= topLeft.x &&
				mousePos.x <= topLeft.x + width &&
				mousePos.y >= topLeft.y &&
				mousePos.y <= topLeft.y + height
			) {
				this.hovered = true;
				if (this.hoverTint) {
					this.tint = this.hoverTint;
				}

				this.game.setCursorStyle('pointer');
				if (this.game.mousedown && !this.selected) {
					this.selected = true;
					if (this.onClick) {
						this.onClick();
					}
				}

				if (!this.game.mousedown) {
					this.selected = false;
				}
			} else {
				if (this.defaultTint) {
					this.tint = this.defaultTint;
				}

				this.hovered = false;
				this.selected = false;
			}
		}
	}

	render() {
		if (!this.shouldRender) return;

		if (this.debugBounds) {
			this.canvas.drawRect(
				this.position.x - this.anchor.x * this.width,
				this.position.y - this.anchor.y * this.height,
				this.width,
				this.height,
				{
					fillColor: '#ff0000',
					fillAlpha: 0.2,
					strokeColor: '#ff0000',
					strokeAlpha: 1,
					strokeWidth: 1
				}
			);
		}

		this.canvas.sprite(
			this.position,
			this.key,
			{
				width: this.width,
				height: this.height,
				anchor: this.anchor,
				alpha: this.alpha,
				tint: this.tint,
				tintCache: this.tintCache,
				hackScaleAndPosition: this.hackScaleAndPosition,
				angle: this.angle,
			}
		);
	}
}

export default Sprite;