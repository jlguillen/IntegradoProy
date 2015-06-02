'use strict';

// Rutinas controller
angular.module('rutinas').controller('RutinasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rutinas',
	function($scope, $stateParams, $location, Authentication, Rutinas) {
		$scope.authentication = Authentication;

		// Create new Rutina
		$scope.create = function() {
			// Create new Rutina object
			var rutina = new Rutinas ({
				name: this.name
			});

			// Redirect after save
			rutina.$save(function(response) {
				$location.path('rutinas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Rutina
		$scope.remove = function(rutina) {
			if ( rutina ) { 
				rutina.$remove();

				for (var i in $scope.rutinas) {
					if ($scope.rutinas [i] === rutina) {
						$scope.rutinas.splice(i, 1);
					}
				}
			} else {
				$scope.rutina.$remove(function() {
					$location.path('rutinas');
				});
			}
		};

		// Update existing Rutina
		$scope.update = function() {
			var rutina = $scope.rutina;

			rutina.$update(function() {
				$location.path('rutinas/' + rutina._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rutinas
		$scope.find = function() {
			$scope.rutinas = Rutinas.query();
		};

		// Find existing Rutina
		$scope.findOne = function() {
			$scope.rutina = Rutinas.get({ 
				rutinaId: $stateParams.rutinaId
			});
		};
	}
]);