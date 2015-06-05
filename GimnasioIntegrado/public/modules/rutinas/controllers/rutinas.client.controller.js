'use strict';

// Rutinas controller
angular.module('rutinas').controller('RutinasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rutinas', '$http',
	function($scope, $stateParams, $location, Authentication, Rutinas, $http) {
		$scope.authentication = Authentication;
		$scope.countdia = 1;
		$scope.countsemana = 1;
		$scope.listaEj = [];
		$scope.dia = {};
		$scope.semanas = {};

		$scope.mostrarEjercicios = function(){
			$http.get('/ejercicios').
			  success(function(respuesta) {
					$scope.ejercicios = respuesta;
			  }).
			  error(function(data, status, headers, config) {
			    console.log('Error');
			  });
		};

		$scope.addEjercicio = function(){
			$scope.listaEj.push({'ejercicio': this.ejercicio.nombre, 'repeticiones': this.repeticiones});
			$scope.ejercicio = '';
			$scope.repeticiones = '';
		};

		$scope.addDia = function(){
			$scope.dia['dia' + $scope.countdia] = $scope.listaEj;
			$scope.countdia++;
			$scope.listaEj = [];
		};

		$scope.addSemana = function(){
			$scope.semanas['Semana' + $scope.countsemana] = $scope.dia;
			$scope.dia = {};
			$scope.countdia = 1;
			$scope.countsemana++;

		};


		// Create new Rutina
		$scope.create = function() {
			// Create new Rutina object
			var rutina = new Rutinas ({
				nombre: this.nombre,
				objetivo: this.objetivo,
				descripcion: this.descripcion,
				nSemanas: Object.keys($scope.semanas).length, //contar los registros del JSON
				nDias: Object.keys($scope.semanas.Semana1).length,
				ejercicios: $scope.semanas //tiene que ser un array así que...
			});

			// Redirect after save
			rutina.$save(function(response) {
				$location.path('rutinas/' + response._id);

				// Clear form fields
				$scope.nombre = '';
				$scope.objetivo = '';
				$scope.descripcion = '';
				$scope.nSemanas = '';
				$scope.nDias = '';
				$scope.ejercicios = [];
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
