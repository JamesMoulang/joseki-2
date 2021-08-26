import _ from 'underscore';

_.mixin({
	pick: (arr) => {
		if (arr.length == 0) {
			return null;
		} else {
			return _.sample(arr, 1)[0];
		}
	},
	loop: (count, func) => {
		for (var i = 0; i < count; i++) {
			func(i, i / count);
		}
	},
	log: function(key) {
		let valid = true;
		if (this.logKeys) {
			if (!_.isUndefined(this.logKeys[key])) {
				valid = this.logKeys[key];
			}
		}
		if (valid) {
			const args = Array.from(arguments);
			// console.log(args);
			// console.log.apply(null, (key == 'default' ? [] : [key + ':']).concat(args.splice(1)));
		}
	}.bind(_),
	toggleLogKey: function(key) {
		if (!this.logKeys) {
			this.logKeys = {};
		}

		if (!this.logKeys[key]) {
			this.logKeys[key] = false;
		} else {
			this.logKeys[key] = !this.logKeys[key];
		}
	}.bind(_),
	flag: function(arr, check) {
		let flagged = false;
		_.each(arr, (val, index) => {
			if (check(val, index)) {
				flagged = true;
			}
		});
		return flagged;
	}
});

export default _;