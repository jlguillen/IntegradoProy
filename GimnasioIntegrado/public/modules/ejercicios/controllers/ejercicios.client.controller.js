'use strict';

// Ejercicios controller
angular.module('ejercicios').controller('EjerciciosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ejercicios',
	function($scope, $stateParams, $location, Authentication, Ejercicios) {
		$scope.authentication = Authentication;

		// Create new Ejercicio
		$scope.create = function() {
			// Create new Ejercicio object
			var ejercicio = new Ejercicios ({
				nombre: this.nombre,
				descripcion: this.descripcion,
				foto: this.foto
			});

			// Redirect after save
			ejercicio.$save(function(response) {
				$location.path('ejercicios');

				// Clear form fields
				$scope.nombre = '';
				$scope.descripcion = '';
				$scope.foto = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ejercicio
		$scope.remove = function(ejercicio) {
			if ( ejercicio ) {
				ejercicio.$remove();

				for (var i in $scope.ejercicios) {
					if ($scope.ejercicios [i] === ejercicio) {
						$scope.ejercicios.splice(i, 1);
					}
				}
			} else {
				$scope.ejercicio.$remove(function() {
					$location.path('ejercicios');
				});
			}
		};

		// Update existing Ejercicio
		$scope.update = function() {
			var ejercicio = $scope.ejercicio;

			ejercicio.$update(function() {
				$location.path('ejercicios');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ejercicios
		$scope.find = function() {
			$scope.ejercicios = Ejercicios.query();
		};

		// Find existing Ejercicio
		$scope.findOne = function() {
			$scope.ejercicio = Ejercicios.get({
				ejercicioId: $stateParams.ejercicioId
			});
		};
	}
]);
