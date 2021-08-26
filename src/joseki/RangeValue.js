import Maths from './Maths';

class RangeValue {
	constructor(min, max, exp=1) {
		this.min = min;
		this.max = max;
		this.exp = exp;
	}

	get(t) {
		return Maths.lerp(this.min, this.max, Math.pow(t, this.exp));
	}
}

export default RangeValue;