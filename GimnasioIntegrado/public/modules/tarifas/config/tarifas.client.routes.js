'use strict';

//Setting up route
angular.module('tarifas').config(['$stateProvider',
	function($stateProvider) {
		// Tarifas state routing
		$stateProvider.
		state('listTarifas', {
			url: '/tarifas',
			templateUrl: 'modules/tarifas/views/list-tarifas.client.view.html'
		});
		// .
		// state('createTarifa', {
		// 	url: '/tarifas/create',
		// 	templateUrl: 'modules/tarifas/views/create-tarifa.client.view.html'
		// }).
		// state('viewTarifa', {
		// 	url: '/tarifas/:tarifaId',
		// 	templateUrl: 'modules/tarifas/views/view-tarifa.client.view.html'
		// }).
		// state('editTarifa', {
		// 	url: '/tarifas/:tarifaId/edit',
		// 	templateUrl: 'modules/tarifas/views/edit-tarifa.client.view.html'
		// });
	}
]);
