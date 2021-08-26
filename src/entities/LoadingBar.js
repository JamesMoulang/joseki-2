import Entity from '../joseki/Entity';
import Maths from '../joseki/Maths';
import _ from '../joseki/underscore';
import Vector from '../joseki/Vector';
import Rainbow from '../joseki/Entities/Rainbow';
import HintHighlightRect from './HintHighlightRect';
import HintHighlightCircle from './HintHighlightCircle';

class LoadingBar extends Entity {
	constructor(main, canvas, radius, padding, position, length, getValue, add=true) {
		super(main.game, canvas);
		this.position = position;
		if (add) main.game.entities.push(this);
		this.value = 0;
		this.length = length;
		this.lengthTarget = length;
		this.radius = radius;
		this.padding = padding;
		this.getValue = getValue;
		this.drawBothThreshold = 0.000001;
		this.rainbow = new Rainbow();
		this.speed = 1;
		this.instant = false;
		this.x = this.position.x + this.lengthTarget * 0.5;
		this.strokeWidth = 4;
		this.quantiseColor = Maths.colorLerp(this.game.textColor, this.game.backColor, 0.5);

		this.disappearing = false;
		this.showing = true;
		this.appearing = false;

		this.alpha = 1;

		this.flashLengths = [1, 0];
		this.flashTints = [0, 1];
		this.flashTimer = 0;
		this.flashT = 0;
		this.flashPhase = 0;
		// 0: wait to flash
		// 1: increase in length to max
		// 2: fade out
	}

	addHintShape() {
		// Create time highlight.
		const leftPos = this.position;
		const rightPos = this.position.add(new Vector(this.length, 0));
		const radius = this.radius + this.padding + 2;

		const timeHighlight1 = this.game.hintManager.addShape(
			new HintHighlightCircle(
				leftPos.x,
				leftPos.y,
				radius,
				false
			)
		);

		const timeHighlight2 = this.game.hintManager.addShape(
			new HintHighlightCircle(
				rightPos.x,
				rightPos.y,
				radius,
				false
			)
		);

		const timeHighlight3 = this.game.hintManager.addShape(
			new HintHighlightRect(
				leftPos.x,
				leftPos.y - radius,
				rightPos.x - leftPos.x,
				radius * 2,
				false
			)
		);

		const w3 = timeHighlight3.width + radius * 2;
		const timeHighlight4 = this.game.hintManager.addShape(
			new HintHighlightRect(
				timeHighlight3.x - (radius + 12),
				timeHighlight3.y - 12,
				timeHighlight3.width + radius * 2 + 24,
				timeHighlight3.height + 24,
				true,
				true
			)
		);

		return timeHighlight3;
	}

	setGoodThreshold(threshold, leftColor, rightColor) {
		this.goodThreshold = threshold;

		this.updateThresholdColor(leftColor, rightColor);
	}

	updateThresholdColor(leftColor, rightColor) {
		this.goodThresholdLeftColorTarget = leftColor;
		this.goodThresholdRightColorTarget = rightColor;

		this.goodThresholdLeftColor = Maths.colorLerp(leftColor, this.game.textColor, 0.125);
		this.goodThresholdLeftColorBack = Maths.colorLerp(leftColor, this.game.backColor, 0.5);
		this.goodThresholdRightColor = Maths.colorLerp(rightColor, this.game.textColor, 0.125);
		this.goodThresholdRightColorBack = Maths.colorLerp(rightColor, this.game.backColor, 0.5);
	}

	appear() {
		if (!this.showing) {
			this.showing = true;
			this.appearing = true;
			this.length = 0;
		}
	}

	disappear() {
		console.log("disappear?");
		if (!this.disappearing) {
			this.disappearing = true;
			this.appearing = false;
		}
	}

	update() {
		if (this.disappearing) {
			this.alpha = Maths.lerp(this.alpha, 0, 0.2, 0.01);
			if (this.alpha == 0) {
				this.showing = false;
				this.disappearing = false;
				if (this.onDisappear) this.onDisappear();
			}
		} else if (this.showing) {
			this.alpha = Maths.lerp(this.alpha, 1, 0.2);
			this.length = Maths.lerp(this.length, this.lengthTarget, 0.15, 0.1);
			if (this.appearing && this.length == this.lengthTarget) {
				this.appearing = false;
				if (this.onAppear) this.onAppear();
			}
		}

		this.position.x = this.x - this.length * 0.5;

		const val = Maths.clamp01(this.getValue());

		if (this.instant) {
			this.value = val;
		} else {
			// this.value = Maths.towardsValue(this.value, this.speed * this.game.delta, this.getValue());
			this.value = Maths.lerp(this.value, val, 0.1, 0.001);
		}

		if (this.value == val) {
			this.completed = true;
		}
		this.rainbow.update(this.game.delta);
	}

