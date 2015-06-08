'use strict';

//Tarifas service used to communicate Tarifas REST endpoints
angular.module('tarifas').factory('Tarifas', ['$resource',
	function($resource) {
		return $resource('tarifas/:tarifaId', { tarifaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);