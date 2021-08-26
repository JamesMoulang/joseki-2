import Entity from '../joseki/Entity';
import Maths from '../joseki/Maths';
import _ from '../joseki/underscore';
import Vector from '../joseki/Vector';
import Rect from '../joseki/Entities/Shapes/Rect';
import Sprite from '../joseki/Entities/Sprite';
import HintHighlightRect from './HintHighlightRect';
import SpriteString from './SpriteString';

class SquareButton extends Entity {
	constructor(game, canvas, position, image, onClick, size=64, padding=0.25, group) {
		super(game, canvas);
		this.onClick = onClick;
		this.ents = [];
		this.group = group;

		this.rect = new Rect(
			game,
			canvas,
			position.x,
			position.y,
			size,
			size,
			{
				fillColor: this.game.backColor,
				strokeColor: this.game.altHighlightColor,
				strokeAlpha: 1,
				strokeWidth: 2,
				fillAlpha: 0.25,
				worldSpace: true
			}
		);

		this.hoverRect = new Rect(
			game,
			canvas,
			position.x,
			position.y,
			size,
			size,
			{
				fillColor: this.game.altHighlightColor,
				strokeAlpha: 0,
				fillAlpha: 0,
				worldSpace: true
			}
		);

		this.sprite = new Sprite(
			game,
			canvas,
			position.add(new Vector(size * 0.5, size * 0.5)),
			image,
			size * (1 - padding),
			size * (1 - padding)
		);
		this.sprite.tint = this.game.altHighlightColor;
		this.sprite.tintCache = true;

		this.showing = true;

		this.add(this.hoverRect);
		this.add(this.rect);
		this.add(this.sprite);

		game.paletteSwapper.addListener(this, () => {
			this.rect.options.fillColor = this.game.backColor;
			this.rect.options.strokeColor = this.game.altHighlightColor;
			this.hoverRect.options.fillColor = this.game.altHighlightColor;
		});
	}

	addText(text) {
		this.text = new SpriteString(
			this,
			'game',
			new Vector(this.rect.x + this.rect.width * 0.5, this.rect.y + this.rect.height + 24),
			text,
			{
				letterHeight: 12,
				letterPadding: 12/5,
				direction: 'LEFT',
				textAlignment: 'CENTER',
				characterConversion: 'VARIABLE'
			}
		);
		this.text.alpha = 0.5;
	}

	clear(canvas) {
		canvas.clearRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
	}

	setShowing(showing) {
		this.rect.shouldRender = showing;
		this.hoverRect.shouldRender = showing;
		this.sprite.shouldRender = showing;

		this.showing = showing;
	}

	add(ent) {
		this.ents.push(ent);
		if (this.group) {
			return this.group.push(ent);
		} else {
			return this.game.addEntity(ent);
		}
	}

	getHintShape() {
		return new HintHighlightRect(
			this.rect.x - 2,
			this.rect.y - 2,
			this.rect.width + 4,
			this.rect.height + 4
		);
	}

	update() {
		if (!this.showing) return;

		if (this.text) {
			this.text.position.x = this.rect.x + this.rect.width * 0.5;
			this.text.position.y = this.rect.y + this.rect.height + 24;

			this.text.update();
			this.text.defaultTint = this.game.textColor;
		}

		this.hovered = false;
		if (!this.inputDisabled && !this.wip) {
			if (this.game.mousePos.x > this.rect.x &&
				this.game.mousePos.x < this.rect.x + this.rect.width &&
				this.game.mousePos.y > this.rect.y &&
				this.game.mousePos.y < this.rect.y + this.rect.height) {

				this.hovered = true;
				this.game.setCursorStyle('pointer');
			}
		}

		this.hoverRect.options.fillAlpha = Maths.lerp(
			this.hoverRect.options.fillAlpha,
			this.hovered ? 1 : 0,
			0.2
		);

		this.sprite.tint = this.hovered ? this.game.textColor : this.game.altHighlightColor;
		this.rect.options.strokeColor = this.hovered ? this.game.textColor : this.game.altHighlightColor;

		if (this.hovered && this.game.mouseinput.just_down) {
			const key = Math.random() < 0.5 ? 'sfx_keyboard_1' : 'sfx_keyboard_2';
			this.game.audioManager.addAudio(key, 'sfx').playOnce();
			this.onClick();
		}
	}

	render() {
		if (this.text && this.hovered && this.showing) this.text.render();
	}

	manualRender() {
		_.each(this.ents, (ent) => {
			ent.render();
		});
	}

	destroy() {
		if (this.text) {
			this.text.destroy();
		}
		_.each(this.ents, (ent) => {
			ent.destroy();
		});
		super.destroy();
	}
}

export default SquareButton;