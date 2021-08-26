import Entity from '../../joseki/Entity';
import Maths from '../../joseki/Maths';
import Vector from '../../joseki/Vector';
import _ from '../../joseki/underscore';

class SpriteString extends Entity {
	constructor(game, canvas, position, text, scale) {
		super(game, canvas);
		this.position = position;
		this.text = text.toUpperCase();
		this.scale = scale;

		this.trueSize = 384;
	}

	update() {

	}

	render() {
		const start_pos = this.position.add(
			new Vector(
				-(this.text.length - 1) * 0.5 * this.trueSize * this.scale,
				0
			)
		);

		_.each(this.text, (t, i) => {
			if (this.game.type_key_map[t]) {
				this.canvas.sprite(
					start_pos.add(new Vector(i * this.trueSize * this.scale, 0)),
					this.game.type_key_map[t],
					{
						width: this.trueSize * this.scale,
						tintCache: true,
						tint: (this.tintMap && this.tintMap[i]) ? this.game[this.tintMap[i]] : this.game.textColor,
					}
				);
			}
		});
	}
}

export default SpriteString;