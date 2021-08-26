import Maths from './Maths';
import Vector from './Vector';
import _ from './underscore';

class Bezier {
	static GetPointCubic(p0, p1, p2, p3, t) {
		t = Maths.clamp(t, 0, 1);
		const oneMinusT = 1 - t;

		return p0.times(oneMinusT * oneMinusT * oneMinusT)
			.add(p1.times(3 * oneMinusT * oneMinusT * t))
			.add(p2.times(3 * oneMinusT * t * t))
			.add(p3.times(t * t * t));
	}

	static GetPointsMap(p0, p1, p2, p3, callback, steps, start=0, end=1) {
		const step = 1 / steps
		const points = [];
		let t = start - step;

		while (t < end) {
			t += step;
			if (t > end) t = end;
			points.push(callback(p0, p1, p2, p3, t));
		}

		return points;
	}

	static GetPointsCubic(p0, p1, p2, p3, steps=32, start=0, end=1) {
		return Bezier.GetPointsMap(p0, p1, p2, p3, Bezier.GetPointCubic, steps, start, end);
	}

	static GetDistanceCubic(p0, p1, p2, p3, steps=32, start=0, end=1) {
		const points = Bezier.GetPointsCubic(p0, p1, p2, p3, steps, start, end);
		let distance = 0;
		let lastPoint = null;
		_.each(points, (p, i) => {
			if (i == 0) {
				lastPoint = p.copy();
			} else {
				distance += p.distance(lastPoint);
				lastPoint = p.copy();
			}
		});

		return distance;
	}

	static GetFirstDerivativeCubic(p0, p1, p2, p3, t) {
		t = Maths.clamp(t, 0, 1);
		const oneMinusT = 1 - t;

		return (p1.minus(p0)).times(3 * oneMinusT * oneMinusT)
			.add((p2.minus(p1)).times(6 * oneMinusT * t))
			.add((p3.minus(p2)).times(3 * t * t));
	}

	static GetFirstDerivativesCubic(p0, p1, p2, p3, steps, start=0, end=1) {
		return Bezier.GetPointsMap(p0, p1, p2, p3, Bezier.GetFirstDerivativeCubic, steps, start, end);
	}
}

export default Bezier;