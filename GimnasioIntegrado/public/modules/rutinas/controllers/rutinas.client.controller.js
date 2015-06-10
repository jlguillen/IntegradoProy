'use strict';

// Rutinas controller
angular.module('rutinas').controller('RutinasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rutinas', '$http',
	function($scope, $stateParams, $location, Authentication, Rutinas, $http) {
		$scope.authentication = Authentication;
		$scope.countdia = 1;
		$scope.listaEj = [];
		$scope.dia = {};
		$scope.socioUser = {};
		$scope.hoy = new Date();
		$scope.muestraBotonPDF = false;

		$scope.toDay = function(){
			var d = new Date();
			$scope.hoy = d.getTime();
		};
		
		/*
		*Primero aparece un botón para pedir el pdf, y luego un enlace para verlo, una vez se haya creado.
		*/
		$scope.pedirPDF = function(id){
			$http.get('/PDFRutina/' + id).
				success(function(respuesta) {
					$scope.enlacePDF = respuesta;
					$scope.muestraBotonPDF = true;
				}).
				error(function(data, status, headers, config) {
					console.log('Error petición get /rutinas desde rutinas');
				});
		};

		$scope.mostrarSocioCore = function(idSocio){
			if(Authentication.user){

				if(Authentication.user._id.length && Authentication.user.roles[0] === 'cliente'){

					$http.get('/socios/' + idSocio).
						success(function(respuesta) {
							$scope.socioUser = respuesta;
						}).
						error(function(data, status, headers, config) {
							console.log('Error petición get /socioCore desde rutinas');
						});
				}
			}
		};

		$scope.$on('$stateChangeSuccess', function() {
			$scope.mostrarSocioCore($scope.authentication.user.idSocio);
			// console.log($scope.socioUser);
		});

		$scope.mostrarEjercicios = function(){
			$http.get('/ejercicios').
			  success(function(respuesta) {
					$scope.ejercicios = respuesta;
			  }).
			  error(function(error) {
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
