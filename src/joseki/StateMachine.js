import _ from 'underscore';

class StateMachine {
	constructor(states, game) {
		this.currentState = null;
		this.states = states;
		this.game = game;

		this.backButtonStates = ['jlpt_config', 'syllabary', 'syllabary_toki_pona', 'credits'];
		this.menuButtonStates = ['jlpt_config', 'menu', 'syllabary', 'menu_toki_pona', 'syllabary_toki_pona'];
	}

	onPause() {
		if (this.currentState != null) {
			this.currentState._pause();
		}
	}

	onResume() {
		if (this.currentState != null) {
			this.currentState._resume();
		}
	}

	update() {
		if (this.currentState != null) {
			this.currentState._update();
		}
	}

	render() {
		if (this.currentState != null) {
			this.currentState._render();
		}
	}

	postRender() {
		if (this.currentState != null) {
			this.currentState._postRender();
		}
	}

	addState(newstate) {
		var matchingKeys = _.filter(this.states, (state) => {
			return state.key == newstate.key;
		});

		if (matchingKeys.length > 0) {
			console.warn("Already have a state with key " +newstate.key);
		} else {
			this.states.push(newstate);
		}
	}

	reload() {
		this.currentState.exit();
		if (this.currentState.refresh) this.currentState = new this.currentState.constructor();
		this.currentState.enter(this.game);
	}

	switchState(key, clear) {
		console.log("Switching to state: " + key);

		if (typeof(clear) !== 'undefined' && clear) {
			this.game.clearEntities();
		}

		var nextState = _.findWhere(this.states, {key});
		if (nextState !== undefined) {
			if (this.currentState !== null) {
				this.currentState.exit(key);
			}

			if (nextState.refresh) {
				nextState = new nextState.constructor();
			}

			this.currentState = nextState;
			const enter_break = this.currentState.enter(this.game);

			if (enter_break) {
				this.switchState(enter_break);
				return;
			}

			if (this.game.audioManager && document.hasFocus()) {
				_.each(this.game.audioManager.musics, (val, key) => {
					if (key == this.currentState.musicKey) {
						if (!val.playing()) val.play();
					} else {
						val.stop();
						if (val.secondTrack) val.secondTrack.stop();
					}
				});
			}

			this.game.mouseinput.waiting_for_up = true;

			if (this.game.menuButton) {
				this.game.menuButton.setShowing(this.menuButtonStates.indexOf(key) > -1);
			}

			if (this.game.backButton) {
				this.game.backButton.setShowing(this.backButtonStates.indexOf(key) > -1);
			}
		} else {
			console.warn("No state with key " + key);
		}
	}
}

export default StateMachine;