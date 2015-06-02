'use strict';

//Socios service used to communicate Socios REST endpoints
angular.module('socios').factory('Socios', ['$resource',
	function($resource) {
		return $resource('socios/:socioId', { socioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);