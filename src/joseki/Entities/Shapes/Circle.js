import Entity from '../../Entity';

class Circle extends Entity {
	constructor(
		game, 
		canvas, 
		position, 
		radius=128, 
		fillStyle,
		strokeStyle,
		fillAlpha=1, 
		strokeAlpha=1,
		startArc=0,
		endArc=2*Math.PI,
		anticlockwise=false,
	) {
		super(game, canvas, position);
		this.radius = radius;
		this.fillStyle = fillStyle;
		this.strokeStyle = strokeStyle;
		this.fillAlpha = fillAlpha;
		this.strokeAlpha = strokeAlpha;
		this.startArc = startArc;
		this.endArc = endArc;
		this.anticlockwise = anticlockwise;
	}

	render() {
		this.canvas.drawCircle(
			this.position, 
			this.radius, 
			this.fillStyle, 
			this.strokeStyle, 
			this.fillAlpha, 
			this.strokeAlpha,
			this.startArc,
			this.endArc,
			this.anticlockwise
		);
	}
}

export default Circle;