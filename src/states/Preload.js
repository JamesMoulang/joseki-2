import State from '../joseki/State';
import _ from '../joseki/underscore';
import Maths from '../joseki/Maths';
import Vector from '../joseki/Vector';
import Group from '../joseki/Entities/Group';

import HintHighlighter from '../entities/HintHighlighter';
import LoadingBar from '../entities/LoadingBar';
import Save from '../entities/Save';
import AudioManager from '../entities/AudioManager';
import LocalisationManager from '../utilities/Localisation';

class Preload extends State {
	constructor(key='preload', nextStateKey='menu') {
		super(key);
		this.nextStateKey = nextStateKey;
	}

	initialisePalette() {
		this.game.backColor = '#21252D';
		this.game.textColor = '#F4F4F4';
		this.game.highlightColor = '#ff686b';
		this.game.altHighlightColor = '#a5ffd6';

		this.game.mainCanvas.backgroundColor = this.game.backColor;

		this.game.textColorRGB = Maths.colorRGB(this.game.textColor);
		this.game.backColorRGB = Maths.colorRGB(this.game.backColor);
		this.game.highlightColorRGB = Maths.colorRGB(this.game.highlightColor);
		this.game.altHighlightColorRGB = Maths.colorRGB(this.game.altHighlightColor);
	}

	initialiseCanvases() {
		this.game.mainCanvas = this.game.createCanvas('game');
		// this.game.mainCanvas.drawCircleGradientBackground = true;

		this.game.hintCanvas = this.game.createCanvas('hint');
		this.game.hintCanvas.transparent = true;

		this.game.debugCanvas = this.game.createCanvas('debug');
		this.game.debugCanvas.transparent = true;
		this.game.initDebug('debug');
	}

	initialiseGroups() {
		this.game.groups = {};

		this.game.groups.background = new Group(this.game, 'game');
		this.game.addEntity(this.game.groups.background);

		this.game.groups.main = new Group(this.game, 'game');
		this.game.addEntity(this.game.groups.main);

		this.game.groups.foreground = new Group(this.game, 'game');
		this.game.addEntity(this.game.groups.foreground);
	}

	initialiseLoadingBars() {
		this.loadingBars = [];
		this.loadingBars.push(new LoadingBar(
			this,
			'game',
			64,
			8,
			new Vector(this.game.width * 0.1, this.game.height * 0.5 - (64 + 32)),
			this.game.width * 0.8,
			() => {
				return 1 - (this.game.imagesLoading / this.game.totalImageCount)
			}
		));

		this.loadingBars.push(new LoadingBar(
			this,
			'game',
			64,
			8,
			new Vector(this.game.width * 0.1, this.game.height * 0.5 + (64 + 32)),
			this.game.width * 0.8,
			() => {
				return 1 - (this.game.audioLoadingCount / this.game.totalAudioCount)
			}
		));
	}

	loadAssets() {
		// Load some basic assets
		this.game.loadImage('dot', 'dot.png');
		this.game.loadAudio('click', 'audio/click.wav');
		this.game.loadAudio('music_menu', 'audio/music_menu.ogg');

		this.game.type_key_map = {};

		_.each('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', (letter) => {
			this.game.type_key_map[letter] = 'type_' + letter;
			this.game.loadImage('type_' + letter, 'type/' + letter + '.png');
		});

		_.each('!,comma,full_stop,hash,question,slash,star'.split(','), (letter) => {
			this.game.loadImage('type_' + letter, 'type/' + letter + '.png');
		});

		this.game.type_key_map['!'] = 'type_!';
		this.game.type_key_map[','] = 'type_comma';
		this.game.type_key_map['.'] = 'type_full_stop';
		this.game.type_key_map['#'] = 'type_hash';
		this.game.type_key_map['?'] = 'type_question';
		this.game.type_key_map['/'] = 'type_slash';
		this.game.type_key_map['*'] = 'type_star';
	}

	enter(game) {
		super.enter(game);

		// Create the localisation manager
		this.game.loc = new LocalisationManager(this.game, LocalisationManager.Regions().EN);

		// Set up canvases
		this.initialiseCanvases();

		// Set up colour palette (used by a lot of legacy code, cba to remove)
		this.initialisePalette();

		// Create a save data tracker
		this.game.save = new Save(this.game);
		this.game.save.save(true);

		// Create hint manager, used to grey out the screen and highlight specific sections
		this.game.hintManager = new HintHighlighter(this.game, 'hint');
		this.game.addEntity(this.game.hintManager);

		// Debug skip stuff
		this.game.addKeyEventListener((e) => {
			if (e.type == 'down' && !this.game.ignoreKeyShortcuts) {
				if (e.event.key.toLowerCase() == '!') {
					this.game.state.switchState(this.game.skipStateKey);
				}

				if (e.event.key.toLowerCase() == '}') {
					console.log("skipping...");
					window.skip();
				}
			}
		});

		// Create groups.
		this.initialiseGroups();

		// Create the actual loading bar UI elements
		this.initialiseLoadingBars();

		// Load images, audio, json, etc.
		this.loadAssets();
	}

	update() {
		super.update();

		// Check if we're done loading, move on to the next state if so.
		if (this.game.jsonLoading === 0 && this.loadingBars[0].value === 1 && this.loadingBars[1].value === 1) {
			this.game.state.switchState(this.nextStateKey);
		}
	}

	exit() {
		console.log(this.game.audioCache);
		this.game.audioManager = new AudioManager(this.game);
		this.game.addEntity(this.game.audioManager);

		_.each(this.loadingBars, (bar) => {
			bar.destroy();
		});
	}

	render() {

	}
}

export default Preload;