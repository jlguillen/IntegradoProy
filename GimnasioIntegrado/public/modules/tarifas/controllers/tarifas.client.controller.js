'use strict';

// Tarifas controller
angular.module('tarifas').controller('TarifasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tarifas',
	function($scope, $stateParams, $location, Authentication, Tarifas) {
		$scope.authentication = Authentication;
		$scope.divCreate = false;
		$scope.divEdit = false;

		$scope.mostrarDivCreate = function(){
			//Escondo el div edit
			$scope.divEdit = false;
			if($scope.divCreate){
				$scope.divCreate = false;
			}else{
				$scope.divCreate = true;
			}
		};

		$scope.mostrarDivEdit = function(){
			//Muestro el div edit
			$scope.divEdit = true;
			//Escondo el div create
			$scope.divCreate = false;
			$scope.tarifaParaEditar = this.tarifa;

		};

		// Create new Tarifa
		$scope.create = function() {
			// Create new Tarifa object
			var tarifa = new Tarifas ({
				nombre: this.nombre,
				descripcion: this.descripcion,
				duracion: this.duracion,
				precio: this.precio
			});

			// Redirect after save
			tarifa.$save(function(response) {

				//Cuando añade la tarifa nueva, recarga la lista de tarifas:
				$scope.find();
				//Y esconde el form
				$scope.divCreate = false;


				// Clear form fields
				$scope.nombre = '';
				$scope.descripcion = '';
				$scope.duracion = '';
				$scope.precio = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tarifa
		$scope.remove = function(tarifa) {
			if ( tarifa ) {
				tarifa.$remove();

				for (var i in $scope.tarifas) {
					if ($scope.tarifas [i] === tarifa) {
						$scope.tarifas.splice(i, 1);
					}
				}
			} else {
				$scope.tarifaParaEditar.$remove(function() {
					//Cuando añade la tarifa nueva, recarga la lista de tarifas:
					$scope.find();
					//Y esconde el form
					$scope.divEdit = false;
				});
			}
		};

		// Update existing Tarifa
		$scope.update = function() {
			var tarifa = $scope.tarifaParaEditar;

			tarifa.$update(function() {
				//En vez de moverme de pantalla, oculto el divEdit:
				$scope.divEdit = false;
				// $location.path('tarifas/' + tarifa._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tarifas
		$scope.find = function() {
			$scope.tarifas = Tarifas.query();
		};

		// Find existing Tarifa
		$scope.findOne = function() {
			$scope.tarifa = Tarifas.get({
				tarifaId: $stateParams.tarifaId
			});
		};
	}
]);
