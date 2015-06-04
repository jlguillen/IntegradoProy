'use strict';

//Ejercicios service used to communicate Ejercicios REST endpoints
angular.module('ejercicios').factory('Ejercicios', ['$resource',
	function($resource) {
		return $resource('ejercicios/:ejercicioId', { ejercicioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);