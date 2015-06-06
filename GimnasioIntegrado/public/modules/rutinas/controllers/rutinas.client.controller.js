'use strict';

// Rutinas controller
angular.module('rutinas').controller('RutinasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rutinas', '$http',
	function($scope, $stateParams, $location, Authentication, Rutinas, $http) {
		$scope.authentication = Authentication;
		$scope.countdia = 1;
		$scope.listaEj = [];
		$scope.dia = {};

		$scope.mostrarEjercicios = function(){
			$http.get('/ejercicios').
			  success(function(respuesta) {
					$scope.ejercicios = respuesta;
			  }).
			  error(function(data, status, headers, config) {
			    console.log('Error petición get /ejercicios');
			  });
		};

		$scope.addEjercicio = function(){
			if(this.ejercicio && this.repeticiones){
				$scope.listaEj.push({'ejercicio': this.ejercicio, 'repeticiones': this.repeticiones});
			}else{
				alert('Seleccione un ejercicio y un número de repeticiones o duración');
			}
			$scope.ejercicio = '';
			$scope.repeticiones = '';
		};

		$scope.addDia = function(){
			if($scope.countdia <= 7){
				$scope.dia['dia' + $scope.countdia] = $scope.listaEj;
				$scope.countdia++;
				$scope.listaEj = [];
			}else{
				alert('Ya ha agregado 7 días');
			}
		};

		// Create new Rutina
		$scope.create = function() {

			//Para que no de error de object y pueda lanzar el mensaje de error del models
			// var nSemanas, nDias;
			// if(Object.keys($scope.semanas).length){
			// 	// nSemanas = Object.keys($scope.semanas).length;
			// 	nDias = Object.keys($scope.semanas.Semana1).length;
			// }

			var rutina = new Rutinas ({
				nombre: this.nombre,
				objetivo: this.objetivo,
				descripcion: this.descripcion,
				nSemanas: this.nSemanas,
				nDias: Object.keys($scope.dia).length || 0,
				ejercicios: $scope.dia
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
				$scope.ejercicios = {};
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
