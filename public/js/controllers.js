var controllers = angular.module('app.controllers', ['app.services']);

controllers.controller('MainController', [
	'$scope',
	'$timeout',
	'Building',

	function($scope, $timeout, Building) {
		// Building takes three parameters, 
		// number of levels, number of elevators 
		// & max per elevator.
		var building = new Building(10, 4, 20);

		$scope.startElevators = building.init;

		$scope.elevators = building.elevators;
		$scope.levels = building.levels.reverse();

		$scope.showLevelSelect = false;
		$scope.levelSelecting = false;

		$scope.openSelectNextLevel = function(level) {
			if($scope.showLevelSelect) {
				$scope.showLevelSelect = false;
				$timeout(function() {
					$scope.levelSelecting = level;
					$scope.showLevelSelect = true;			
				}, 300)
			} else {
				$scope.levelSelecting = level;
				$scope.showLevelSelect = true;
			}
		};

		$scope.hideLevelSelect = function() {
			if($scope.showLevelSelect)
				$scope.showLevelSelect = false;
		};
	}]);
