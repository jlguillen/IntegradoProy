'use strict';

// Socios controller
angular.module('socios').controller('SociosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Socios', 'ngTableParams', '$http',
	function($scope, $stateParams, $location, Authentication, Socios, NgTableParams, $http) {
		$scope.authentication = Authentication;


		$scope.toDay = function(){
			var d = new Date();
			$scope.hoy = d.getTime();
		};

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

		$scope.mostrarTarifas = function(){
			$http.get('/tarifas').
			  success(function(respuesta) {
					$scope.tarifas = respuesta;
			  }).
			  error(function(data, status, headers, config) {
			    console.log('Error');
			  });
		};

		$scope.mostrarOneTarifa = function(){
			var socio = $scope.socio;
			$http.get('tarifas/' + socio.tarifa._id).
			  success(function(respuesta) {

					$scope.tarifaOnetarifa = {
						nombre: respuesta.nombre,
						precio: respuesta.precio,
						fecha_fin: $scope.hoy.setMonth($scope.hoy.getMonth()+respuesta.duracion)
					};
					socio.tarifa = $scope.tarifaOnetarifa;
			  }).
			  error(function(data, status, headers, config) {
			    console.log('Error OneRutina');
			  });
		};


		$scope.mostrarRutinas = function(){
			$http.get('/rutinas').
			  success(function(respuesta) {
					$scope.rutinas = respuesta;
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

				var jsonUser = {
				  'username': response.dni,
				  'password': response.dni,
					'idSocio': response._id,
				  'roles': ['cliente']
				};

				//Creo una cuenta de user a la misma vez que creo el Cliente
				$http.post('/auth/signup', jsonUser).
				  success(function(respuesta) {
						console.log(respuesta);
				  }).
				  error(function(data, status, headers, config) {
				    console.log('Error');
				  });

				$location.path('socios');

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



					// 	$http.post('/users/accounts', jsonUser).
					// 	  success(function(respuesta) {
					// 			console.log(respuesta);
					// 	  }).
					// 	  error(function(data, status, headers, config) {
					// 	    console.log('Error');
					// 	  });
					//
						$location.path('socios');
					});


				}
		};

		// Update existing Socio
		$scope.update = function() {
			var socio = $scope.socio;
			socio.$update(function() {
				if($scope.authentication.user.roles[0]=== 'cliente'){
					$location.path('/');
				}else{
					$location.path('socios');
				}

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