	render() {
		if (this.dontRender) return;
		if (!this.showing) return;

		const left = this.position;
		const right = this.position.add(new Vector(this.length, 0));

		const tint = this.tint || this.game.textColor;

		if (this.drawBack) {
			// Draw the left circle
			this.canvas.drawCircle(
				left,
				this.radius + this.backPadding,
				this.game.backColor,
				undefined,
				1,
				0
			);

			// Draw the sides
			this.canvas.fillRect(
				left.x,
				left.y - (this.radius + this.backPadding),
				right.x - left.x,
				(this.radius + this.backPadding) * 2,
				this.game.backColor,
				1
			);

			// Draw the right circle
			this.canvas.drawCircle(
				right,
				this.radius + this.backPadding,
				this.game.backColor,
				undefined,
				1,
				0
			);
		}

		if (this.quantise) {
			this.canvas.drawCircle(
				left,
				this.radius - this.padding,
				this.quantiseColor,
				undefined,
				this.alpha,
				0
			);
			this.canvas.fillRect(
				left.x,
				left.y - (this.radius - this.padding),
				right.x - left.x,
				(this.radius - this.padding) * 2,
				this.quantiseColor,
				this.alpha
			);
			this.canvas.drawCircle(
				right,
				this.radius - this.padding,
				this.quantiseColor,
				undefined,
				this.alpha,
				0
			);
		}

		if (this.shadowBlur) {
			this.canvas.ctx.save();
			this.canvas.ctx.shadowBlur = this.shadowBlur;
			this.canvas.ctx.shadowColor = tint;
		}

		if (this.goodThreshold) {
			// Draw left circle
			this.canvas.drawCircle(
				left,
				(this.radius - this.padding),
				this.goodThresholdLeftColorBack,
				undefined,
				this.alpha,
				0,
			);

			const rightCirclePos = Vector.Lerp(
				left,
				right,
				(this.goodThreshold - this.drawBothThreshold) / (1 - this.drawBothThreshold)
			);

			// left.y - (this.radius - this.padding),
			// (this.radius - this.padding) * 2,

			// draw left part of threshold bar
			this.canvas.fillRect(
				left.x,
				left.y - (this.radius - this.padding),
				(rightCirclePos.x - left.x) - this.strokeWidth,
				(this.radius - this.padding) * 2,
				this.goodThresholdLeftColorBack,
				this.alpha
			);

			// Draw right part
			this.canvas.fillRect(
				rightCirclePos.x + this.strokeWidth,
				left.y - (this.radius - this.padding),
				(right.x - rightCirclePos.x) - this.strokeWidth,
				(this.radius - this.padding) * 2,
				this.goodThresholdRightColorBack,
				this.alpha
			);

			// draw right circle
			this.canvas.drawCircle(
				right,
				(this.radius - this.padding),
				this.goodThresholdRightColorBack,
				undefined,
				this.alpha,
				0,
			);

			// this.flashLengths = [1, 0];
			// this.flashTints = [0, 1];
			// this.flashTimer = 0;
			// this.flashT = 0;
			// this.flashPhase = 0;
			// // 0: wait to flash
			// // 1: increase in length to max
			// // 2: fade out

			if (this.flashPhase == 0) {
				this.flashTimer += this.game.delta;
				if (this.flashTimer > 20) {
					this.flashTimer = 0;
					this.flashPhase = 1;
					this.flashTints[1] = 1;
				}
			} else if (this.flashPhase == 1) {
				this.flashT = Maths.lerp(this.flashT, 1, 0.2, 0.01);
				this.flashLengths[1] = this.flashT;

				if (this.flashT == 1) {
					this.flashPhase = 2;
				}
			} else if (this.flashPhase == 2) {
				this.flashT = Maths.lerp(this.flashT, 0, 0.05, 0.01);
				this.flashTints[1] = this.flashT;

				if (this.flashT == 0) {
					this.flashPhase = 0;
					this.flashLengths[1] = 0;
				}
			}

			for (var i = 0; i <= 1; i++) {
				// Draw the left (circular) part of the bar.
				const value = this.flashLengths[i] * this.value;

				const goodThresholdLeftColor = this.game.cacheColorLerp(
					this.goodThresholdLeftColorTarget,
					this.game.textColor,
					0.125 + this.flashTints[i] * 0.35
				);

				const goodThresholdRightColor = this.game.cacheColorLerp(
					this.goodThresholdRightColorTarget,
					this.game.textColor,
					0.125 + this.flashTints[i] * 0.35
				);

				const r = value < this.drawBothThreshold ? (value / this.drawBothThreshold) : 1;
				this.canvas.drawCircle(
					left,
					(this.radius - this.padding) * r,
					goodThresholdLeftColor,
					undefined,
					this.alpha,
					0,
				);

				const rightValuePos = Vector.Lerp(
					left,
					right,
					(value - this.drawBothThreshold) / (1 - this.drawBothThreshold)
				);

				// Draw the left (rect) part of the bar
				if (value >= this.drawBothThreshold) {
					this.canvas.fillRect(
						left.x,
						left.y - (this.radius - this.padding),
						(Math.min(rightCirclePos.x, rightValuePos.x) - left.x) - this.strokeWidth,
						(this.radius - this.padding) * 2,
						goodThresholdLeftColor,
						this.alpha
					);
				}

				// Draw the right (rect) part of the bar.
				if (value > this.goodThreshold) {
					this.canvas.fillRect(
						rightCirclePos.x + this.strokeWidth,
						left.y - (this.radius - this.padding),
						(rightValuePos.x - rightCirclePos.x) - this.strokeWidth,
						(this.radius - this.padding) * 2,
						goodThresholdRightColor,
						this.alpha
					);

					this.canvas.drawCircle(
						rightValuePos,
						(this.radius - this.padding) * r,
						goodThresholdRightColor,
						undefined,
						this.alpha,
						0,
					);
				}
			}
		}

		// Draw the left arc
		this.canvas.drawCircle(
			left,
			this.radius,
			undefined,
			this.sideTint ? this.sideTint : tint,
			0,
			this.alpha,
			-Math.PI * 0.5,
			-Math.PI * 1.5,
			true,
			this.strokeWidth
		);
		// Draw the sides
		this.canvas.drawLine(
			left.x,
			left.y - this.radius,
			right.x,
			right.y - this.radius,
			this.sideTint ? this.sideTint : tint,
			this.alpha,
			this.strokeWidth
		);

		this.canvas.drawLine(
			left.x,
			left.y + this.radius,
			right.x,
			right.y + this.radius,
			this.sideTint ? this.sideTint : tint,
			this.alpha,
			this.strokeWidth
		);

		// Draw the right arc
		this.canvas.drawCircle(
			right,
			this.radius,
			undefined,
			this.sideTint ? this.sideTint : tint,
			0,
			this.alpha,
			-Math.PI * 0.5,
			-Math.PI * 1.5,
			false,
			this.strokeWidth
		);

		if (this.noBarStyle) {
			const rightCirclePos = Vector.Lerp(
				left,
				right,
				(this.value - this.drawBothThreshold) / (1 - this.drawBothThreshold)
			);

			this.canvas.drawCircle(
				rightCirclePos,
				this.radius - this.padding,
				tint,
				undefined,
				this.alpha,
				0
			);

			return;
		}

		if (this.shadowBlur) {
			this.canvas.ctx.restore();
		}

		const barColor = tint;
		const r = this.value < this.drawBothThreshold ? (this.value / this.drawBothThreshold) : 1;

		if (this.goodThreshold) return;

		// Draw the first circle\
		// const barColor = this.value == 1 ? this.rainbow.color : tint;
		this.canvas.drawCircle(
			left,
			(this.radius - this.padding) * r,
			barColor,
			undefined,
			this.alpha,
			0,
		);
		if (this.value >= this.drawBothThreshold) {
			// Draw the last circle
			const rightCirclePos = Vector.Lerp(
				left,
				right,
				(this.value - this.drawBothThreshold) / (1 - this.drawBothThreshold)
			);

			this.canvas.drawCircle(
				rightCirclePos,
				this.radius - this.padding,
				barColor,
				undefined,
				this.alpha,
				0
			);
			// Draw the inbetween
			this.canvas.fillRect(
				left.x,
				left.y - (this.radius - this.padding),
				rightCirclePos.x - left.x,
				(this.radius - this.padding) * 2,
				barColor,
				this.alpha
			);
		}
	}
}

export default LoadingBar;