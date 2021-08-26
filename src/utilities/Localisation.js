import _ from '../joseki/underscore';

const LOC_DATA = Object.assign({}, {
	jlpt_unlock: {
		UK: "Congratulations, you've unlocked JLPT mode! → → You can play this challenge mode to practise hiragana and katakana at the same time.",
	},
});

class LocalisationManager {
	constructor(game, region) {
		this.region = region;
		this.game = game;
	}

	line(token='missing') {
		let txt = '';

		// console.log(token, LOC_DATA);

		let line = LOC_DATA[token];
		line = LOC_DATA[token];
		if (line === undefined) {
			line = LOC_DATA['missing'];
			console.log("missing", token);
		}

		if (line[this.game.getCurrentSaveKey()]) {
			line = line[this.game.getCurrentSaveKey()];
		} else if (line.default) {
			line = line.default;
		} else {
			// then it's fine
		}

		// console.log(line, LOC_DATA);

		window.tlog('default', line, this.region);
		
		if (line[this.region] !== undefined) {
			txt = line[this.region];
		} else if (line.UK !== undefined) {
			txt = line.UK;
		} else {
			txt = LOC_DATA.missing.UK;
		}

		_.each(arguments, (arg, arg_index) => {
			if (arg_index == 0) return;

			const token = '<t' + (arg_index - 1).toString() + '>';
			window.tlog('default', 'replace ' + token + ' with ' + arg);

			txt = txt.replace(token, arg);
		});

		window.tlog('default', txt);

		return txt;
	}

	static Regions() {
		return {
			UK: 'UK',
			US: 'US',
			FR: 'FR',
			CHINA: 'CHINA',
		};
	}
}

export default LocalisationManager;