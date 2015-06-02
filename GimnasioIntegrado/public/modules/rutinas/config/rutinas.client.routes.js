'use strict';

//Setting up route
angular.module('rutinas').config(['$stateProvider',
	function($stateProvider) {
		// Rutinas state routing
		$stateProvider.
		state('listRutinas', {
			url: '/rutinas',
			templateUrl: 'modules/rutinas/views/list-rutinas.client.view.html'
		}).
		state('createRutina', {
			url: '/rutinas/create',
			templateUrl: 'modules/rutinas/views/create-rutina.client.view.html'
		}).
		state('viewRutina', {
			url: '/rutinas/:rutinaId',
			templateUrl: 'modules/rutinas/views/view-rutina.client.view.html'
		}).
		state('editRutina', {
			url: '/rutinas/:rutinaId/edit',
			templateUrl: 'modules/rutinas/views/edit-rutina.client.view.html'
		});
	}
]);