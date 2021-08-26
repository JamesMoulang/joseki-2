import axios from 'axios';
import _ from '../joseki/underscore';

import AchievementChecker from './AchievementChecker';

class Save {
	constructor(game) {
		this.game = game;
		this.active = true;

		if (window.greenworks) {
			try {
				window.greenworks.init();
				this.active = true;
			} catch (err) {
				console.error(err);
				console.warn("Failed to initialise Greenworks");
				this.active = false;
			}

			this.game.steamID = window.greenworks.getSteamId().steamId;
		} else {
			this.active = false;
		}

		this.mostRecentSaveType = 24;
		this.saveKey = 'joseki_save';
		this.data = this.load();

		// This function allows save data from previous versions of the game to be continued.
		// If the current save type does not match mostRecentSaveType, the player's save is cleared.
		this.data = this.updateSaveData(this.data);

		this.blocked = false;

		this.achievementChecker = new AchievementChecker(game, this.data);
		this.achievementChecker.active = this.active;
	}

	updateSaveData(_data) {
		let data = Object.assign({}, _data);

		return data;
	}

	newGame() {
		const data = {
		};
		console.log('new game data', data);
		return data;
	}

	// Save and load

	// Get save json either from greenworks if on steam, or localstorage if not / on web
	getSaveJSON() {
		console.log("get save json");

	 	if (window.electronLoad) {
	 		let res;

	 		try {
	 			res = window.electronLoad(this.saveKey + '.json', true, this.game.steamID);
	 		} catch (err) {
	 			console.log(err);
	 			return undefined;
	 		}

	 		if (res.err) {
	 			console.log('res.err');
	 			console.error(err);
	 			return undefined;
	 		} else if (!res.data) {
	 			console.log("no data in the new save area, but maybe there's data in root directory?");

	 			try {
		 			res = window.electronLoad(this.saveKey + '.json');
		 		} catch (err) {
		 			console.log(err);
		 			return undefined;
		 		}
	 		}

	 		if (res.err) {
	 			console.log('res.err');
	 			console.error(err);
	 			return undefined;
	 		} else if (!res.data) {
	 			console.log('!res.data');
	 			// Either this is the first time they loaded the game,
	 			// or they played the demo.
	 			// or there's an error

	 			const ls = localStorage.getItem(this.saveKey)

	 			if (ls) {
	 				this.game.saveLoadType = 'first time demo';
	 				// Then they played the demo.
	 				console.log("they played the demo");
	 				// So create a file and use the data we already have.
	 				this.setSaveJSON(ls);
	 				return ls;
	 			} else {
	 				this.game.saveLoadType = 'first time play';
	 				// Then they haven't played the game before.
	 				console.log("they haven't played the game before");
	 				return undefined;
	 			}
	 		} else {
	 			console.log("res.data");
	 			return res.data;
	 		}
	 	} else {
	 		console.log('local storage get item');
	 		this.game.saveLoadType = 'local storage';
	 		return localStorage.getItem(this.saveKey);
	 	}
	}

	// Set save json either from greenworks if on steam, or localstorage if not / on web
	setSaveJSON(data_stringified) {
		if (window.electronSave) {
			window.electronSave(data_stringified, this.saveKey + '.json', true, this.game.steamID);
		} else {
			localStorage.setItem(this.saveKey, data_stringified);
		}
	}

	load() {
		let json;
		try {
			json = this.getSaveJSON();
		} catch (err) {
			this.game.saveLoadType = 'err';
			console.log('err', err);
			this.blocked = true;
			return this.newGame();
		}

		try {
			if (json) {
				const parsed = JSON.parse(json);
				// window.tlog('default', parsed);
				console.log(parsed, parsed.save_type, this.mostRecentSaveType);
				if (parsed.save_type && parsed.save_type == this.mostRecentSaveType) {
					return parsed;
				} else {
					return this.newGame();
				}
			} else {
				return this.newGame();
			}
		} catch (err) {
			this.blocked = true;
			return this.newGame();
		}
	}

	getJSON() {
		return JSON.stringify(this.data);
	}

	save(force_check) {
		// console.log('save', this.tempDataCaching);
		if (this.tempDataCaching || this.spoofingCharacterPhase) return;

		const json = this.getJSON();
		try {
			this.setSaveJSON(json);
			if (this.onSave) this.onSave();
		} catch (err) {
			this.blocked = true;
		}

		this.achievementChecker.checkAchievements(this.data, force_check);
	}

	upload(result) {
		this.data = JSON.parse(result);
	}

	download() {
		const data = this.getJSON();
		const filename = this.saveKey + '_' + Date.now().toString();

		var file = new Blob([data], {type: "application/json"});
	    if (window.navigator.msSaveOrOpenBlob) // IE10+
	        window.navigator.msSaveOrOpenBlob(file, filename);
	    else { // Others
	        var a = document.createElement("a"),
	                url = URL.createObjectURL(file);
	        a.href = url;
	        a.download = filename;
	        document.body.appendChild(a);
	        a.click();
	        setTimeout(function() {
	            document.body.removeChild(a);
	            window.URL.revokeObjectURL(url);  
	        }, 0); 
	    }
	}

	reset() {
		this.data = this.newGame();
		this.save();
	}
}

export default Save;