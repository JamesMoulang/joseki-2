import Entity from '../Entity';
import Vector from '../Vector';

import _ from 'underscore';

class Group extends Entity {
	constructor(
		game, 
		canvas, 
		key,
		reverse = true
	) {
		super(game, canvas, new Vector(0, 0));
		this.key = key;
		this.reverse = reverse;
		this.entities = [];

		this.switchQueue = [];
	}

	forEach(callback) {
		_.each(this.entities, callback);
	}

	count() {
		return this.entities.length;
	}

	push(entity) {
		entity.group = this;
		this.entities.push(entity);
		return entity;
	}

	unshift(entity) {
		entity.group = this;
		this.entities.unshift(entity);
		return entity;
	}

	remove(entity) {
		this.entities = _.without(this.entities, entity);
	}

	update() {
		super.update();
		// Sort entities by key.
		if (this.entities.length == 0) return;

		for (var i = this.entities.length - 1; i >= 0; i--) {
			if (this.entities[i].alive) {
				this.entities[i].update();
			} else {
				this.entities.splice(i, 1);
			}
		}

		this.entities = _.sortBy(this.entities, (entity) => {
			return entity[this.key] * (this.reverse ? -1 : 1);
		});

		_.each(this.switchQueue, (q) => {
			this.switch(q.entity, q.newGroup, q.push);
		});
		this.switchQueue = [];
	}

	queueSwitch(entity, newGroup, push) {
		this.switchQueue.push({entity, newGroup, push});
	}

	switch(entity, newGroup, push=true) {
		this.remove(entity);
		if (push) {
			newGroup.push(entity);
		} else {
			newGroup.unshift(entity);
		}
	}

	hintRender(canvas) {
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i]._hintRender(canvas);
		}
	}

	render() {
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].render();
		}
	}

	postRender() {
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].postRender();
		}
	}
}

export default Group;