'use strict';

// Configuring the Articles module
angular.module('rutinas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Rutinas', 'rutinas', 'dropdown', '/rutinas(/create)?');
		Menus.addSubMenuItem('topbar', 'rutinas', 'List Rutinas', 'rutinas');
		Menus.addSubMenuItem('topbar', 'rutinas', 'New Rutina', 'rutinas/create');
	}
]);