'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		$scope.authentication = Authentication;

		$scope.actividadesOculta = true;
		$scope.instalacionesOculta = true;
		$scope.tarifasOculta = true;
		$scope.horarioOculta = true;
		$scope.horarioActividadesOculta = true;

		$scope.mostrarHorario = function(){
			$scope.actividadesOculta = true;
			$scope.instalacionesOculta = true;
			$scope.tarifasOculta = true;
			$scope.horarioOculta = !$scope.horarioOculta;
			$scope.horarioActividadesOculta = true;
		};

		$scope.mostrarActividades = function(){
			$scope.actividadesOculta = !$scope.actividadesOculta;
			$scope.instalacionesOculta = true;
			$scope.tarifasOculta = true;
			$scope.horarioOculta = true;
			$scope.horarioActividadesOculta = true;
		};

		$scope.mostrarInstalaciones = function(){
			$scope.actividadesOculta = true;
			$scope.instalacionesOculta = !$scope.instalacionesOculta;
			$scope.tarifasOculta = true;
			$scope.horarioOculta = true;
			$scope.horarioActividadesOculta = true;
		};

		$scope.mostrarHorarioActividades = function(){
			$scope.instalacionesOculta = true;
			$scope.tarifasOculta = true;
			$scope.horarioOculta = true;
			$scope.horarioActividadesOculta = !$scope.horarioActividadesOculta;
		};

		$scope.mostrarTarifas = function(){
			$http.get('/tarifas').
				success(function(respuesta) {
					$scope.tarifas = respuesta;
					$scope.tarifasOculta = !$scope.tarifasOculta;
					$scope.actividadesOculta = true;
					$scope.instalacionesOculta = true;
					$scope.horarioOculta = true;
					$scope.horarioActividadesOculta = true;
				}).
				error(function(data, status, headers, config) {
					console.log('Error petición get /tarifas');
				});
		};

	}


]);
