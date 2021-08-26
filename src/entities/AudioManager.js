import Entity from '../joseki/Entity';
import Maths from '../joseki/Maths';
import _ from '../joseki/underscore';

import AudioObject from './AudioObject';
import AudioLayer from './AudioLayer';
import AudioLooper from './AudioLooper';

// I play audio
	// Music
		// This isn't actually any different to a regular sound effect.
	// Sound effects
		// Key inputs
		// Everything else

class AudioManager extends Entity {
	constructor(game) {
		super(game, 'game');

		this.audioLayers = {
			master: new AudioLayer('master', 1, false),
			music: new AudioLayer('music', 1, false),
			typing: new AudioLayer('typing', 1, false),
			sfx: new AudioLayer('sfx', 1, false),
		};

		if (!this.game.save.data.volume) this.createAudioLayers();
		this.updateAudioLayers();

		this.music_menu = this.addLoopingAudio('music_menu', 'music', {
			fadeTime: 15,
			fadeEndTime: 1,
		});

		this.musics = {
			menu: this.music_menu,
		};
	}

	createAudioLayers() {
		this.game.save.data.volume = {};
		_.each(this.audioLayers, (val, key) => {
			this.game.save.data.volume[val.key] = {
				value: 1,
				on: true
			};
		});
	}

	updateAudioLayers() {
		const vol = this.game.save.data.volume;

		if (vol) {
			_.each(this.audioLayers, (val, key) => {
				val.volume = vol[val.key].value;
				if (key != 'master') val.volume *= vol.master.value;

				val.muted = !vol[val.key].on;
				if (key != 'master' && !vol.master.on) val.muted = true;
				val.updateAllAudioObjects();
			});
		}
	}

	addLoopingAudio(key, layer, options={}) {
		const obj = new AudioLooper(this.game, key, this.audioLayers[layer], options);
		this.audioLayers[layer].addObject(obj);
		this.audioLayers[layer].addObject(obj.secondTrack);
		return obj;
	}

	addAudio(key, layer, options={}) {
		const obj = new AudioObject(this.game, key, options);
		this.audioLayers[layer].addObject(obj);
		return obj;
	}

	update() {
		_.each(this.audioLayers, (val, key) => {
			val.update();
		});
	}

	render() {
		// this.music_menu.debugRender(this.game.getCanvas('game'));
	}
}

export default AudioManager;