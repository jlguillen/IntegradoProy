'use strict';

// Socios controller
angular.module('socios').controller('SociosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Socios', 'ngTableParams', '$http',
	function($scope, $stateParams, $location, Authentication, Socios, NgTableParams, $http) {
		$scope.authentication = Authentication;
		// console.log($stateParams); //Aqui llega el parámetro, en este caso el id del socio

		var settings = {
			total: 0,
			counts: [5, 10, 15],
			getData: function($defer, params) {
					Socios.get(params.url(), function(response){
						params.total(response.total);
						$defer.resolve(response.results);
					});
			}
		};

		var params = {
			page: 1,
			count: 5
		};

		$scope.tableParams = new NgTableParams(params, settings);


		$scope.displayLocationDeletePopup = false;
		$scope.showDeleteLocationPopup = function(options, id) {
		    if (options === true) {
		        $scope.displayLocationDeletePopup = true;
		    } else {
		        $scope.displayLocationDeletePopup = false;
		    }
		    $scope.locationId = id;
		};

		$scope.deleteVendorLocation = function (storeLocation) {
		   $scope.remove();
		};


		$scope.mostrarRutinas = function(){
			$http.get('/rutinas').
			  success(function(respuesta) {
					$scope.rutinas = respuesta;
					// console.log(respuesta);
			  }).
			  error(function(data, status, headers, config) {
			    console.log('Error');
			  });
		};

		$scope.mostrarOneRutina = function(){
			var socio = $scope.socio;
			$http.get('rutinas/' + socio.rutina).
			  success(function(respuesta) {
					$scope.rutinaOnerutina = respuesta;
					console.log(respuesta.nombre);
			  }).
			  error(function(data, status, headers, config) {
			    console.log('Error OneRutina');
			  });
		};

		// Create new Socio
		$scope.create = function() {
			// Create new Socio object
			var socio = new Socios ({
				nombre: this.nombre,
				apellidos: this.apellidos,
				dni: this.dni,
				direccion: this.direccion,
				mail: this.mail,
				password: this.dni,
				telefono: this.telefono
			});

			// Redirect after save
			socio.$save(function(response) {

				console.log(response);

				var jsonUser = {
				  'username': response.nombre,
				  'password': response.dni,
					'idSocio': response._id,
				  'roles': ['cliente']
				};

				$http.post('/auth/signup', jsonUser).
				  success(function(respuesta) {
						console.log(respuesta);
				  }).
				  error(function(data, status, headers, config) {
				    console.log('Error');
				  });

				$location.path('socios/' + response._id);

				// Clear form fields
				$scope.nombre = '';
				$scope.apellidos = '';
				$scope.dni = '';
				$scope.direccion = '';
				$scope.mail = '';
				$scope.password = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Socio
		$scope.remove = function(socio) {

				if ( socio ) {
					socio.$remove();
					for (var i in $scope.socios) {
						if ($scope.socios [i] === socio) {
							$scope.socios.splice(i, 1);
						}
					}
				} else {
					$scope.socio.$remove(function() {
						$location.path('socios');
					});
				}
		};

		// Update existing Socio
		$scope.update = function() {
			var socio = $scope.socio;
			socio.$update(function() {
				$location.path('socios/' + socio._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Socios
		$scope.find = function() {
			$scope.socios = Socios.query();
		};

		// Find existing Socio
		$scope.findOne = function() {
			$scope.socio = Socios.get({
				socioId: $stateParams.socioId
			});
		};
	}
]);
