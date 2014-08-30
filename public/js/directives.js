var directives = angular.module('app.directives', ['app.services']);

directives.directive('elevator', [function() {
	return {
		scope: {

		},
		controller: function($scope) { 

		},
		link: function(scope) {

		},
	}
}]);

directives.directive('slider', ['$timeout', function($timeout) {
	return {
		scope: {

		},
		controller: function($scope, $element) { 
			return {
				setElementWidth: function(width) {

				}
			}		
		},
		link: function(scope, element) {
			$timeout(function() {
				var currentWidth = $(element).width()
				var sliderItems = $(element).find('[data-slider-item]');
				var sliderItemsCount = sliderItems.length

				if($(window).width() < 768) {
					$(element).width(currentWidth*sliderItemsCount);

					_.forEach(sliderItems, function(sliderItem) {
						var sliderItem = $(sliderItem);
						sliderItem.css({
							width: currentWidth + 'px',
							float: 'left'
						});
					});
				}
			});
		},
	}
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
	}
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
	}
}]);