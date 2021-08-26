import Maths from './Maths';
import AsciiGraph from './AsciiGraph';

class Tween {
  constructor(game, start=0, end=1, speed=1, pow=0.5, mode='in-out', func) {
    this.pow = pow;
    this.mode = mode;
    this.reset();
    this.game = game;
    this.speed = speed;
    if (func) {
      this.func = func;
    }
    this.started = false;
    this.finished = false;
  }

  update() {
    if (this.started && !this.finished) {
      this.delay -= this.game.delta;
      if (this.delay <= 0) {
        this.delay = 0;
        this.t += this.game.delta * this.speed;
        if ((this.speed > 0 && this.t >= this.endT) || (this.speed < 0 && this.t <= this.endT)) {
          this.t = this.endT;
          this.finished = true;
        }
      }
    }
  }

  start(mode, delay=0) {
    this.reset(mode);
    this.delay = delay;
    this.started = true;
  }

  pause() {
    this.started = false;
  }

  end() {
    this.t = this.endT;
    this.finished = true;
  }

  reset(mode) {
    if (mode) this.mode = mode;
    this.startT = this.t = this.mode === 'out' ? 0 : -1;
    this.endT = this.mode === 'in' ? 0 : 1;
    this.finished = false;
  }

  value() {
    return this.func(this.t);
  }

  debug(label='graph debug:') {
    const points = [];
    for (var t = this.startT; t <= this.endT; t += 0.05) {
      points.push(this.func(t));
    }

    window.tlog('default', label);
    window.tlog('default', AsciiGraph(points));
  }
}

// https://thebookofshaders.com/05/kynd.png

class Tween_Instant extends Tween {
  func() {
    return Maths.lerp(this.start, this.end, this.endT);
  }
}

class Tween_Linear extends Tween {
  func() {
    return Maths.lerp(-1, 1, (this.t + 1) * 0.5);
  }
}

class Tween1 extends Tween {
  func() {
    return 1 - Math.pow(Math.abs(this.t), this.pow);
  }
}

class Tween2 extends Tween {
  func() {
    return Math.pow(Math.cos(Math.PI * this.t * 0.5), this.pow)
  }
}

class Tween3 extends Tween {
  func() {
    return 1 - Math.pow(Math.abs(Math.sin(Math.PI * this.t * 0.5)), this.pow);
  }
}

class Tween4 extends Tween {
  func() {
    return Math.pow(Math.min(Math.cos(Math.PI * this.t * 0.5), 1 - Math.abs(this.t)), this.pow);
  }
}

class Tween5 extends Tween {
  func() {
    return 1 - Math.pow(Math.max(0, Math.abs(this.t) * 2 - 1), this.pow);
  }
}

const Tweens = {
  Tween,
  LINEAR:   Tween_Linear,
  INSTANT:  Tween_Instant,
  ONE:      Tween1,
  TWO:      Tween2,
  THREE:    Tween3,
  FOUR:     Tween4,
  FIVE:     Tween5,
};

export default Tweens;
