import Sprite from './Sprite';
import Vector from '../Vector';

class OptionSprite extends Sprite {
	constructor(game, canvas, key, options) {
		super(
			game,
			canvas, 
			options.position ? options.position : new Vector(game.width * 0.5, game.height * 0.5, 0),
			key,
			options.width,
			options.height,
			options.anchor,
			options.alpha
		);

		const img = game.getImage(key);

		if (options.width && !options.height) {
			const ratio = img.height / img.width;
			this.width = options.width;
			this.height = this.width * ratio;
		} else if (options.height && !options.width) {
			const ratio = img.width / img.height;
			this.height = options.height;
			this.width = this.height * ratio;
		} else if (!options.width && !options.height) {
			this.width = img.width;
			this.height = img.height;
		}
	}
}

export default OptionSprite;