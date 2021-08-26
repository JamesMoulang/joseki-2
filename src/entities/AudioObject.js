import howler from 'howler';
const Howl = howler.Howl;
import Maths from '../joseki/Maths';

class AudioObject {
	constructor(game, key, options) {
		this.game = game;
		this.key = key;
		this.howl = new Howl(Object.assign(options, {src: [this.game.audioCache[key]._src]}));
		this.volume = 1;
		if (options.hasOwnProperty('volume')) this.volume = options.volume;
		this.fading = false;
	}

	play() {
		this.howl.play();
	}

	duration() {
		return this.howl.duration();
	}

	// Play and immediately get removed from the layer.
	playOnce() {
		this.howl.play();
		this.howl.on('end', () => {
			this.playedOnce = true;
		});
	}

	setCurrentTime(time) {
		this.howl.seek(time);
	}

	getCurrentTime() {
		return this.howl.seek();
	}

	playing() {
		return this.howl.playing();
	}

	pause() {
		this.howl.pause();
	}

	stop() {
		this.howl.stop();
	}

	setVolume(volume) {
		this.howl.volume(this.volume * volume);
	}

	lerpVolume(target, t, snap) {
		this.volume = Maths.lerp(this.volume, target, t, snap);
	}

	update() {

	}
}

export default AudioObject;