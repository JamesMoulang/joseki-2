class RollingAverage {
	constructor(length) {
		this.length = length;
		this.values = [];
		this.index = 0;
		this.wrap = true;
	}

	submit(value) {
		if (this.wrap) {
			if (this.index < this.values.length) {
				this.values[this.index] = value;
			} else {
				this.values.push(value);
			}
			this.index++;

			if (this.index >= this.length) {
				this.index = 0;
			}
		} else {
			this.values.push(value);
			if (this.values.length > this.length) {
				this.values.shift();
			}
		}
	}

	full() {
		return this.values.length == this.length;
	}

	average() {
		if (this.values.length == 0) return 0;

		let total = 0;
		for (var i = 0; i < this.values.length; i++) {
			total += this.values[i];
		}

		return total / this.values.length;
	}
}

export default RollingAverage;