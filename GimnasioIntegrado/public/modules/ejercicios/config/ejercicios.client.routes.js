'use strict';

//Setting up route
angular.module('ejercicios').config(['$stateProvider',
	function($stateProvider) {
		// Ejercicios state routing
		$stateProvider.
		state('listEjercicios', {
			url: '/ejercicios',
			templateUrl: 'modules/ejercicios/views/list-ejercicios.client.view.html'
		}).
		state('createEjercicio', {
			url: '/ejercicios/create',
			templateUrl: 'modules/ejercicios/views/create-ejercicio.client.view.html'
		}).
		state('editEjercicio', {
			url: '/ejercicios/:ejercicioId/edit',
			templateUrl: 'modules/ejercicios/views/edit-ejercicio.client.view.html'
		});
	}
]);
