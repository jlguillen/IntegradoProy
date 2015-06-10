'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$modal',
	function($scope, Authentication, $http, $alert) {
		$scope.authentication = Authentication;


	}


]);
