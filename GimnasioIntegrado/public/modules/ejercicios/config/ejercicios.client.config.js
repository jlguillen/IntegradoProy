'use strict';

// Configuring the Articles module
angular.module('ejercicios').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Ejercicios', 'ejercicios', 'dropdown', '/ejercicios(/create)?');
		Menus.addSubMenuItem('topbar', 'ejercicios', 'List Ejercicios', 'ejercicios');
		Menus.addSubMenuItem('topbar', 'ejercicios', 'New Ejercicio', 'ejercicios/create');
	}
]);