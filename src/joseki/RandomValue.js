import Vector from './Vector';

class RandomValue {
	constructor(min, max, exp=1) {
		this.min = min;
		this.max = max;
		this.exp = exp;
	}

	get() {
		return this.min + (this.max - this.min) * Math.pow(Math.random(), this.exp);
	}

	static Get(min, max, exp=1) {
		const val = min + (max - min) * Math.pow(Math.random(), exp);
		return val;
	}

	static Vector() {
		return new Vector(Math.random() - 0.5, Math.random() - 0.5).normalised();
	}
}

export default RandomValue;