import _ from '../joseki/underscore';

class AchievementChecker {
	constructor(game, data) {
		this.game = game;
		this.checkEvenIfOffline = true;

		this.lastCheckTime = 0;

		this.achievement_keys = [
			'NEW_ACHIEVEMENT_1_13',
		];

		this.checkFunctions = {
			NEW_ACHIEVEMENT_1_13: this.autoUnlock.bind(this),
		};

		// Create the client side achievement tracker
		this.achievements = {};
		_.each(this.achievement_keys, (key) => {
			this.achievements[key] = {
				key,
				is_achieved: false,
				check: this.checkFunctions[key],
			};
		});

		// Check if greenworks is initialised
		if (window.greenworks) {
			this.greenworks = window.greenworks;
		} else {
			console.warn("Greenworks not present in window.");
			this.active = false;
		}

		// If greenworks is initialised, get the current state of every achievement
		if (this.active) {
			_.each(this.achievements, (val, key) => {
				this.greenworks.getAchievement(
					key,
					(is_achieved) => {
						this.achievements[key].is_achieved = is_achieved;
					},
					(err) => {
						console.warn("Failed getting achievement");
						console.error(err);
					}
				);
			});
		}

		// Now check if any achievements need activating (unlikely at this point but might as well?)
		this.checkAchievements(data, true);
	}

	autoUnlock(data) {
		return true;
	}

	checkAchievements(data, force_check) {
		console.log("CHECKING ACHIEVEMENTS?", data, this.game.save, force_check, this.active, this.checkEvenIfOffline);
		if (this.game.isDemo) return;
		if (!this.game.save) return;
		if (!this.active && !this.checkEvenIfOffline) return;
		if (!force_check && Date.now() - this.lastCheckTime < 30000) return;

		console.log("CHECKING ACHIEVEMENTS");

		this.lastCheckTime = Date.now();

		_.each(this.achievements, (val, key) => {
			// console.log(val, key);
			if (!val.is_achieved && val.check(data)) {
				// Then it's time to unlock this achievement!
				// And if this succeeds, then make sure to mark it as achieved locally.
				// So we don't keep trying to activate it.
				if (this.greenworks) {
					this.greenworks.activateAchievement(
						key,
						() => {
							console.log("Successfully activated achievement " + key);
							this.achievements[key].is_achieved = true;
						},
						(err) => {
							console.warn("Failed activating achievement");
							console.error(err);
						}
					);
				} else {
					console.warn("Trying to activate " + key);
				}
			}
		});
	}
}

export default AchievementChecker;