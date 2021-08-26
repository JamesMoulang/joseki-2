class State {
	constructor(key, refresh=false) {
		this.key = key;
		this.game = null;
		this.refresh = refresh;
	}

	enter(game, width, height) {
		this.game = game;
		window.tlog('default', "entering state " + this.key);

		if (width && height) {
			this.game.updateDimensions(width, height, 16);
		}
	}

	_pause() {

	}

	pause() {

	}

	_resume() {

	}

	resume() {
		
	}

	_update() {
		if (this.game != null) {
			this.update();
		}
	}
	update() {
		
	}

	exit() {

	}

	_render() {
		if (this.game != null) {
			this.render();
		}
	}

	render() {

	}

	_postRender() {
		if (this.game != null) {
			this.postRender();
		}
	}

	postRender() {
		
	}
}

export default State;