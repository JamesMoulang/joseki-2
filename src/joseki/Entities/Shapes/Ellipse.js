import Entity from '../../Entity';

class Ellipse extends Entity {
	constructor(
		game, 
		canvas, 
		position, 
		radiusX=128, 
		radiusY=128, 
		fillStyle,
		strokeStyle,
		fillAlpha=1, 
		strokeAlpha=1,
		lineWidth=1
	) {
		super(game, canvas, position);
		this.radiusX = radiusX;
		this.radiusY = radiusY;
		this.fillStyle = fillStyle;
		this.strokeStyle = strokeStyle;
		this.fillAlpha = fillAlpha;
		this.strokeAlpha = strokeAlpha;
		this.lineWidth = lineWidth;
	}

	render() {
		this.canvas.drawEllipse(
			this.position, 
			this.radiusX, 
			this.radiusY, 
			this.fillStyle, 
			this.strokeStyle, 
			this.fillAlpha, 
			this.strokeAlpha,
			this.lineWidth
		);
	}
}

export default Ellipse;