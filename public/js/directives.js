var directives = angular.module('app.directives', ['app.services']);

directives.directive('levelSelector', ['Person', function(Person) {
	return {
		templateUrl: 'templates/sidebar.html',
		link: function(scope, element) {
			scope.newQuantity; 
			scope.$watch('levelSelecting', function(n, o) {
				if(n && o !== n)
					scope.newQuantity = _.clone(scope.levelSelecting.people.length);
			});

			var updatePeople = function(going_to_level) {
				var newPeople = _.map(_.range(scope.newQuantity), function() {
					return new Person(going_to_level);
				});

				scope.levelSelecting.people = newPeople;
			};

			scope.selectNextLevel = function(level) {
				updatePeople(level.id);
				scope.showLevelSelect = false;
			};
		}
	};
}]);

directives.directive('elevator', [function() {
	return {
		transclude: true,
		templateUrl: 'templates/elevator.html'
	};
}]);

directives.directive('slider', ['$timeout', function($timeout) {
	return {
		transclude: true,
		scope: {
			elevators: '=',
			currentSlide: '='
		},
		templateUrl: 'templates/slider.html',
		controller: function($scope, $element) { 
			return {
				setElementWidth: function(width) {

				}
			}		
		},
		link: function(scope, element) {
			$timeout(function() {
				var slider = $(element).find('.slider');
				var currentWidth = slider.width();
				var sliderItems = $(element).find('[data-slider-item]');
				var sliderItemsCount = sliderItems.length

				if(!scope.currentSlide) scope.currentSlide = 1;

				var lessThanBreakpoint = function() {
					return $(window).width() < 768;
				};

				var resizeItems = function() {
					slider.css({width: currentWidth*sliderItemsCount + 'px'});

					_.forEach(sliderItems, function(sliderItem) {
						var sliderItem = $(sliderItem);
						sliderItem.css({
							width: currentWidth + 'px',
							float: 'left'
						});
					});			
				};

				var resetItems = function() {
					slider.css({width: ''});

					_.forEach(sliderItems, function(sliderItem) {
						var sliderItem = $(sliderItem);
						sliderItem.css({
							width: '',
							float: ''
						});
					});		
				};

				if(lessThanBreakpoint()) {
					resizeItems();
				}

				var resize_switch = false;

				$(window).resize(function() {
					var original_switch = resize_switch;
					var resize_switch = lessThanBreakpoint();

					console.log(resize_switch);

					if(resize_switch) {
						resizeItems();
					} else if(resize_switch !== original_switch && resize_switch === false) {
						resetItems();
					}
				});

				// Change slide on scope change.
				scope.$watch('currentSlide', function(n) {
					var new_margin = -(n-1) * $(sliderItems[0]).width();

					slider.css({
						marginLeft: new_margin + 'px'
					});	
				});
			});
		},
	};
}]);

directives.directive('slideSelector', ['$timeout', function($timeout) {
	return {
		transclude: true,
		templateUrl: 'templates/slide_select_mobile.html',
		link: function(scope, element, attrs, controller) {
			scope.selectSlide = function(newSlide) {
				scope.currentSlide = newSlide;
			};
		}
	};
}]);

directives.directive('sliderItem', [function() {
	return {
		scope: {

		},
		require: '^slider',
		controller: function($scope, $element, $attrs) {

		},
		link: function(scope, element, attrs, ctrl) {

		}
	};
}]);

directives.directive('elevatorPosition', [function() {
	return {
		scope: {
			elevatorPosition: '=',
			elevatorSpeed: '='
		},
		require: '^slider',
		controller: function($scope, $element, $attrs) {

		},
		link: function(scope, element, attrs, ctrl) {
			var height = $(element).height();
			var fromBottom = scope.elevatorPosition;

			scope.$watch('elevatorPosition', function(n) {
				$(element).css({
					bottom: height * (n-1)  + 'px',
				});
			});
		}
	};
}]);