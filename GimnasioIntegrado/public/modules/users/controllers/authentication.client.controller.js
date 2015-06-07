'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// Si existe la variable global user (ha iniciado sesion), se le redirecciona al home
		if ($scope.authentication.user) $location.path('/');

		//funcion de registro
		$scope.signup = function() {
			
			$http.post('/auth/signup', $scope.credentials).success(function(response) {

				// Si tiene éxito asignamos la respuesta al modelo global de usuarios
				$scope.authentication.user = response;
				// y redireccionamos a home
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		//funcion de login
		$scope.signin = function() {
			//$scope.credentials es el json con user y password que vienen del form
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// Si tiene éxito asignamos la respuesta al modelo global de usuarios
				$scope.authentication.user = response;

				// y redireccionamos a home
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
