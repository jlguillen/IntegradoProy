'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', '$http',

	function($scope, Authentication, $http) {
		$scope.authentication = Authentication;
		
		//Solo pregunto por el rol, si existe el login
			$scope.mostrarSocioCore = function(idSocio){
				if(Authentication.user){

					if(Authentication.user._id.length && Authentication.user.roles[0] === 'cliente'){

						$http.get('/socios/' + idSocio).
						  success(function(respuesta) {
								$scope.socioUser = respuesta;
								// console.log($scope.socioUser);
						  }).
						  error(function(data, status, headers, config) {
						    console.log('Error petición get /socioCore');
						  });
					}
				}
			};

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.$on('$stateChangeSuccess', function() {
			$scope.mostrarSocioCore($scope.authentication.user.idSocio);
			// console.log($scope.authentication);
		});
	}
]);
