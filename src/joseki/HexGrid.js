import Cell from './Cell';
import Vector from './Vector';
import Maths from './Maths';
import _ from './underscore';
import Entity from './Entity';

class HexGrid extends Entity {
	constructor(game, canvas, position, radius) {
		super(game, canvas, position);
		this.radius = radius;
		this.innerRadius = (Math.sqrt(3) * 0.5) * radius;
		console.log(this.radius, this.innerRadius);
		this.cells = {};
		this.tint = Maths.colorLerp(this.game.textColor, this.game.backColor, 0.9);
		// this.init(3);

		for (var x = -6; x <= 5; x++) {
			for (var y = -6; y <= 6; y++) {
				this.getCell(x, y);
			}
		}

		this.shouldRender = true;
		this.drawPosition = this.position;
	}

	init(radius) {
		for (var x = -radius; x <= radius; x++) {
			for (var y = -radius; y <= radius; y++) {
				this.getCell(x, y);
			}
		}
	}

	each(callback) {
		_.each(this.cells, (column) => {
			_.each(column, (cell) => {
				callback(cell);
			});
		});
	}

	getPositionFromCoord(x, y) {
		return new Vector(
			(x + y * 0.5 - Math.floor(y * 0.5)) * this.innerRadius * 2,
			y * this.radius * 1.5
		);
	}

	getCell(x, y) {
		if (!this.cells[x]) {
			this.cells[x] = {};
		}

		if (!this.cells[x][y]) {
			this.cells[x][y] = new Cell(
				x,
				y,
				this.getPositionFromCoord(x, y),
				this.radius
			);
			this.cells[x][y].dist = 10000;
		}

		return this.cells[x][y];
	}

	getCellFromWorldPosition(pos) {
		let cell = null;
		let dist = 0;
		this.each((c) => {
			const d = c.position.distance(pos);
			if (cell == null || d < dist) {
				cell = c;
				dist = d;
			}
		});

		return cell;
	}

	distScoreCells(pos) {
		let cell = null;
		let dist = 0;

		this.each((c) => {
			const d = c.position.distance(pos);
			this.getCell(c.x, c.y).dist = d;
			if (cell == null || d < dist) {
				cell = c;
				dist = d;
			}
		});

		this.closestCell = cell;
	}

	update() {
		// this.each((cell) => {
		// 	cell.highlight = false;
		// });

		// const cell = this.getCellFromWorldPosition(this.game.mousePos);
		// cell.highlight = true;
	}

	render() {
		if (!this.shouldRender) return;
		// return;

		this.each((cell) => {
			let t = Maths.clamp01((cell.dist - 64) / 256);
			const tint = this.game.cacheColorLerp(
				this.game.textColor,
				this.game.backColor,
				0.5 + 0.4 * Math.pow(t, 0.8)
			);

			this.canvas.shape(
				this.drawPosition.add(cell.position),
				6,
				this.radius, 
			{
				strokeWidth: 2,
				strokeColor: tint,
				strokeAlpha: 1,
				fillAlpha: cell.highlight ? 1 : 0,
				fillColor: this.game.highlightColor,
				shapeOffset: 0.5,
			});
		});
	}
}

export default HexGrid;