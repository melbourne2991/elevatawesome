var services = angular.module('app.services', []);

services.factory('Elevator', [function() {
	var Elevator = function(id) {
		this.id = id;
		this.currentLevel = 1;
		this.nextLevel = false;																		
		this.onBoard = 0;
		this.speed = 3000;
	};	

	Elevator.prototype.calculateNextLevel = function() {

	};

	Elevator.prototype.boardPeople = function(people) {

	};

	Elevator.prototype.goToNextLevel = function() {

	};

	return Elevator;
}]);


services.factory('Level', [function() {
	var Level = function(id, people_waiting) {
		this.id = id;
		this.peopleWaiting = people_waiting;
		this.nextlevelSelected = false;
	};

	return Level;
}]);

services.factory('Building', ['Level', 'Elevator', function(Level, Elevator) {
	var Building = function(levels_quantity, elevators_quantity) {
		var levels = [];

		for(var i = 0; i < levels_quantity; i++) {
			var rand_num = Math.floor((Math.random() * 10));
			var level = new Level(i+1, rand_num);
			levels.push(level);
		}

		this.levels = levels;

		var elevators = [];

		for(var i = 0; i < elevators_quantity; i++) {
			var elevator = new Elevator(i+1);
			elevators.push(elevator);
		}

		this.elevators = elevators;
	};

	return Building;
}]);