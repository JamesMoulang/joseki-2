import _ from '../joseki/underscore';

class AudioLayer {
	constructor(key, volume, muted) {
		this.key = key;
		this.volume = volume;
		this.muted = muted;
		this.master_volume = 1;
		this.master_muted = false;

		this.audioObjects = [];
	}

	addObject(obj) {
		this.updateAudioObject(obj);
		this.audioObjects.push(obj);
	}

	updateAllAudioObjects() {
		_.each(this.audioObjects, (obj) => {
			this.updateAudioObject(obj);
		});
	}

	updateAudioObject(obj) {
		let mute_volume = this.muted ? 0 : 1;
		let master_mute_volume = this.master_muted ? 0 : 1;
		obj.setVolume(mute_volume * master_mute_volume * this.volume);
	}

	update() {
		this.audioObjects = _.filter(this.audioObjects, (obj) => {
			return !obj.playedOnce;
		});

		_.each(this.audioObjects, (obj) => {
			obj.update();
		});
	}
}

export default AudioLayer;