import Maths from '../Maths';

class Rainbow {
	constructor(active=true) {
		this.rainbow = [
			'#ff0000',
			'#0000ff',
			'#00ff00',
			'#800080',
			'#FFA500',
			'#ff00ff',
			'#FFA500',
			'#800080',
			'#00ff00',
			'#0000ff',
		];
		this.rainbowIndex = 0;
		this.rainbowT = 0;
		this.rainbowSpeed = 0.05;
		this.update(0);
		this.active = active;
	}

	update(delta) {
		if (this.active) {
			this.rainbowT += this.rainbowSpeed * delta;
			if (this.rainbowT >= 1) {
				this.rainbowT -= 1;
				this.rainbowIndex++;
				if (this.rainbowIndex >= this.rainbow.length) {
					this.rainbowIndex = 0;
				}
			}

			const currentColor = this.rainbow[this.rainbowIndex];
			const nextIndex = this.rainbowIndex + 1;
			const nextColor = this.rainbow[(nextIndex >= this.rainbow.length) ? 0 : nextIndex];

			this.color = Maths.lerpColor(
				Maths.lerpColor(currentColor, nextColor, this.rainbowT),
				'#ffffff',
				0.25
			);
		}
	}
}

export default Rainbow;