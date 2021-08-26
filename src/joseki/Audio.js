import howler from 'howler';
const Howl = howler.Howl;
import _ from 'underscore';

var Audio = {
	cache: {},
	loadingCount: 0,

	load: function(key, urls) {
		this.loading = true;
		this.loadingCount++;

		if (typeof(urls) === "string") {
			urls = [urls];
		}

		urls = _.map(urls, (url) => {
			return '$assets' + url;
		});

		window.tlog('default', "loading ", urls);

		var sound = new Howl({
		  	src: urls,
		  	onloaderror: function(err) {
				this.cache[key] = null;
				console.warn("Couldn't put sound with url " + urls[0] + " and key " + key);
				this.loadingCount--;
			}.bind(this),
			onload: function() {
				this.loadingCount--;
			}.bind(this)
		});

		if (this.cache[key] != null) {
			console.warn("Already cached a sound with key " + key);
		} else {
			this.cache[key] = sound;
		}
	},

	create: function(key) {
		if (this.cache[key] == null) {
			console.warn("No cached sounds with key " + key);
			return null;
		} else {
			return new Howl({
			  	urls: [this.cache[key]._src]
			});
		}
	},

	isLoaded: function() {
		return this.loadingCount == 0 && this.loading;
	},

	play: function(key, volume=1) {
		if (this.cache[key] == null) {
			console.warn("Can't find a sound with key " + key);
		} else {
			this.cache[key].volume(volume);
			this.cache[key].play();
		}
	},

	getAudioTime: function(key) {
		if (this.cache[key] == null) {
			console.warn("Can't find a sound with key " + key);
		} else {
			return this.cache[key];
		}
	}
};

export default Audio;
