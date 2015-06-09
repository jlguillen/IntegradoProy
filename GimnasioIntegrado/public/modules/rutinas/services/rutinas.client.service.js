'use strict';

//Rutinas service used to communicate Rutinas REST endpoints
angular.module('rutinas').factory('Rutinas', ['$resource',
	function($resource) {
		return $resource('rutinas/:rutinaId', { rutinaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
