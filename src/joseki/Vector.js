import Maths from './Maths';

var applyTransformationMatrix = function(m1, m2) {
	var point = [];
	for (var i = 0; i < m1.length; i++) {
		point[i] = [];
		point[i][0] = 0;
		for (var j = 0; j < m1[i].length; j++) {
			point[i][0] += m1[i][j] * m2[j][0];
		}
	}

	return point;
}

class Vector {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.atTarget = false;
	}

	rotated() {
		return new Vector(this.y, -this.x);
	}

	static Random() {
		return new Vector(
			Math.random() - 0.5,
			Math.random() - 0.5,
			Math.random() - 0.5
		).normalised();
	}

	static Random2D() {
		return new Vector(
			Math.random() - 0.5,
			Math.random() - 0.5,
			0
		).normalised();
	}

	random() {
		return new Vector(
			Math.random() - 0.5,
			Math.random() - 0.5,
			Math.random() - 0.5
		).normalised();
	}

	round() {
		return new Vector(
			Math.round(this.x),
			Math.round(this.y),
			Math.round(this.z)
		);
	}

	copy() {
		return new Vector(this.x, this.y, this.z);
	}

	static RandomHeading(radius, maxRadius) {
		const radians = Math.random() * 2 * Math.PI;
		const v = new Vector(
			Math.cos(radians),
			Math.sin(radians)
		).normalised();
		const r = maxRadius ? Maths.randomRange(radius, maxRadius) : radius;
		return v.times(r);
	}

	static Heading(radians, distance=1) {
		return new Vector(
			Math.cos(radians),
			Math.sin(radians)
		).normalised().times(distance);
	}

	//Only works with 2d vectors.
	angleTo(v2) {
		return Math.atan2(v2.y - this.y, v2.x - this.x);
	}

	add(v2) {
		return new Vector(this.x + v2.x, this.y + v2.y, this.z + v2.z);
	}

	minus(v2) {
		return new Vector(this.x - v2.x, this.y - v2.y, this.z - v2.z);
	}

	times(s) {
		return new Vector(this.x * s, this.y * s, this.z * s);
	}

	floor() {
		return new Vector(Math.floor(this.x), Math.floor(this.y));
	}

	divide(s) {
		return new Vector(this.x / s, this.y / s, this.z / s);
	}

	sqrMagnitude() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	sqrDistance(v2) {
		return this.minus(v2).sqrMagnitude();
	}

	distance(v2) {
		return this.minus(v2).magnitude();
	}

	towards(v2, t, snap = true) {
		var direction = v2.minus(this);
		var distance = direction.magnitude();
		if (t > distance) {
			if (snap) {
				const r = new Vector(v2.x, v2.y, v2.z);
				r.atTarget = true;
				return r;
			} else {
				return this;
			}
		} else {
			return this.add(direction.normalised().times(t));
		}
	}

	lerp(v2, t) {
		var direction = v2.minus(this);
		var distance = direction.magnitude() * t;
		return this.add(direction.normalised().times(distance));
	}

	static Lerp(v1, v2, t) {
		var direction = v2.minus(v1);
		var distance = direction.magnitude() * t;
		return v1.add(direction.normalised().times(distance));
	}

	normalise() {
		const normalised = this.normalised();
		this.x = normalised.x;
		this.y = normalised.y;
		this.z = normalised.z;
	}

	normalised() {
		var mag = this.magnitude();
		if (mag == 0) {
			return new Vector();
		} else {
			return this.divide(this.magnitude());
		}
	}

	debugString() {
		return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
	}

	applyTransformationMatrix(matrix) {
		var point = [
			[this.x],
			[this.y],
			[this.z],
			[1]
		];

		var applied = applyTransformationMatrix(matrix, point);

		return new Vector(
			applied[3][0] == 0 ? 0 : applied[0][0] / applied[3][0], 
			applied[1][0] == 0 ? 0 : applied[1][0] / applied[3][0], 
			applied[2][0] == 0 ? 0 : applied[2][0] / applied[3][0]
		);
	}
}

export default Vector;