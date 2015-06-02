'use strict';

//Setting up route
angular.module('socios').config(['$stateProvider',
	function($stateProvider) {
		// Socios state routing
		$stateProvider.
		state('listSocios', {
			url: '/socios',
			templateUrl: 'modules/socios/views/list-socios.client.view.html'
		}).
		state('createSocio', {
			url: '/socios/create',
			templateUrl: 'modules/socios/views/create-socio.client.view.html'
		}).
		state('viewSocio', {
			url: '/socios/:socioId',
			templateUrl: 'modules/socios/views/view-socio.client.view.html'
		}).
		state('editSocio', {
			url: '/socios/:socioId/edit',
			templateUrl: 'modules/socios/views/edit-socio.client.view.html'
		});
	}
]);