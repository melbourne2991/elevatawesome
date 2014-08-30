var services = angular.module('app.services', []);

services.factory('Elevator', ['$timeout', function($timeout) {
	var Elevator = function(id, building) {
		this.id = id;
		this.currentLevelId = 1;																	
		this.people = [];
		this.speed = 3000;
		this.building = building;
		this.destinations = [];
		this.direction = false;
		this.totalBoardCount = 0;
	};	

	Elevator.prototype.currentLevel = function() {
		return _.find(this.building.levels, function(level) {
			return level.id === this.currentLevelId;
		}.bind(this));
	};

	var iterate = 0

	Elevator.prototype.init = function() {
		this.boardPeople();
		this.dropPeople();
		this.goToNextLevel();
	};

	Elevator.prototype.boardPeople = function() {
		var currentLevel = this.currentLevel();

		// Remove people from current level
		if(currentLevel.people.length) {
			var people = _.remove(currentLevel.people, function() {
				return true;
			})[0];

			// Add people to elevator
			this.people.push(people);

			// How many people do we have on board
			var count_people = 0;

			_.forEach(this.people, function(group) {
				count_people = count_people + group.quantity;
			});

			this.totalBoardCount = count_people;

			console.log('We now have ' + count_people + ' on board');

			// Add go to level for people to destinations
			this.destinations.push(people.goingToLevel);	
		}
	};

	Elevator.prototype.dropPeople = function() {
		var currentLevel = this.currentLevel();

		// If this is destination for group of people remove them from the elevator
		var removed = _.remove(this.people, function(group) {
			return currentLevel.id === group.goingToLevel;
		});

		if(removed.length > 0) {
			_.forEach(removed, function(p) {
				console.log(p.quantity + ' people have left the elevator, we are on level ' + currentLevel.id);
			})
		}
	};

	Elevator.prototype.goToNextLevel = function() {
		if(this.destinations[0] > this.currentLevelId) {
			this.currentLevelId++;
		} else {
			this.currentLevelId--;
		}

		// If we have reached a destination remove it
		var destination = _.remove(this.destinations, function(destination) {
			console.log(destination + '-'  + this.currentLevelId)
			return destination === this.currentLevelId;
		}.bind(this));

		console.log(destination);

		// Iterate.
		iterate++;
		if(iterate < 99) {
			$timeout(function() {
				this.init();
			}.bind(this), 3000)
		}
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

services.factory('People', [function() {
	var People = function(quantity, going_to_level) {
		this.quantity = quantity;
		this.goingToLevel = going_to_level;
	};

	return People;
}]);

services.factory('Building', ['Level', 'Elevator', 'People', function(Level, Elevator, People) {
	var Building = function(levels_quantity, elevators_quantity) {
		var levels = [];

		for(var i = 0; i < levels_quantity; i++) {
			// Create a new level.
			var level = new Level(i+1);

			// Randomize people quantity 
			var rand_people = Math.floor((Math.random() * 10));

			// Randomize go to level for people
			var rand_level = Math.floor((Math.random() * levels_quantity)) + 1;

			if(rand_people > 0) {
				var people = new People(rand_people, rand_level);

				// Add people level
				level.people.push(people);
			}

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
	};

	// Kick off the process!
	Building.prototype.init = function() {
		// Action each elevator, starting with elevator A.
		// _.forEach(this.elevators, function(elevator) {
			this.elevators[0].init();
		// });
	};

	return Building;
}]);