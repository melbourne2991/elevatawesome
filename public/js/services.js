var services = angular.module('app.services', []);

services.factory('Elevator', ['$timeout', function($timeout) {
	var Elevator = function(id, building) {
		this.id = id;
		this.currentLevelId = 1;																	
		this.people = [];
		this.speed = 3000;
		this.building = building;
		this.levels = building.levels;
		this.destinations = [];
	};	

	Elevator.prototype.currentLevel = function() {
		return _.find(this.building.levels, function(level) {
			return level.id === this.currentLevelId;
		}.bind(this));
	};

	Elevator.prototype.init = function() {
		this.boardPeople();
		this.dropPeople();
		this.goToNextLevel();
	};

	Elevator.prototype.boardPeople = function() {
		var currentLevel = this.currentLevel();

		// Check what total will be after boarding.
		var total_if_board = currentLevel.people.length + this.people.length;

		if(currentLevel.people.length && total_if_board < this.building.maxPerElevator) {
			// Remove people from current level
			var people = _.remove(currentLevel.people, function() {
				return true;
			});

			// If the elevator was empty and new people have
			// boarded, they will determine the elevator's direction
			if(!this.people.length && people.length) {
				this.direction = people[0].goingToLevel > currentLevel.id ? 'up' : 'down';
			}

			// Add people to elevator
			this.people = this.people.concat(people);
		}
	};

	Elevator.prototype.dropPeople = function() {
		var currentLevel = this.currentLevel();

		// If this is destination for group of people remove them from the elevator
		var removed = _.remove(this.people, function(group) {
			return currentLevel.id === group.goingToLevel;
		});
	};

	Elevator.prototype.goToNextLevel = function() {
		var currentLevel = this.currentLevel();
		var next_level = this.currentLevelId;

		if(this.people.length) {
			var destinations = _.map(this.people, function(person) {
				return person.goingToLevel;
			});

			var closest_destination = _.min(destinations, function(destination) {
				return Math.sqrt(Math.pow(destination - currentLevel.id, 2));
			});

			next_level = closest_destination;
		} else {
			var closest_level_with_people = _.min(this.building.levels, function(level) {
				if(level.people.length > 0) {
					return Math.sqrt(Math.pow(level.id - currentLevel.id, 2));
				} 
			});

			// If there are no levels with people infinity will be returned. Do nothing, stay on level.
			if(typeof closest_level_with_people === 'number' && !isFinite(closest_level_with_people)) {
				next_level = currentLevel.id;
			} else {
				next_level = closest_level_with_people.id;
			}
		}

		this.currentLevelId = next_level;

		$timeout(function() {
			this.init();
		}.bind(this), 2000);
	};

	return Elevator;
}]);


services.factory('Level', [function() {
	var Level = function(id, people) {
		this.id = id;
		this.people = [];
	};

	return Level;
}]);

services.factory('Person', [function() {
	var Person = function(going_to_level) {
		this.goingToLevel = going_to_level;
	};

	return Person;
}]);

services.factory('Building', ['Level', 'Elevator', 'Person', '$timeout', function(Level, Elevator, Person, $timeout) {
	var Building = function(levels_quantity, elevators_quantity, max_per_elevator) {
		var levels = [];

		for(var i = 0; i < levels_quantity; i++) {
			// Create a new level.
			var level = new Level(i+1);

			// Randomize people quantity 
			var rand_people = _.range(_.random(0, 10));

			level.people = _.compact(_.map(rand_people, function(i) {
				// Randomize go to level for people
				return i > 0 ? new Person(_.random(1, levels_quantity)) : false;
			}));

			// Add level to building
			levels.push(level);
		}

		// Init elevators.
		this.levels = levels;

		var elevators = [];

		for(var i = 0; i < elevators_quantity; i++) {
			var elevator = new Elevator(i+1, this);
			elevators.push(elevator);
		}

		// Assign elevators to building
		this.elevators = elevators;
		this.maxPerElevator = max_per_elevator;
	};

	// Kick off the process!
	Building.prototype.init = function() {
		// Action each elevator asyncronously
		_.forEach(this.elevators, function(elevator) {
			$timeout(function() { 
				elevator.init() 
			});
		});
	};

	return Building;
}]);