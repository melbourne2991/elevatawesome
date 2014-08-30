var controllers = angular.module('app.controllers', ['app.services']);

controllers.controller('MainController', [
	'$scope',
	'$timeout',
	'Building',

	function($scope, $timeout, Building) {
		var building = new Building(13, 4);

		building.elevators[0].currentLevel = 5;

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
		}

		$scope.selectNextLevel = function(level) {
			$scope.levelSelecting.nextLevelSelected = level;
			$scope.showLevelSelect = false;
		}
	}]);
