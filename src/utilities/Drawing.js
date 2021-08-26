import Bezier from '../joseki/Bezier';
import _ from '../joseki/underscore';

const DrawLine = (ctx, x1=0, y1=0, x2=128, y2=128, color='#ffffff', alpha=1, lineWidth=8, shadowBlur, lineCap ='butt') => {
	if (shadowBlur) {
		ctx.save();
		ctx.shadowBlur = shadowBlur;
		ctx.shadowColor = color;
	}

	ctx.lineCap = lineCap;
	ctx.strokeStyle = color;
	ctx.globalAlpha = alpha;
	ctx.lineWidth = lineWidth;
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.lineCap = 'butt';
	if (shadowBlur) {
		ctx.restore();
	}
};

const OptionsFill = (ctx, options) => {
	const fillColor = (options.fillColor !== undefined) ? options.fillColor : '#ffffff';
	const fillAlpha = (options.fillAlpha !== undefined) ? options.fillAlpha : 1;

	if (fillAlpha > 0) {
		ctx.fillStyle = fillColor;
		ctx.globalAlpha = fillAlpha;
		ctx.fill();
	}
};

const OptionsStroke = (ctx, options) => {
	const strokeColor = (options.strokeColor !== undefined) ? options.strokeColor : '#ffffff';
	const strokeAlpha = (options.strokeAlpha !== undefined) ? options.strokeAlpha : 1;
	const strokeWidth = (options.strokeWidth !== undefined) ? options.strokeWidth : 1;
	const strokeCap = (options.strokeCap !== undefined) ? options.strokeCap : 'butt';

	if (strokeAlpha > 0) {
		if (options.shadowBlur) {
			ctx.save();
			ctx.shadowBlur = options.shadowBlur;
			ctx.shadowColor = options.shadowColor !== undefined ? 
				options.shadowColor :
				options.strokeColor;
		}
		ctx.lineCap = strokeCap;
		ctx.strokeStyle = strokeColor
		ctx.lineWidth = strokeWidth;
		ctx.globalAlpha = strokeAlpha;
		ctx.stroke();
		ctx.lineCap = 'butt';

		if (options.shadowBlur) {
			ctx.restore();
		}
	}
};

const Circle = (ctx, pos, radius, options={}) => {
	const anticlockwise = options.anticlockwise !== undefined ? options.anticlockwise : false;
	const startArc = options.startArc !== undefined ? options.startArc : 0;
	const endArc = options.endArc !== undefined ? options.endArc : 2 * Math.PI;

	ctx.beginPath();
	ctx.arc(
		pos.x,
		pos.y,
		Math.max(0, radius),
		startArc,
		endArc,
		anticlockwise
	);

	OptionsFill(ctx, options);
	OptionsStroke(ctx, options);
};

const DrawBezierCurve = (ctx, p1, p2, p3, p4, options) => {
	const points = Bezier.GetPointsCubic(p1, p2, p3, p4, options.steps, options.start, options.end);
	ctx.beginPath();
	_.each(points, (point, i) => {
		if (i == 0) {
			ctx.moveTo(point.x, point.y);
		} else {
			ctx.lineTo(point.x, point.y);
		}
	});

	OptionsFill(ctx, options);
	OptionsStroke(ctx, options);
};

export default {DrawLine, Circle, DrawBezierCurve, OptionsStroke, OptionsFill};