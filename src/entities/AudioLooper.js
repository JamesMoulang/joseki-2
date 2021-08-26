import AudioObject from './AudioObject';
import Maths from '../joseki/Maths';

class AudioLooper extends AudioObject {
	constructor(game, key, layer, options) {
		super(game, key, options);

		this.layer = layer;

		this.secondTrack = new AudioObject(game, key, options);
		this.tracks = [
			this,
			this.secondTrack
		];
		this.trackIndex = 0;
		this.nextTrackIndex = 1;

		this.fadeTime = 20;
		if (options.fadeTime) this.fadeTime = options.fadeTime;
		this.fadeEndTime = 0;
		if (options.fadeEndTime) this.fadeEndTime = options.fadeEndTime;
		this.fadeExp = 1;
		if (options.fadeExp) this.fadeExp = options.fadeExp;
		this.fadeOutLast = true;
		if (options.fadeOutLast) this.fadeOutLast = options.fadeOutLast;

		this.debugSkip = false;
		this.cheated = false;

		window.skipAudio = () => {
			this.trackIndex = 0;
			this.nextTrackIndex = 1;

			this.tracks[this.trackIndex].volume = 1;
			this.tracks[this.nextTrackIndex].volume = 0;

			this.layer.updateAudioObject(this.tracks[this.trackIndex]);
			this.layer.updateAudioObject(this.tracks[this.nextTrackIndex]);

			this.tracks[this.trackIndex].setCurrentTime(this.tracks[this.trackIndex].duration() - (this.fadeTime + 5));
		}

		window.addEventListener('blur', (event) => {
			this.tracks[0].pause();
			this.tracks[1].pause();
			this.blur = true;
		});

		window.addEventListener('focus', (event) => {
			this.blur = false;
			if ('music_' + this.game.state.currentState.musicKey == this.key) {
				this.tracks[this.trackIndex].play();
			}
		});
	}

	play() {
		super.play();
	}

	update() {
		if (this.blur) return;
		
		super.update();

		if (this.debugSkip && !this.cheated && this.duration() > 0) {
			this.cheated = true;
			console.log('cheating, duration is ' + this.duration());
			this.setCurrentTime(this.duration() - (this.fadeTime + 5));
		}

		if (this.tracks[this.trackIndex].playing() && this.tracks[this.trackIndex].duration() > 0) {
			const volume = Math.pow(Maths.remap(
				this.tracks[this.trackIndex].getCurrentTime(),
				0,
				1,
				this.tracks[this.trackIndex].duration() - this.fadeTime,
				this.tracks[this.trackIndex].duration() - this.fadeEndTime
			), this.fadeExp);

			// this.game.debug(this.key + ': ' + this.trackIndex);
			// this.game.debug(volume);

			if (volume > 0 && !this.tracks[this.nextTrackIndex].playing()) {
				this.tracks[this.nextTrackIndex].play();
				this.tracks[this.nextTrackIndex].setCurrentTime(
					this.tracks[this.trackIndex].getCurrentTime() -
					(this.tracks[this.trackIndex].duration() - this.fadeTime)
				);
			}

			if (this.fadeOutLast) {
				this.tracks[this.trackIndex].volume = 1 - volume;
				this.layer.updateAudioObject(this.tracks[this.trackIndex]);
			}

			this.tracks[this.nextTrackIndex].volume = volume;
			this.layer.updateAudioObject(this.tracks[this.nextTrackIndex]);
		} else {
			// Time to flip the tracks.
			if (this.trackIndex == 0) {
				this.trackIndex = 1;
				this.nextTrackIndex = 0;
			} else {
				this.trackIndex = 0;
				this.nextTrackIndex = 1;
			}
		}
	}

	debugRenderTrack(canvas, index, y) {
		// duration, current time, volume, max volume, playing

		// volume
		canvas.rect(0, y, 128, 16, {
			strokeAlpha: 0,
			fillAlpha: 1,
			fillColor: this.game.backColor,
		});

		canvas.rect(0, y, 128 * this.tracks[index].volume, 16, {
			strokeAlpha: 0,
			fillAlpha: 0.2,
			fillColor: this.game.textColor,
		});

		canvas.rect(0, y, 128, 16, {
			strokeAlpha: 1,
			strokeWidth: 1,
			fillAlpha: 0,
			strokeColor: this.game.textColor,
		});

		// duration

		canvas.rect(128 + 16, y, 512 * (this.tracks[index].getCurrentTime() / this.tracks[this.trackIndex].duration()), 16, {
			strokeAlpha: 0,
			fillAlpha: 0.4,
			fillColor: this.tracks[index].playing() ? this.game.highlightColor : this.game.textColor,
		});

		canvas.rect(128 + 16, y, 512, 16, {
			strokeAlpha: 1,
			strokeWidth: 1,
			fillAlpha: 0,
			strokeColor: this.tracks[index].playing() ? this.game.highlightColor : this.game.textColor,
		});
	}

	debugRender(canvas) {
		this.debugRenderTrack(canvas, 0, 0);
		this.debugRenderTrack(canvas, 1, 24);
	}
}

export default AudioLooper;